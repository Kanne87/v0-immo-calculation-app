"use client"

import type { ProjectData, CalcResult } from "@/lib/rechner-types"
import { eur } from "@/lib/rechner-calc"
import { FieldInput } from "./field-input"
import { SectionHeader, ResultRow, Divider, ResultCard } from "./ui-parts"

interface Props {
  data: ProjectData
  calc: CalcResult
  onChange: <K extends keyof ProjectData>(key: K, val: ProjectData[K]) => void
  readOnly?: boolean
  isTemplate?: boolean
}

export function StepObjekt({ data, calc, onChange, readOnly, isTemplate }: Props) {
  const anschaffungsNK = calc.gestBetrag + calc.notarBetrag + calc.bauzeitZinsen
  const gesamtKP = data.kaufpreis + data.stellplatz
  const objLocked = readOnly || isTemplate

  return (
    <>
      <SectionHeader icon="building" title="Objektdaten" subtitle="Wohnung und Kaufpreis" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput label="Wohnfläche" value={data.wfl} onChange={(v) => onChange("wfl", v)} suffix="m²" step={0.01} disabled={objLocked} />
        <FieldInput label="BGF" value={data.bgf} onChange={(v) => onChange("bgf", v)} suffix="m²" step={0.01} disabled={objLocked} />
        <FieldInput label="Kaufpreis Wohnung" value={data.kaufpreis} onChange={(v) => onChange("kaufpreis", v)} suffix="€" step={1000} disabled={objLocked} />
        <FieldInput label="davon Grundstück" value={data.grundstueck} onChange={(v) => onChange("grundstueck", v)} suffix="€" step={1000} disabled={objLocked} />
        <FieldInput label="Stellplatz" value={data.stellplatz} onChange={(v) => onChange("stellplatz", v)} suffix="€" step={1000} disabled={objLocked} />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">Gesamtkaufpreis</div>
          <div className="text-lg text-primary font-serif py-1.5">{eur(gesamtKP)}</div>
        </div>
      </div>

      <SectionHeader icon="receipt" title="Nebenkosten & Bauzeit" subtitle="Berlin = 6,0% GrESt, kein Makler (Direktvertrieb)" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput label="Grunderwerbsteuer" value={data.gestPct} onChange={(v) => onChange("gestPct", v)} suffix="%" step={0.1} disabled={objLocked} />
        <FieldInput label="Notar + Grundbuch" value={data.notarPct} onChange={(v) => onChange("notarPct", v)} suffix="%" step={0.1} disabled={objLocked} />
        <FieldInput label="Grundschuldgebühren" value={data.grundschuldPct} onChange={(v) => onChange("grundschuldPct", v)} suffix="%" step={0.1} disabled={objLocked} />
        <div />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">Baubeginn</div>
          <input type="date" value={data.baubeginn} onChange={(e) => onChange("baubeginn", e.target.value)} disabled={objLocked}
            className="w-full text-sm font-mono bg-transparent border border-border rounded px-2 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">Fertigstellung (geplant)</div>
          <input type="date" value={data.fertigstellung} onChange={(e) => onChange("fertigstellung", e.target.value)} disabled={objLocked}
            className="w-full text-sm font-mono bg-transparent border border-border rounded px-2 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" />
        </div>
      </div>

      <ResultCard>
        <div className="text-[10px] text-subtle uppercase tracking-wider mb-2">Anschaffungsnebenkosten → erhöhen AfA-Basis</div>
        <ResultRow label="Grunderwerbsteuer" value={eur(calc.gestBetrag)} />
        <ResultRow label="Notar + Grundbuch" value={eur(calc.notarBetrag)} />
        <ResultRow label={`Bauzeitzinsen (${calc.bauzeitMonate} Mon. MaBV)`} value={eur(calc.bauzeitZinsen)} />
        <div className="text-[10px] text-subtle mt-0.5 mb-2 pl-1">
          MaBV-Auszahlungsstufen mit gew. Ø-Zins, Bauzeit {data.baubeginn} bis {data.fertigstellung}
        </div>
        <Divider />
        <ResultRow label="Summe Anschaffungs-NK" value={eur(anschaffungsNK)} bold />

        <div className="mt-3 text-[10px] text-subtle uppercase tracking-wider mb-2">Sofort absetzbare Werbungskosten (Jahr 1)</div>
        <ResultRow label="Grundschuldgebühren" value={eur(calc.grundschuldBetrag)} />
        <Divider />
        <ResultRow label="Nebenkosten gesamt" value={eur(calc.nkGesamt)} bold />
      </ResultCard>

      <div className="mt-3 mb-1 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <ResultRow label="GESAMTINVESTITION" value={eur(calc.gesamtInvest)} highlight />
      </div>

      <ResultCard>
        <ResultRow label="AfA-Bemessungsgrundlage" value={eur(calc.gebaeudeWert)} bold />
        <div className="text-[10px] text-subtle mt-1">
          = Kaufpreis {eur(data.kaufpreis)} − Grundstück {eur(data.grundstueck)} + Stellplatz {eur(data.stellplatz)} + Anschaffungs-NK {eur(anschaffungsNK)}
        </div>
      </ResultCard>

      {calc.sonder7bBerechtigt ? (
        <div className="text-[10px] text-emerald-500 font-mono mt-2 p-2 rounded border border-emerald-500/20 bg-emerald-500/5">
          ✓ Sonder-AfA §7b berechtigt – Gebäudekosten {eur(calc.gebaeudeKostenProQmBGF, 0)}/m² BGF ≤ 5.200 €/m²
        </div>
      ) : (
        <div className="text-[10px] text-amber-500 font-mono mt-2 p-2 rounded border border-amber-500/20 bg-amber-500/5">
          ✗ Sonder-AfA §7b entfällt – Gebäudekosten {eur(calc.gebaeudeKostenProQmBGF, 0)}/m² BGF &gt; 5.200 €/m²
        </div>
      )}
    </>
  )
}
