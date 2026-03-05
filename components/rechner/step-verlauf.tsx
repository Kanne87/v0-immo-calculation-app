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
      "Vermögen": Math.round(immobilienwert - j.restschuldGesamt),
    }
  })

  const cols = [
    { key: "j", label: "J.", w: "w-8" },
    { key: "miete", label: "Miete", w: "" },
    { key: "rate1", label: `${darlehen1Label}`, w: "" },
    { key: "restschuld1", label: `Rest 1`, w: "" },
    { key: "rate2", label: `${darlehen2Label}`, w: "" },
    { key: "restschuld2", label: `Rest 2`, w: "" },
    { key: "afaDegr", label: "AfA d.", w: "" },
    { key: "afaSonder", label: "§7b", w: "" },
    { key: "steuerErgebnis", label: "Steuerl.", w: "" },
    { key: "steuerWirkung", label: "St.wirk.", w: "" },
    { key: "ueberschuss", label: "Übersch.", w: "" },
  ]

  return (
    <>
      <SectionHeader
        icon="trending"
        title="10-Jahres-Verlauf"
        subtitle="Miete, AfA, Restschuld, Steuerwirkung, Cashflow"
      />

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full border-collapse text-[9px] font-mono" style={{ minWidth: 700 }}>
          <thead>
            <tr className="bg-secondary">
              {cols.map((c, i) => (
                <th
                  key={i}
                  className={`py-1 px-1.5 text-primary font-semibold text-[8px] border-b border-border whitespace-nowrap ${c.w}`}
                  style={{ textAlign: i === 0 ? "center" : "right" }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calc.jahre.map((j, i) => {
              return (
                <tr key={i} className={i % 2 ? "bg-foreground/[0.02]" : "bg-transparent"}>
                  <td className="py-1 px-1.5 text-center text-subtle">{j.j}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/70">{fmt(j.miete)}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/70">{fmt(j.rate1)}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/50">{fmt(j.restschuld1)}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/70">{fmt(j.rate2)}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/50">{fmt(j.restschuld2)}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/70">{fmt(j.afaDegr)}</td>
                  <td className="py-1 px-1.5 text-right text-foreground/50">{j.afaSonder > 0 ? fmt(j.afaSonder) : "—"}</td>
                  <td className={`py-1 px-1.5 text-right ${j.steuerErgebnis < 0 ? "text-red-500" : "text-green-600"}`}>{fmt(j.steuerErgebnis)}</td>
                  <td className={`py-1 px-1.5 text-right ${j.steuerWirkung < 0 ? "text-primary" : "text-foreground/70"}`}>{fmt(j.steuerWirkung)}</td>
                  <td className={`py-1 px-1.5 text-right font-semibold ${j.ueberschuss >= 0 ? "text-green-600" : "text-red-500"}`}>{fmt(j.ueberschuss)}</td>
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--subtle)", fontSize: 10 }} stroke="var(--border)" />
              <YAxis tick={{ fill: "var(--subtle)", fontSize: 10 }} stroke="var(--border)"
                tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)", fontSize: 11 }}
                formatter={(value: number) => eur(value)}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "var(--subtle)" }} />
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
