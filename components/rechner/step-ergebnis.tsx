"use client"

import { useState } from "react"
import type { CalcResult } from "@/lib/rechner-types"
import type { ProjectData } from "@/lib/rechner-types"
import { MABV_STUFEN } from "@/lib/rechner-types"
import { eur, fmt, mabvMonatSkaliert } from "@/lib/rechner-calc"
import {
  SectionHeader, ResultRow, Divider, GoldDivider, ResultCard, Disclaimer,
} from "./ui-parts"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Props {
  calc: CalcResult
  gebaeudeWert: number
  data: ProjectData
}

// Datum aus Baubeginn + Monate berechnen
function addMonths(isoDate: string, months: number): string {
  const d = new Date(isoDate)
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("de-DE", { month: "2-digit", year: "numeric" })
}

export function StepErgebnis({ calc, gebaeudeWert, data }: Props) {
  const steuerErsparnis = Math.abs(calc.j1.steuerWirkung)
  const isUeberschuss = calc.aufwandJ1 >= 0
  const [showMabv, setShowMabv] = useState(false)

  // MaBV Bauzeitzinsen-Simulation
  const darlehenGesamt = data.darlehen1 + data.darlehen2
  const gewZins = darlehenGesamt > 0
    ? (data.darlehen1 * data.zins1 + data.darlehen2 * data.zins2) / darlehenGesamt / 100
    : 0
  const monate = calc.bauzeitMonate

  let kumulierteZinsen = 0
  const mabvData = MABV_STUFEN.map((stufe, i) => {
    const betrag = Math.round(darlehenGesamt * stufe.pct)
    const abrufMonat = mabvMonatSkaliert(stufe.monatRef, monate)
    const restMonate = monate - abrufMonat
    const zinsen = restMonate > 0 ? betrag * gewZins * (restMonate / 12) : 0
    kumulierteZinsen += zinsen
    return {
      name: stufe.label.replace("inkl. ", "").replace("Heizung/Sanitaer/Elektro", "HLS").split(" ")[0],
      label: stufe.label,
      monat: abrufMonat,
      datum: addMonths(data.baubeginn, abrufMonat),
      pct: Math.round(stufe.pct * 100),
      betrag,
      zinsen: Math.round(zinsen),
      kumuliert: Math.round(kumulierteZinsen),
    }
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SectionHeader icon="chart" title="Einkünfte V+V (Jahr 1)" subtitle="Steuerliche Betrachtung" />
          <ResultCard>
            <ResultRow label="Mieteinnahmen" value={`+ ${eur(calc.j1.miete)}`} />
            <ResultRow label="Zinsen" value={`− ${eur(calc.j1.zinsen)}`} negative />
            <ResultRow label="Verwaltung" value={`− ${eur(calc.j1.verwaltung)}`} negative />
            <ResultRow label="Einmalige Werbungskosten" value={`− ${eur(calc.j1.einmalig)}`} negative />
            <ResultRow label="AfA degressiv (5%)" value={`− ${eur(calc.j1.afaDegr)}`} negative />
            {calc.sonder7bBerechtigt ? (
              <ResultRow label="Sonder-AfA §7b (5%)" value={`− ${eur(calc.j1.afaSonder)}`} negative />
            ) : (
              <div className="flex justify-between items-center py-1">
                <span className="text-[11px] text-subtle font-mono">Sonder-AfA §7b</span>
                <span className="text-[11px] text-amber-400 font-mono">
                  entfällt ({fmt(calc.gebaeudeKostenProQmBGF, 0)} €/m² BGF &gt; 5.200)
                </span>
              </div>
            )}
            <Divider />
            <ResultRow label="Steuerliches Ergebnis" value={eur(calc.j1.steuerErgebnis)} bold />
            <ResultRow
              label={calc.j1.steuerWirkung < 0 ? "Steuererstattung" : "Steuerlast"}
              value={eur(steuerErsparnis)}
              highlight
            />
          </ResultCard>
        </div>

        <div>
          <SectionHeader icon="trending" title="Cashflow (Jahr 1)" subtitle="Was bleibt monatlich?" />
          <ResultCard>
            <div className="text-[11px] text-primary font-mono tracking-[2px] mb-2">EINNAHMEN</div>
            <ResultRow label="Kaltmiete" value={`+ ${eur(calc.mieteJahr)}`} />
            <ResultRow label="Steuererstattung" value={`+ ${eur(steuerErsparnis)}`} />
            <Divider />
            <div className="text-[11px] text-negative font-mono tracking-[2px] mb-2 mt-2">AUSGABEN</div>
            <ResultRow label={`Rate ${data.darlehen1Label}`} value={`− ${eur(calc.j1.rate1)}`} />
            <ResultRow label={`Rate ${data.darlehen2Label}`} value={`− ${eur(calc.j1.rate2)}`} />
            <ResultRow label="Verwaltung" value={`− ${eur(calc.j1.verwaltung)}`} />
            <ResultRow label="Instandhaltung" value={`− ${eur(gebaeudeWert * 0.00036 * 12)}`} />
            <GoldDivider />
            <ResultRow label="Cashflow p.a." value={`${isUeberschuss ? "+ " : ""}${eur(calc.aufwandJ1)}`} bold />
            <ResultRow
              label={isUeberschuss ? "ÜBERSCHUSS PRO MONAT" : "ZUSCHUSS PRO MONAT"}
              value={`${isUeberschuss ? "+ " : ""}${eur(calc.aufwandMonat, 2)}`}
              highlight
            />
          </ResultCard>
        </div>
      </div>

      {/* Bauzeitzinsen */}
      <div className="mt-4 rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setShowMabv(!showMabv)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
        >
          <div className="text-left">
            <div className="text-[11px] font-mono text-foreground font-semibold">
              Bauabschnittsabruf – MaBV-Simulation
            </div>
            <div className="text-[10px] font-mono text-subtle mt-0.5">
              Bauzeit {monate} Monate · Bauzeitzinsen {eur(calc.bauzeitZinsen)} · Ø-Zins {fmt(gewZins * 100, 2)} %
            </div>
          </div>
          {showMabv
            ? <ChevronUp className="w-4 h-4 text-subtle flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-subtle flex-shrink-0" />}
        </button>

        {showMabv && (
          <div className="px-4 pb-4">
            {/* Tabelle */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-[10px] font-mono" style={{ minWidth: 640 }}>
                <thead>
                  <tr className="bg-secondary">
                    {["Bauabschnitt", "Monat", "Datum", "%", "Abruf (€)", "Zinsen (€)", "Kum. Zinsen (€)"].map((h, i) => (
                      <th key={i} className="py-1.5 px-2 text-primary text-[9px] font-semibold border-b border-border"
                        style={{ textAlign: i === 0 ? "left" : "right" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mabvData.map((row, i) => (
                    <tr key={i} className={i % 2 ? "bg-foreground/[0.02]" : ""}>
                      <td className="py-1.5 px-2 text-foreground/80">{MABV_STUFEN[i].label}</td>
                      <td className="py-1.5 px-2 text-right text-subtle">{row.monat}</td>
                      <td className="py-1.5 px-2 text-right text-subtle">{row.datum}</td>
                      <td className="py-1.5 px-2 text-right text-subtle">{row.pct} %</td>
                      <td className="py-1.5 px-2 text-right text-foreground/70">{fmt(row.betrag)}</td>
                      <td className="py-1.5 px-2 text-right text-primary">{fmt(row.zinsen)}</td>
                      <td className="py-1.5 px-2 text-right text-foreground font-semibold">{fmt(row.kumuliert)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/30">
                    <td className="py-1.5 px-2 text-foreground font-semibold" colSpan={4}>Summe</td>
                    <td className="py-1.5 px-2 text-right text-foreground font-semibold">{fmt(darlehenGesamt)}</td>
                    <td className="py-1.5 px-2 text-right text-primary font-semibold">{fmt(calc.bauzeitZinsen)}</td>
                    <td className="py-1.5 px-2 text-right text-foreground font-semibold">{fmt(calc.bauzeitZinsen)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Chart: Abruf-Balken + Kumulierte Zinsen-Linie */}
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mabvData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e5e5)" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    formatter={(value: number, name: string) => [
                      eur(value),
                      name === "betrag" ? "Abruf" : name === "kumuliert" ? "Kum. Zinsen" : name,
                    ]}
                    labelFormatter={(label: string, payload) => {
                      const row = payload?.[0]?.payload
                      return row ? `${row.label} (Monat ${row.monat}, ${row.datum})` : label
                    }}
                  />
                  <Bar yAxisId="left" dataKey="betrag" name="Abruf" fill="#3a5aaa" radius={[3, 3, 0, 0]} opacity={0.8} />
                  <Line yAxisId="right" type="monotone" dataKey="kumuliert" name="Kum. Zinsen"
                    stroke="#b07a20" strokeWidth={2} dot={{ r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center gap-4 text-[9px] font-mono text-subtle">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#3a5aaa] rounded-sm inline-block" /> Darlehensabruf je Stufe</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#b07a20] inline-block" /> Kumulierte Bauzeitzinsen</span>
            </div>
          </div>
        )}
      </div>

      <Disclaimer />
    </>
  )
}
