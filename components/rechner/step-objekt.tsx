"use client"

import { useState } from "react"
import type { ProjectData, CalcResult } from "@/lib/rechner-types"
import { eur } from "@/lib/rechner-calc"
import { HAUS1_EINHEITEN } from "@/lib/units-data"
import type { WohneinheitData } from "@/lib/units-data"
import { FieldInput } from "./field-input"
import { SectionHeader, ResultRow, Divider, ResultCard } from "./ui-parts"

interface Props {
  data: ProjectData
  calc: CalcResult
  onChange: <K extends keyof ProjectData>(key: K, val: ProjectData[K]) => void
  onSelectUnit: (unit: WohneinheitData) => void
  readOnly?: boolean
}

const STATUS_DOT: Record<string, string> = {
  frei: "bg-emerald-400",
  reserviert: "bg-amber-400",
  verkauft: "bg-subtle",
}

const STATUS_COLORS: Record<string, string> = {
  frei: "text-emerald-400",
  reserviert: "text-amber-400",
  verkauft: "text-subtle",
}

export function StepObjekt({ data, calc, onChange, onSelectUnit, readOnly }: Props) {
  const [showUnitList, setShowUnitList] = useState(false)

  const currentWeId = HAUS1_EINHEITEN.find(
    (we) => data.projektName.includes(we.id)
  )?.id

  const anschaffungsNK = calc.gestBetrag + calc.notarBetrag + calc.bauzeitZinsen

  return (
    <>
      {/* WE-Auswahl */}
      <SectionHeader
        icon="grid"
        title="Wohneinheit"
        subtitle={"Haus 1 \u2013 29 Einheiten"}
      />

      <button
        onClick={() => setShowUnitList(!showUnitList)}
        className="w-full mb-3 p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-all text-left"
        disabled={readOnly}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-mono text-foreground">
              {currentWeId || "Wohneinheit w\u00E4hlen"}
            </div>
            <div className="text-[10px] text-subtle font-mono mt-0.5">
              {data.wfl}{" m\u00B2 \u00B7 "}{eur(data.kaufpreis + data.stellplatz, 0)}{" \u00B7 "}{eur((data.kaufpreis + data.stellplatz) / data.wfl, 0)}{"/m\u00B2"}
            </div>
          </div>
          <div className="text-[10px] text-subtle font-mono">
            {showUnitList ? "\u25B2" : "\u25BC"}
          </div>
        </div>
      </button>

      {showUnitList && !readOnly && (
        <div className="mb-4 rounded-lg border border-border overflow-hidden">
          <div className="grid grid-cols-[60px_50px_36px_55px_80px_48px] gap-1 px-3 py-2 bg-secondary text-[9px] text-subtle font-mono uppercase tracking-wider">
            <span>WE</span>
            <span>Etage</span>
            <span>Zi.</span>
            <span>{"Fl\u00E4che"}</span>
            <span>Kaufpreis</span>
            <span>Status</span>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {HAUS1_EINHEITEN.map((we) => {
              const isSelected = we.id === currentWeId
              const isAvailable = we.status !== "verkauft"
              return (
                <button
                  key={we.id}
                  onClick={() => {
                    onSelectUnit(we)
                    setShowUnitList(false)
                  }}
                  disabled={!isAvailable}
                  className={`w-full grid grid-cols-[60px_50px_36px_55px_80px_48px] gap-1 px-3 py-2 text-[11px] font-mono transition-all border-t border-border/50 ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : isAvailable
                        ? "hover:bg-secondary/80 text-foreground"
                        : "text-subtle opacity-50 cursor-not-allowed"
                  }`}
                >
                  <span className={isSelected ? "font-bold" : ""}>{we.id}</span>
                  <span>{we.etage}</span>
                  <span>{we.zimmer}</span>
                  <span>{we.wfl}{" m\u00B2"}</span>
                  <span>{(we.gesamtKaufpreis / 1000).toFixed(0)}{"T\u20AC"}</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[we.status]}`} />
                    <span className={`text-[9px] ${STATUS_COLORS[we.status]}`}>
                      {we.status === "frei" ? "frei" : we.status === "reserviert" ? "res." : "verk."}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex gap-4 px-3 py-2 bg-secondary/50 border-t border-border">
            {["frei", "reserviert", "verkauft"].map((s) => (
              <span key={s} className="flex items-center gap-1 text-[9px] font-mono text-subtle">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                {s}
              </span>
            ))}
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
          label={"Wohnfl\u00E4che"}
          value={data.wfl}
          onChange={(v) => onChange("wfl", v)}
          suffix={"m\u00B2"}
          step={0.01}
          disabled={readOnly}
        />
        <FieldInput
          label="BGF"
          value={data.bgf}
          onChange={(v) => onChange("bgf", v)}
          suffix={"m\u00B2"}
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
          label={"davon Grundst\u00FCck"}
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
        title={"Nebenkosten & Bauzeit"}
        subtitle="Berlin = 6,0% GrESt, kein Makler (Direktvertrieb)"
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
          label={"Grundschuldgeb\u00FChren"}
          value={data.grundschuldPct}
          onChange={(v) => onChange("grundschuldPct", v)}
          suffix="%"
          step={0.1}
          disabled={readOnly}
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
            disabled={readOnly}
            className="w-full text-sm font-mono bg-transparent border border-border rounded px-2 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            disabled={readOnly}
            className="w-full text-sm font-mono bg-transparent border border-border rounded px-2 py-1.5 text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <ResultCard>
        <div className="text-[10px] text-subtle uppercase tracking-wider mb-2">
          {"Anschaffungsnebenkosten \u2192 erh\u00F6hen AfA-Basis"}
        </div>
        <ResultRow label="Grunderwerbsteuer" value={eur(calc.gestBetrag)} />
        <ResultRow label="Notar + Grundbuch" value={eur(calc.notarBetrag)} />
        <ResultRow
          label={`Bauzeitzinsen (${calc.bauzeitMonate} Mon. MaBV)`}
          value={eur(calc.bauzeitZinsen)}
        />
        <div className="text-[10px] text-subtle mt-0.5 mb-2 pl-1">
          {"MaBV-Auszahlungsstufen mit gew. \u00D8-Zins, Bauzeit "}{data.baubeginn}{" bis "}{data.fertigstellung}
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
        <ResultRow label={"Grundschuldgeb\u00FChren"} value={eur(calc.grundschuldBetrag)} />
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
          {"= Kaufpreis "}{eur(data.kaufpreis)}{" \u2212 Grundst\u00FCck "}{eur(data.grundstueck)}{" + Stellplatz "}{eur(data.stellplatz)}{" + Anschaffungs-NK "}{eur(anschaffungsNK)}
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
