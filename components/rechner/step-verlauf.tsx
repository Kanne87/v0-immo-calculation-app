"use client"

import type { CalcResult } from "@/lib/rechner-types"
import { fmt, eur } from "@/lib/rechner-calc"
import { SectionHeader, ResultRow, HighlightCard } from "./ui-parts"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useChartColors } from "@/hooks/use-chart-colors"

interface Props {
  calc: CalcResult
  gesamtKP: number
  inflation: number
}

export function StepVerlauf({ calc, gesamtKP, inflation }: Props) {
  const cc = useChartColors()
  const chartData = calc.jahre.map((j) => {
    const immobilienwert =
      gesamtKP * Math.pow(1 + inflation / 100, j.j)
    return {
      name: `J${j.j}`,
      Restschuld: Math.round(j.restschuldGesamt),
      Immobilienwert: Math.round(immobilienwert),
      Vermoegen: Math.round(immobilienwert - j.restschuldGesamt),
    }
  })

  return (
    <>
      <SectionHeader
        icon="trending"
        title="10-Jahres-Verlauf"
        subtitle="Miete, AfA, Restschuld, Steuerwirkung"
      />

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full border-collapse text-[10px] font-mono min-w-[600px]">
          <thead>
            <tr className="bg-secondary">
              {[
                "J.",
                "Miete",
                "AfA ges.",
                "Steuerl.",
                "Steuer-\nwirkung",
                "Restschuld",
              ].map((h, i) => (
                <th
                  key={i}
                  className="py-1.5 px-1 text-primary font-semibold text-[9px] border-b border-border whitespace-pre-line"
                  style={{ textAlign: i === 0 ? "center" : "right" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calc.jahre.map((j, i) => (
              <tr
                key={i}
                className={
                  i % 2 ? "bg-foreground/[0.02]" : "bg-transparent"
                }
              >
                <td className="py-1 px-1 text-center text-subtle">
                  {j.j}
                </td>
                <td className="py-1 px-1 text-right text-foreground/70">
                  {fmt(j.miete)}
                </td>
                <td className="py-1 px-1 text-right text-foreground/70">
                  {fmt(j.afaDegr + j.afaSonder)}
                </td>
                <td
                  className={`py-1 px-1 text-right ${
                    j.steuerErgebnis < 0
                      ? "text-negative"
                      : "text-positive"
                  }`}
                >
                  {fmt(j.steuerErgebnis)}
                </td>
                <td
                  className={`py-1 px-1 text-right ${
                    j.steuerWirkung < 0
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {fmt(j.steuerWirkung)}
                </td>
                <td className="py-1 px-1 text-right text-foreground font-medium">
                  {fmt(j.restschuldGesamt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <HighlightCard>
          <ResultRow
            label="Kum. Steuerersparnis (10 J.)"
            value={eur(calc.kumSteuer)}
            highlight
          />
          <ResultRow
            label="Kum. Tilgung (10 J.)"
            value={eur(calc.kumTilgung)}
            bold
          />
          <ResultRow
            label="Restschuld nach 10 Jahren"
            value={eur(calc.restschuldEnde)}
            bold
          />
        </HighlightCard>
      </div>

      <div className="mt-6">
        <SectionHeader
          icon="chart"
          title="Vermoegensentwicklung"
          subtitle="Immobilienwert, Restschuld und Vermoegen"
        />
        <div className="bg-surface rounded-lg p-4 border border-border">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={cc.gridStroke} />
              <XAxis
                dataKey="name"
                tick={{ fill: cc.subtle, fontSize: 10 }}
                stroke={cc.gridStroke}
              />
              <YAxis
                tick={{ fill: cc.subtle, fontSize: 10 }}
                stroke={cc.gridStroke}
                tickFormatter={(v: number) =>
                  `${Math.round(v / 1000)}k`
                }
              />
              <Tooltip
                contentStyle={{
                  background: cc.tooltipBg,
                  border: `1px solid ${cc.tooltipBorder}`,
                  borderRadius: 8,
                  color: cc.foreground,
                  fontSize: 11,
                }}
                formatter={(value: number) => eur(value)}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: cc.dimmed }}
              />
              <Line
                type="monotone"
                dataKey="Immobilienwert"
                stroke={cc.chart1}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Restschuld"
                stroke={cc.chart2}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Vermoegen"
                stroke={cc.chart3}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
