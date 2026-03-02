"use client"

import type { CalcResult } from "@/lib/rechner-types"
import { eur, pct } from "@/lib/rechner-calc"
import {
  SectionHeader,
  ResultRow,
  Divider,
  GoldDivider,
  ResultCard,
  Disclaimer,
} from "./ui-parts"
import {
  BarChart,
  Bar,
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
  eigenkapital: number
  darlehen1: number
  darlehen2: number
}

export function StepRendite({
  calc,
  eigenkapital,
  darlehen1,
  darlehen2,
}: Props) {
  const cc = useChartColors()
  const chartData = [
    {
      name: "Heute",
      Immobilienwert: Math.round(calc.gesamtKP),
      Restschuld: Math.round(darlehen1 + darlehen2),
      Vermoegen: 0,
    },
    {
      name: "In 10 Jahren",
      Immobilienwert: Math.round(calc.wertsteigerung),
      Restschuld: Math.round(calc.restschuldEnde),
      Vermoegen: Math.round(calc.vermoegenEnde),
    },
  ]

  return (
    <>
      <SectionHeader
        icon="trophy"
        title="Vermoegensbildung"
        subtitle="10-Jahres-Ergebnis"
      />

      <div className="bg-surface rounded-lg p-4 border border-border">
        <div className="text-xs text-dimmed mb-3 text-center font-mono">
          Vermoegensbildung in 10 Jahren
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke={cc.gridStroke} />
            <XAxis
              dataKey="name"
              tick={{ fill: cc.dimmed, fontSize: 11 }}
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
            <Bar
              dataKey="Immobilienwert"
              fill={cc.chart1}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Restschuld"
              fill={cc.chart2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Vermoegen"
              fill={cc.chart3}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <ResultCard>
          <ResultRow
            label="Eingesetztes Eigenkapital"
            value={eur(eigenkapital)}
            bold
          />
          <ResultRow
            label="Durchschn. mtl. Aufwand"
            value={eur(calc.avgMonat, 2)}
            bold
          />
          <Divider />
          <ResultRow
            label="Immobilienwert (10 J.)"
            value={eur(calc.wertsteigerung)}
          />
          <ResultRow
            label="Restschuld (10 J.)"
            value={`- ${eur(calc.restschuldEnde)}`}
            negative
          />
          <Divider />
          <ResultRow
            label={"Moeglicher steuerfreier Gewinn"}
            value={eur(calc.vermoegenEnde)}
            highlight
          />
          <ResultRow
            label="davon Steuerersparnis"
            value={eur(calc.kumSteuer)}
            indent
          />
          <GoldDivider />
          <ResultRow
            label="RENDITE NACH STEUER"
            value={pct(calc.rendite)}
            highlight
          />
        </ResultCard>
      </div>

      <Disclaimer />
    </>
  )
}
