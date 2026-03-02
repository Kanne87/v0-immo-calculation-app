"use client"

import type { ProjectData, CalcResult } from "@/lib/rechner-types"
import { eur, pct } from "@/lib/rechner-calc"
import { FieldInput, SelectField, TextField } from "./field-input"
import { SectionHeader, ResultRow, HighlightCard } from "./ui-parts"

interface Props {
  data: ProjectData
  calc: CalcResult
  onChange: <K extends keyof ProjectData>(key: K, val: ProjectData[K]) => void
  readOnly?: boolean
}

export function StepFinanzierung({ data, calc, onChange, readOnly }: Props) {
  const rate1 =
    (data.darlehen1 *
      (data.zins1 + (data.tilgungsfrei1 > 0 ? 0 : data.tilgung1))) /
    100 /
    12

  const rate2 = (data.darlehen2 * (data.zins2 + data.tilgung2)) / 100 / 12

  const computedEK = Math.max(0, Math.round(calc.gesamtInvest - data.darlehen1 - data.darlehen2))
  const finanzierungPct = calc.gesamtInvest > 0
    ? Math.round(((data.darlehen1 + data.darlehen2) / calc.gesamtInvest) * 100)
    : 0

  return (
    <>
      <SectionHeader
        icon="landmark"
        title="Finanzierung"
        subtitle={`${finanzierungPct}% Fremdfinanzierung`}
      />

      <div className="mb-4 p-3 rounded-lg border border-border bg-secondary/30">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[9px] text-subtle font-mono uppercase tracking-wider">Gesamtinvest</div>
            <div className="text-sm text-foreground font-mono mt-1">{eur(calc.gesamtInvest)}</div>
          </div>
          <div>
            <div className="text-[9px] text-subtle font-mono uppercase tracking-wider">Darlehen</div>
            <div className="text-sm text-foreground font-mono mt-1">{eur(data.darlehen1 + data.darlehen2)}</div>
          </div>
          <div>
            <div className="text-[9px] text-subtle font-mono uppercase tracking-wider">Eigenkapital</div>
            <div className={`text-sm font-mono mt-1 ${
              computedEK > 0 ? "text-amber-400" : "text-emerald-400"
            }`}>
              {eur(computedEK)}
            </div>
          </div>
        </div>
        {computedEK > 0 && (
          <div className="text-[9px] text-subtle font-mono text-center mt-2">
            {"Eigenkapitalbedarf = Gesamtinvestition \u2212 Darlehen 1 \u2212 Darlehen 2"}
          </div>
        )}
      </div>

      <SectionHeader
        icon="chart"
        title={`Darlehen 1 (${data.darlehen1Label})`}
        subtitle="Klimafreundlicher Neubau - max. 150.000 EUR mit QNG"
      />
      <TextField
        label="Bezeichnung"
        value={data.darlehen1Label}
        onChange={(v) => onChange("darlehen1Label", v)}
        disabled={readOnly}
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput
          label="Darlehensbetrag"
          value={data.darlehen1}
          onChange={(v) => onChange("darlehen1", v)}
          suffix={"\u20AC"}
          step={5000}
          disabled={readOnly}
        />
        <FieldInput
          label="Zinsbindung"
          value={data.zinsbindung1}
          onChange={(v) => onChange("zinsbindung1", v)}
          suffix="Jahre"
          disabled={readOnly}
        />
        <FieldInput
          label="Zinssatz"
          value={data.zins1}
          onChange={(v) => onChange("zins1", v)}
          suffix="%"
          step={0.01}
          disabled={readOnly}
        />
        <FieldInput
          label="Tilgung"
          value={data.tilgung1}
          onChange={(v) => onChange("tilgung1", v)}
          suffix="%"
          step={0.01}
          disabled={readOnly}
        />
        <FieldInput
          label="Tilgungsfreie Jahre"
          value={data.tilgungsfrei1}
          onChange={(v) => onChange("tilgungsfrei1", v)}
          suffix="J."
          disabled={readOnly}
        />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">
            Rate/Monat
          </div>
          <div className="text-base text-foreground font-serif py-1.5">
            {eur(rate1, 2)}
          </div>
        </div>
      </div>

      <SectionHeader
        icon="bank"
        title={`Darlehen 2 (${data.darlehen2Label})`}
        subtitle="Restfinanzierung"
      />
      <TextField
        label="Bezeichnung"
        value={data.darlehen2Label}
        onChange={(v) => onChange("darlehen2Label", v)}
        disabled={readOnly}
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-0">
        <FieldInput
          label="Darlehensbetrag"
          value={data.darlehen2}
          onChange={(v) => onChange("darlehen2", v)}
          suffix={"\u20AC"}
          step={5000}
          disabled={readOnly}
        />
        <FieldInput
          label="Zinsbindung"
          value={data.zinsbindung2}
          onChange={(v) => onChange("zinsbindung2", v)}
          suffix="Jahre"
          disabled={readOnly}
        />
        <FieldInput
          label="Zinssatz"
          value={data.zins2}
          onChange={(v) => onChange("zins2", v)}
          suffix="%"
          step={0.01}
          disabled={readOnly}
        />
        <FieldInput
          label="Tilgung"
          value={data.tilgung2}
          onChange={(v) => onChange("tilgung2", v)}
          suffix="%"
          step={0.01}
          disabled={readOnly}
        />
        <div />
        <div>
          <div className="text-[11px] text-subtle mb-1 font-mono">
            Rate/Monat
          </div>
          <div className="text-base text-foreground font-serif py-1.5">
            {eur(rate2, 2)}
          </div>
        </div>
      </div>

      <div className="h-px bg-border my-4" />

      <SectionHeader
        icon="file"
        title="Steuerdaten"
        subtitle={"F\u00FCr Berechnung Grenzsteuersatz"}
      />
      <SelectField
        label="Familienstand"
        value={data.married}
        onChange={(v) => onChange("married", v)}
        options={[
          { value: 1, label: "Alleinstehend" },
          { value: 2, label: "Verheiratet" },
        ]}
        disabled={readOnly}
      />
      <FieldInput
        label="Zu versteuerndes Einkommen"
        value={data.einkommen}
        onChange={(v) => onChange("einkommen", v)}
        suffix={"\u20AC"}
        step={5000}
        disabled={readOnly}
      />
      <SelectField
        label="Kirchensteuer"
        value={data.kirche}
        onChange={(v) => onChange("kirche", v)}
        options={[
          { value: 0, label: "Keine" },
          { value: 1, label: "8%" },
          { value: 2, label: "9%" },
        ]}
        disabled={readOnly}
      />

      <HighlightCard>
        <ResultRow
          label="Grenzsteuersatz (inkl. SolZ + KiSt)"
          value={pct(calc.marginalRate)}
          highlight
        />
      </HighlightCard>
    </>
  )
}
