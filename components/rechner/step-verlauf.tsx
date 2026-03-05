"use client"

import type { CalcResult } from "@/lib/rechner-types"
import { fmt, eur } from "@/lib/rechner-calc"
import { SectionHeader, ResultRow, HighlightCard } from "./ui-parts"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"

interface Props {
  calc: CalcResult
  gesamtKP: number
  inflation: number
  darlehen1Label?: string
  darlehen2Label?: string
}

export function StepVerlauf({ calc, gesamtKP, inflation, darlehen1Label = "D1", darlehen2Label = "D2" }: Props) {
  const chartData = calc.jahre.map((j) => {
    const immobilienwert = gesamtKP * Math.pow(1 + inflation / 100, j.j)
    return {
      name: `J${j.j}`,
      Restschuld: Math.round(j.restschuldGesamt),
      Immobilienwert: Math.round(immobilienwert),
      Vermögen: Math.round(immobilienwert - j.restschuldGesamt),
    }
  })

  const cols = [
    { key: "j", label: "J.", align: "center" as const, cls: "text-subtle" },
    { key: "miete", label: "Miete", align: "right" as const, cls: "text-foreground/70" },
    { key: "rate1", label: `Rate ${darlehen1Label}`, align: "right" as const, cls: "text-foreground/70" },
    { key: "restschuld1", label: `Rest ${darlehen1Label}`, align: "right" as const, cls: "text-foreground/60" },
    { key: "rate2", label: `Rate ${darlehen2Label}`, align: "right" as const, cls: "text-foreground/70" },
    { key: "restschuld2", label: `Rest ${darlehen2Label}`, align: "right" as const, cls: "text-foreground/60" },
    { key: "afaDegr", label: "AfA degr.", align: "right" as const, cls: "text-foreground/70" },
    { key: "afaSonder", label: "AfA §7b", align: "right" as const, cls: "text-foreground/70" },
    { key: "steuerErgebnis", label: "Steuerl.", align: "right" as const, cls: "" },
    { key: "steuerWirkung", label: "Steuerwirk.", align: "right" as const, cls: "" },
    { key: "ueberschuss", label: "Überschuss", align: "right" as const, cls: "" },
  ]

  return (
    <>
      <SectionHeader
        icon="trending"
        title="10-Jahres-Verlauf"
        subtitle="Miete, AfA, Restschuld, Steuerwirkung, Cashflow"
      />

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="border-collapse text-[10px] font-mono" style={{ minWidth: 860 }}>
          <thead>
            <tr className="bg-secondary">
              {cols.map((c, i) => (
                <th
                  key={i}
                  className="py-1.5 px-2 text-primary font-semibold text-[9px] border-b border-border whitespace-nowrap"
                  style={{ textAlign: c.align }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calc.jahre.map((j, i) => {
              const cells = [
                { val: String(j.j), raw: j.j, align: "center" as const, cls: "text-subtle" },
                { val: fmt(j.miete), raw: j.miete, align: "right" as const, cls: "text-foreground/70" },
                { val: fmt(j.rate1), raw: j.rate1, align: "right" as const, cls: "text-foreground/70" },
                { val: fmt(j.restschuld1), raw: j.restschuld1, align: "right" as const, cls: "text-foreground/50" },
                { val: fmt(j.rate2), raw: j.rate2, align: "right" as const, cls: "text-foreground/70" },
                { val: fmt(j.restschuld2), raw: j.restschuld2, align: "right" as const, cls: "text-foreground/50" },
                { val: fmt(j.afaDegr), raw: j.afaDegr, align: "right" as const, cls: "text-foreground/70" },
                { val: j.afaSonder > 0 ? fmt(j.afaSonder) : "—", raw: j.afaSonder, align: "right" as const, cls: "text-foreground/50" },
                {
                  val: fmt(j.steuerErgebnis),
                  raw: j.steuerErgebnis,
                  align: "right" as const,
                  cls: j.steuerErgebnis < 0 ? "text-red-500" : "text-green-600",
                },
                {
                  val: fmt(j.steuerWirkung),
                  raw: j.steuerWirkung,
                  align: "right" as const,
                  cls: j.steuerWirkung < 0 ? "text-primary" : "text-foreground/70",
                },
                {
                  val: fmt(j.ueberschuss),
                  raw: j.ueberschuss,
                  align: "right" as const,
                  cls: j.ueberschuss >= 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold",
                },
              ]
              return (
                <tr key={i} className={i % 2 ? "bg-foreground/[0.02]" : "bg-transparent"}>
                  {cells.map((c, ci) => (
                    <td key={ci} className={`py-1.5 px-2 ${c.cls}`} style={{ textAlign: c.align }}>
                      {c.val}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <HighlightCard>
          <ResultRow label="Kum. Steuerersparnis (10 J.)" value={eur(calc.kumSteuer)} highlight />
          <ResultRow label="Kum. Tilgung (10 J.)" value={eur(calc.kumTilgung)} bold />
          <ResultRow label="Restschuld nach 10 Jahren" value={eur(calc.restschuldEnde)} bold />
        </HighlightCard>
      </div>

      <div className="mt-6">
        <SectionHeader
          icon="chart"
          title="Vermögensentwicklung"
          subtitle="Immobilienwert, Restschuld und Vermögen"
        />
        <div className="bg-surface rounded-lg p-4 border border-border">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis dataKey="name" tick={{ fill: "#5a5a7a", fontSize: 10 }} stroke="#1a1a2e" />
              <YAxis tick={{ fill: "#5a5a7a", fontSize: 10 }} stroke="#1a1a2e"
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                contentStyle={{ background: "#12121f", border: "1px solid #2a2a3e", borderRadius: 8, color: "#e0e0f0", fontSize: 11 }}
                formatter={(value: number) => eur(value)}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#8a8a9a" }} />
              <Line type="monotone" dataKey="Immobilienwert" stroke="#3a5aaa" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Restschuld" stroke="#aa3a3a" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Vermögen" stroke="#4a8a4a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
