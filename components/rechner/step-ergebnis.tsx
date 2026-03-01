"use client"

import type { CalcResult } from "@/lib/rechner-types"
import { eur } from "@/lib/rechner-calc"
import {
  SectionHeader,
  ResultRow,
  Divider,
  GoldDivider,
  ResultCard,
  Disclaimer,
} from "./ui-parts"

interface Props {
  calc: CalcResult
  gebaeudeWert: number
}

export function StepErgebnis({ calc, gebaeudeWert }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SectionHeader
            icon="chart"
            title="Einkuenfte V+V (Jahr 1)"
            subtitle="Steuerliche Betrachtung"
          />
          <ResultCard>
            <ResultRow
              label="Mieteinnahmen"
              value={`+ ${eur(calc.j1.miete)}`}
            />
            <ResultRow
              label="Zinsen"
              value={`- ${eur(calc.j1.zinsen)}`}
              negative
            />
            <ResultRow
              label="Verwaltung"
              value={`- ${eur(calc.j1.verwaltung)}`}
              negative
            />
            <ResultRow
              label="Einmalige Werbungskosten"
              value={`- ${eur(calc.j1.einmalig)}`}
              negative
            />
            <ResultRow
              label="AfA degressiv (5%)"
              value={`- ${eur(calc.j1.afaDegr)}`}
              negative
            />
            <ResultRow
              label={"Sonder-AfA \u00A77b (5%)"}
              value={`- ${eur(calc.j1.afaSonder)}`}
              negative
            />
            <Divider />
            <ResultRow
              label="Steuerliches Ergebnis"
              value={eur(calc.j1.steuerErgebnis)}
              bold
            />
            <ResultRow
              label="Steuerwirkung"
              value={eur(Math.abs(calc.j1.steuerWirkung))}
              highlight
            />
          </ResultCard>
        </div>

        <div>
          <SectionHeader
            icon="trending"
            title="Cashflow (Jahr 1)"
            subtitle="Was bleibt monatlich?"
          />
          <ResultCard>
            <div className="text-[11px] text-primary font-mono tracking-[2px] mb-2">
              EINNAHMEN
            </div>
            <ResultRow
              label="Kaltmiete"
              value={`+ ${eur(calc.mieteJahr)}`}
            />
            <ResultRow
              label="Steuererstattung"
              value={`+ ${eur(Math.abs(calc.j1.steuerWirkung))}`}
            />
            <Divider />
            <div className="text-[11px] text-negative font-mono tracking-[2px] mb-2 mt-2">
              AUSGABEN
            </div>
            <ResultRow
              label="Rate Darlehen 1"
              value={`- ${eur(calc.j1.rate1)}`}
            />
            <ResultRow
              label="Rate Darlehen 2"
              value={`- ${eur(calc.j1.rate2)}`}
            />
            <ResultRow
              label="Verwaltung"
              value={`- ${eur(calc.j1.verwaltung)}`}
            />
            <ResultRow
              label="Instandhaltung"
              value={`- ${eur(gebaeudeWert * 0.00036 * 12)}`}
            />
            <GoldDivider />
            <ResultRow
              label="Aufwand p.a."
              value={eur(calc.aufwandJ1)}
              bold
            />
            <ResultRow
              label="AUFWAND PRO MONAT"
              value={eur(calc.aufwandMonat, 2)}
              highlight
            />
          </ResultCard>
        </div>
      </div>

      <Disclaimer />
    </>
  )
}
