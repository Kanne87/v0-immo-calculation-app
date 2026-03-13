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
        <FieldInput label="Wohnfl\u00e4che" value={data.wfl} onChange={(v) => onChange("wfl", v)} suffix="m\u00b2" step={0.01} disabled={objLocked} />
        <FieldInput label="BGF" value={data.bgf} onChange={(v) => onChange("bgf", v)} suffix="m\u00b2" step={0.01} disabled={objLocked} />
        <FieldInput label="Kaufpreis Wohnung" value={data.kaufpreis} onChange={(v) => onChange("kaufpreis", v)} suffix="\u20ac" step={1000} disabled={objLocked} />
        <FieldInput label="davon Grundst\u00fcck" value={data.grundstueck} onChange={(v) => onChange("grundstueck", v)} suffix="\u20ac" step={1000} disabled={objLocked} />
        <FieldInput label="Stellplatz" value={data.stellplatz} onChange={(v) => onChange("stellplatz", v)} suffix="\u20ac" step={1000} disabled={objLocked} />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">Gesamtkaufpreis</div>
          <div className="text-lg text-primary font-serif py-1.5">{eur(gesamtKP)}</div>
        </div>
      </div>

      <SectionHeader icon="receipt" title="Nebenkosten & Bauzeit" subtitle="Berlin = 6,0% GrESt, kein Makler (Direktvertrieb)" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput label="Grunderwerbsteuer" value={data.gestPct} onChange={(v) => onChange("gestPct", v)} suffix="%" step={0.1} disabled={objLocked} />
        <FieldInput label="Notar + Grundbuch" value={data.notarPct} onChange={(v) => onChange("notarPct", v)} suffix="%" step={0.1} disabled={objLocked} />
        <FieldInput label="Grundschuldgeb\u00fchren" value={data.grundschuldPct} onChange={(v) => onChange("grundschuldPct", v)} suffix="%" step={0.1} disabled={objLocked} />
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

      <SectionHeader icon="home" title="Miete & Annahmen" subtitle="Mietgarantie und Preissteigerung" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput label="Nettokaltmiete" value={data.mieteQm} onChange={(v) => onChange("mieteQm", v)} suffix="\u20ac/m\u00b2" step={0.5} disabled={readOnly} />
        <FieldInput label="Stellplatzmiete" value={data.mieteStellplatz} onChange={(v) => onChange("mieteStellplatz", v)} suffix="\u20ac/Mon." step={5} disabled={readOnly} />
        <FieldInput label="Preissteigerung p.a." value={data.inflation} onChange={(v) => onChange("inflation", v)} suffix="%" step={0.1} disabled={readOnly && !isTemplate} />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">Jahresmieteinnahmen</div>
          <div className="text-lg text-primary font-serif py-1.5">{eur(calc.mieteJahr)}</div>
        </div>
      </div>
      <div className="text-[9px] text-subtle font-mono -mt-1 mb-4 pl-1">
        Mietsteigerung ab Jahr 4 mit {data.inflation} % p.a. \u00b7 Wertsteigerung Immobilie ebenfalls {data.inflation} % p.a.
      </div>

      <ResultCard>
        <div className="text-[10px] text-subtle uppercase tracking-wider mb-2">Anschaffungsnebenkosten \u2192 erh\u00f6hen AfA-Basis</div>
        <ResultRow label="Grunderwerbsteuer" value={eur(calc.gestBetrag)} />
        <ResultRow label="Notar + Grundbuch" value={eur(calc.notarBetrag)} />
        <ResultRow label={`Bauzeitzinsen (${calc.bauzeitMonate} Mon. MaBV)`} value={eur(calc.bauzeitZinsen)} />
        <div className="text-[10px] text-subtle mt-0.5 mb-2 pl-1">
          MaBV-Auszahlungsstufen mit gew. \u00d8-Zins, Bauzeit {data.baubeginn} bis {data.fertigstellung}
        </div>
        <Divider />
        <ResultRow label="Summe Anschaffungs-NK" value={eur(anschaffungsNK)} bold />

        <div className="mt-3 text-[10px] text-subtle uppercase tracking-wider mb-2">Sofort absetzbare Werbungskosten (Jahr 1)</div>
        <ResultRow label="Grundschuldgeb\u00fchren" value={eur(calc.grundschuldBetrag)} />
        <Divider />
        <ResultRow label="Nebenkosten gesamt" value={eur(calc.nkGesamt)} bold />
      </ResultCard>

      <div className="mt-3 mb-1 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <ResultRow label="GESAMTINVESTITION" value={eur(calc.gesamtInvest)} highlight />
      </div>

      <ResultCard>
        <ResultRow label="AfA-Bemessungsgrundlage" value={eur(calc.gebaeudeWert)} bold />
        <div className="text-[10px] text-subtle mt-1">
          = Kaufpreis {eur(data.kaufpreis)} \u2212 Grundst\u00fcck {eur(data.grundstueck)} + Stellplatz {eur(data.stellplatz)} + Anschaffungs-NK {eur(anschaffungsNK)}
        </div>
      </ResultCard>

      {calc.sonder7bBerechtigt ? (
        <div className="text-[10px] text-emerald-500 font-mono mt-2 p-2 rounded border border-emerald-500/20 bg-emerald-500/5">
          \u2713 Sonder-AfA \u00a77b berechtigt \u2013 Geb\u00e4udekosten {eur(calc.gebaeudeKostenProQmBGF, 0)}/m\u00b2 BGF \u2264 5.200 \u20ac/m\u00b2
        </div>
      ) : (
        <div className="text-[10px] text-amber-500 font-mono mt-2 p-2 rounded border border-amber-500/20 bg-amber-500/5">
          \u2717 Sonder-AfA \u00a77b entf\u00e4llt \u2013 Geb\u00e4udekosten {eur(calc.gebaeudeKostenProQmBGF, 0)}/m\u00b2 BGF &gt; 5.200 \u20ac/m\u00b2
        </div>
      )}
    </>
  )
}
