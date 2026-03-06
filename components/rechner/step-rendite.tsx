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
  const isUeberschuss = calc.avgMonat >= 0

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
        title="Vermögensbildung"
        subtitle="10-Jahres-Ergebnis"
      />

      <div className="bg-surface rounded-lg p-3 sm:p-4 border border-border">
        <div className="text-[11px] text-dimmed mb-3 text-center font-mono">
          Vermögensbildung in 10 Jahren
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barGap={4} margin={{ top: 4, right: 4, left: -10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#8a8a9a", fontSize: 11 }}
              stroke="#1a1a2e"
            />
            <YAxis
              tick={{ fill: "#5a5a7a", fontSize: 9 }}
              stroke="#1a1a2e"
              tickFormatter={(v: number) =>
                `${Math.round(v / 1000)}k`
              }
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: "#12121f",
                border: "1px solid #2a2a3e",
                borderRadius: 8,
                color: "#e0e0f0",
                fontSize: 11,
              }}
              formatter={(value: number) => eur(value)}
            />
            <Bar
              dataKey="Immobilienwert"
              fill="#3a5aaa"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Restschuld"
              fill="#aa3a3a"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Vermoegen"
              fill="#4a8a4a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        {/* Custom legend – besser lesbar als recharts Legend auf Mobile */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-dimmed">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3a5aaa] inline-block" />Immobilienwert
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-dimmed">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#aa3a3a] inline-block" />Restschuld
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-dimmed">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#4a8a4a] inline-block" />Vermögen
          </span>
        </div>
      </div>

      <div className="mt-4">
        <ResultCard>
          <ResultRow
            label="Eingesetztes Eigenkapital"
            value={eur(eigenkapital)}
            bold
          />
          <ResultRow
            label={isUeberschuss ? "Ø mtl. Überschuss" : "Ø mtl. Zuschuss"}
            value={`${isUeberschuss ? "+ " : ""}${eur(calc.avgMonat, 2)}`}
            bold
          />
          <Divider />
          <ResultRow
            label="Immobilienwert (10 J.)"
            value={eur(calc.wertsteigerung)}
          />
          <ResultRow
            label="Restschuld (10 J.)"
            value={`− ${eur(calc.restschuldEnde)}`}
            negative
          />
          <Divider />
          <ResultRow
            label="Steuerfreier Gewinn"
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
            label="EK-RENDITE P.A."
            value={pct(calc.rendite)}
            highlight
          />
          <ResultRow
            label="Gesamt (10 J.)"
            value={pct(calc.renditeGesamt)}
            indent
          />
        </ResultCard>
      </div>

      <Disclaimer />
    </>
  )
}
