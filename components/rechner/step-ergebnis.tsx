"use client"

import type { CalcResult } from "@/lib/rechner-types"
import { eur, fmt } from "@/lib/rechner-calc"
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
  // Steuererstattung (positiver Wert fuer Anzeige)
  const steuerErsparnis = Math.abs(calc.j1.steuerWirkung)

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
              value={`\u2212 ${eur(calc.j1.zinsen)}`}
              negative
            />
            <ResultRow
              label="Verwaltung"
              value={`\u2212 ${eur(calc.j1.verwaltung)}`}
              negative
            />
            <ResultRow
              label="Einmalige Werbungskosten"
              value={`\u2212 ${eur(calc.j1.einmalig)}`}
              negative
            />
            <ResultRow
              label="AfA degressiv (5%)"
              value={`\u2212 ${eur(calc.j1.afaDegr)}`}
              negative
            />
            {calc.sonder7bBerechtigt ? (
              <ResultRow
                label={`Sonder-AfA \u00A77b (5%)`}
                value={`\u2212 ${eur(calc.j1.afaSonder)}`}
                negative
              />
            ) : (
              <div className="flex justify-between items-center py-1">
                <span className="text-[11px] text-subtle font-mono">
                  {`Sonder-AfA \u00A77b`}
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {`entf\u00E4llt (${fmt(calc.gebaeudeKostenProQmBGF, 0)} \u20AC/m\u00B2 BGF > 5.200)`}
                </span>
              </div>
            )}
            <Divider />
            <ResultRow
              label="Steuerliches Ergebnis"
              value={eur(calc.j1.steuerErgebnis)}
              bold
            />
            <ResultRow
              label={calc.j1.steuerWirkung < 0 ? "Steuererstattung" : "Steuerlast"}
              value={eur(steuerErsparnis)}
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
              value={`+ ${eur(steuerErsparnis)}`}
            />
            <Divider />
            <div className="text-[11px] text-negative font-mono tracking-[2px] mb-2 mt-2">
              AUSGABEN
            </div>
            <ResultRow
              label="Rate Darlehen 1"
              value={`\u2212 ${eur(calc.j1.rate1)}`}
            />
            <ResultRow
              label="Rate Darlehen 2"
              value={`\u2212 ${eur(calc.j1.rate2)}`}
            />
            <ResultRow
              label="Verwaltung"
              value={`\u2212 ${eur(calc.j1.verwaltung)}`}
            />
            <ResultRow
              label="Instandhaltung"
              value={`\u2212 ${eur(gebaeudeWert * 0.00036 * 12)}`}
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
