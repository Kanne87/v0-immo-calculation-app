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
}

export function StepObjekt({ data, calc, onChange, readOnly }: Props) {
  return (
    <>
      <SectionHeader
        icon="building"
        title="Objektdaten"
        subtitle="Wohnung und Kaufpreis"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput
          label="Wohnflaeche"
          value={data.wfl}
          onChange={(v) => onChange("wfl", v)}
          suffix="m2"
          step={0.01}
          disabled={readOnly}
        />
        <FieldInput
          label="BGF"
          value={data.bgf}
          onChange={(v) => onChange("bgf", v)}
          suffix="m2"
          step={0.01}
          disabled={readOnly}
        />
        <FieldInput
          label="Kaufpreis Wohnung"
          value={data.kaufpreis}
          onChange={(v) => onChange("kaufpreis", v)}
          suffix={"\u20AC"}
          step={1000}
          disabled={readOnly}
        />
        <FieldInput
          label="davon Grundstueck"
          value={data.grundstueck}
          onChange={(v) => onChange("grundstueck", v)}
          suffix={"\u20AC"}
          step={1000}
          disabled={readOnly}
        />
        <FieldInput
          label="Stellplatz"
          value={data.stellplatz}
          onChange={(v) => onChange("stellplatz", v)}
          suffix={"\u20AC"}
          step={1000}
          disabled={readOnly}
        />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">
            {"Kaufpreis/m\u00B2"}
          </div>
          <div className="text-lg text-primary font-serif py-1.5">
            {eur(data.kaufpreis / data.wfl, 0)}{"/m\u00B2"}
          </div>
        </div>
      </div>

      <SectionHeader
        icon="receipt"
        title="Kaufnebenkosten"
        subtitle="Berlin = 6,5% GrESt, kein Makler (Direktvertrieb)"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput
          label="Grunderwerbsteuer"
          value={data.gestPct}
          onChange={(v) => onChange("gestPct", v)}
          suffix="%"
          step={0.1}
          disabled={readOnly}
        />
        <FieldInput
          label="Notar + Grundbuch"
          value={data.notarPct}
          onChange={(v) => onChange("notarPct", v)}
          suffix="%"
          step={0.1}
          disabled={readOnly}
        />
        <FieldInput
          label="Grundschuldgebuehren"
          value={data.grundschuldPct}
          onChange={(v) => onChange("grundschuldPct", v)}
          suffix="%"
          step={0.1}
          disabled={readOnly}
        />
        <FieldInput
          label="Bauzeitzinsen"
          value={data.bauzeitZinsPct}
          onChange={(v) => onChange("bauzeitZinsPct", v)}
          suffix="%"
          step={0.1}
          disabled={readOnly}
        />
      </div>

      <ResultCard>
        <ResultRow label="Grunderwerbsteuer" value={eur(calc.gestBetrag)} />
        <ResultRow label="Notar + Grundbuch" value={eur(calc.notarBetrag)} />
        <ResultRow
          label="Grundschuldgebuehren"
          value={eur(calc.grundschuldBetrag)}
        />
        <ResultRow label="Bauzeitzinsen" value={eur(calc.bauzeitZinsen)} />
        <Divider />
        <ResultRow
          label="Kaufnebenkosten gesamt"
          value={eur(calc.nkGesamt)}
          bold
        />
        <ResultRow
          label="GESAMTINVESTITION"
          value={eur(calc.gesamtInvest)}
          highlight
        />
      </ResultCard>

      <div className="mt-4">
        <SectionHeader
          icon="home"
          title="Miete"
          subtitle="Kaltmiete und Inflation"
        />
        <div className="grid grid-cols-2 gap-x-3 gap-y-0">
          <FieldInput
            label={"Kaltmiete/m\u00B2"}
            value={data.mieteQm}
            onChange={(v) => onChange("mieteQm", v)}
            suffix={"\u20AC/m\u00B2"}
            step={0.5}
            disabled={readOnly}
          />
          <FieldInput
            label="Stellplatz/Monat"
            value={data.mieteStellplatz}
            onChange={(v) => onChange("mieteStellplatz", v)}
            suffix={"\u20AC"}
            step={10}
            disabled={readOnly}
          />
          <FieldInput
            label="Inflation p.a."
            value={data.inflation}
            onChange={(v) => onChange("inflation", v)}
            suffix="%"
            step={0.1}
            disabled={readOnly}
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
