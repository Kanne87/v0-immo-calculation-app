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

  // In template mode: all fields locked. Inflation is the only exception
  // (it's editable because it's an assumption, not an object property).
  const objLocked = readOnly || isTemplate

  return (
    <>
      {/* Template-Hinweis */}
      {isTemplate && (
        <div className="mb-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="text-[11px] font-mono text-primary">
            Vorlage \u2013 Objektdaten sind gesperrt
          </div>
          <div className="text-[10px] font-mono text-subtle mt-0.5">
            Wechsle zu \u201EFinanzierung\u201C, um individuelle Berechnungen durchzuf\u00FChren.
          </div>
        </div>
      )}

      {/* Objektdaten */}
      <SectionHeader
        icon="building"
        title="Objektdaten"
        subtitle="Wohnung und Kaufpreis"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput
          label="Wohnfl\u00E4che"
          value={data.wfl}
          onChange={(v) => onChange("wfl", v)}
          suffix="m\u00B2"
          step={0.01}
          disabled={objLocked}
        />
        <FieldInput
          label="BGF"
          value={data.bgf}
          onChange={(v) => onChange("bgf", v)}
          suffix="m\u00B2"
          step={0.01}
          disabled={objLocked}
        />
        <FieldInput
          label="Kaufpreis Wohnung"
          value={data.kaufpreis}
          onChange={(v) => onChange("kaufpreis", v)}
          suffix="\u20AC"
          step={1000}
          disabled={objLocked}
        />
        <FieldInput
          label="davon Grundst\u00FCck"
          value={data.grundstueck}
          onChange={(v) => onChange("grundstueck", v)}
          suffix="\u20AC"
          step={1000}
          disabled={objLocked}
        />
        <FieldInput
          label="Stellplatz"
          value={data.stellplatz}
          onChange={(v) => onChange("stellplatz", v)}
          suffix="\u20AC"
          step={1000}
          disabled={objLocked}
        />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">
            Kaufpreis/m\u00B2
          </div>
          <div className="text-lg text-primary font-serif py-1.5">
            {eur(gesamtKP / data.wfl, 0)}/m\u00B2
          </div>
        </div>
      </div>

      <SectionHeader
        icon="receipt"
        title="Nebenkosten & Bauzeit"
        subtitle="Berlin = 6,0% GrESt, kein Makler (Direktvertrieb)"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput
          label="Grunderwerbsteuer"
          value={data.gestPct}
          onChange={(v) => onChange("gestPct", v)}
          suffix="%"
          step={0.1}
          disabled={objLocked}
        />
        <FieldInput
          label="Notar + Grundbuch"
          value={data.notarPct}
          onChange={(v) => onChange("notarPct", v)}
          suffix="%"
          step={0.1}
          disabled={objLocked}
        />
        <FieldInput
          label="Grundschuldgeb\u00FChren"
          value={data.grundschuldPct}
          onChange={(v) => onChange("grundschuldPct", v)}
          suffix="%"
          step={0.1}
          disabled={objLocked}
        />
        <div />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">
            Baubeginn
          </div>
          <input
            type="date"
            value={data.baubeginn}
            onChange={(e) => onChange("baubeginn", e.target.value)}
            disabled={objLocked}
            className="w-full text-sm font-mono bg-transparent border border-border rounded px-2 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">
            Fertigstellung (geplant)
          </div>
          <input
            type="date"
            value={data.fertigstellung}
            onChange={(e) => onChange("fertigstellung", e.target.value)}
            disabled={objLocked}
            className="w-full text-sm font-mono bg-transparent border border-border rounded px-2 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <ResultCard>
        <div className="text-[10px] text-subtle uppercase tracking-wider mb-2">
          Anschaffungsnebenkosten \u2192 erh\u00F6hen AfA-Basis
        </div>
        <ResultRow label="Grunderwerbsteuer" value={eur(calc.gestBetrag)} />
        <ResultRow label="Notar + Grundbuch" value={eur(calc.notarBetrag)} />
        <ResultRow
          label={`Bauzeitzinsen (${calc.bauzeitMonate} Mon. MaBV)`}
          value={eur(calc.bauzeitZinsen)}
        />
        <div className="text-[10px] text-subtle mt-0.5 mb-2 pl-1">
          MaBV-Auszahlungsstufen mit gew. \u00D8-Zins, Bauzeit {data.baubeginn} bis {data.fertigstellung}
        </div>
        <Divider />
        <ResultRow
          label="Summe Anschaffungs-NK"
          value={eur(anschaffungsNK)}
          bold
        />

        <div className="mt-3 text-[10px] text-subtle uppercase tracking-wider mb-2">
          Sofort absetzbare Werbungskosten (Jahr 1)
        </div>
        <ResultRow label="Grundschuldgeb\u00FChren" value={eur(calc.grundschuldBetrag)} />
        <Divider />

        <ResultRow
          label="Nebenkosten gesamt"
          value={eur(calc.nkGesamt)}
          bold
        />
        <ResultRow
          label="GESAMTINVESTITION"
          value={eur(calc.gesamtInvest)}
          highlight
        />
        <Divider />
        <ResultRow
          label="AfA-Bemessungsgrundlage"
          value={eur(calc.gebaeudeWert)}
          bold
        />
        <div className="text-[10px] text-subtle mt-0.5 mb-1 pl-1">
          = Kaufpreis {eur(data.kaufpreis)} \u2212 Grundst\u00FCck {eur(data.grundstueck)} + Stellplatz {eur(data.stellplatz)} + Anschaffungs-NK {eur(anschaffungsNK)}
        </div>
      </ResultCard>

      <div className="mt-4">
        <SectionHeader
          icon="home"
          title="Miete"
          subtitle="Kaltmiete und Inflation"
        />
        <div className="grid grid-cols-2 gap-x-3 gap-y-0">
          <FieldInput
            label="Kaltmiete/m\u00B2"
            value={data.mieteQm}
            onChange={(v) => onChange("mieteQm", v)}
            suffix="\u20AC/m\u00B2"
            step={0.5}
            disabled={objLocked}
          />
          <FieldInput
            label="Stellplatz/Monat"
            value={data.mieteStellplatz}
            onChange={(v) => onChange("mieteStellplatz", v)}
            suffix="\u20AC"
            step={10}
            disabled={objLocked}
          />
          <FieldInput
            label="Inflation p.a."
            value={data.inflation}
            onChange={(v) => onChange("inflation", v)}
            suffix="%"
            step={0.1}
          />
          <div>
            <div className="text-[11px] text-subtle mb-1 font-mono">
              Jahreskaltmiete
            </div>
            <div className="text-lg text-primary font-serif py-1.5">
              {eur(calc.mieteJahr)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
