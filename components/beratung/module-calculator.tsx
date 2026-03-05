"use client";

import { useEffect, useState, useCallback } from "react";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { Calculator, Euro, Percent, Calendar, TrendingUp, PiggyBank } from "lucide-react";

interface CalcInputs {
  kaufpreis: number;
  wohnflaeche: number;
  eigenkapital: number;
  zinssatz: number;
  tilgung: number;
  kaltmiete: number;
  hausgeld: number;
  laufzeit: number;
  mietsteigerung: number;
}

interface CalcResults {
  monatlicheRate: number;
  monatlicheNettomiete: number;
  monatlichesBelastung: number;
  eigenkapitalRendite: number;
  gesamtkosten: number;
  restschuld: number;
}

function calculateResults(inputs: CalcInputs): CalcResults {
  const darlehen = inputs.kaufpreis - inputs.eigenkapital;
  const monatszins = inputs.zinssatz / 100 / 12;
  const monatlicheRate = darlehen * (monatszins + inputs.tilgung / 100 / 12);
  const monatlicheNettomiete = inputs.kaltmiete * inputs.wohnflaeche - inputs.hausgeld;
  const monatlichesBelastung = monatlicheRate - monatlicheNettomiete;

  const jahresMieteinnahme = monatlicheNettomiete * 12;
  const eigenkapitalRendite = (jahresMieteinnahme / inputs.eigenkapital) * 100;

  const gesamtkosten = monatlicheRate * 12 * inputs.laufzeit;

  let restschuld = darlehen;
  for (let i = 0; i < inputs.laufzeit * 12; i++) {
    const zins = restschuld * monatszins;
    const tilg = monatlicheRate - zins;
    restschuld = Math.max(0, restschuld - tilg);
  }

  return {
    monatlicheRate,
    monatlicheNettomiete,
    monatlichesBelastung,
    eigenkapitalRendite,
    gesamtkosten,
    restschuld,
  };
}

function formatEuro(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function ModuleCalculator({ project }: { project: BeratungProjectData }) {
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState<CalcInputs>({
    kaufpreis: project.priceFrom,
    wohnflaeche: project.unitSizes.avg,
    eigenkapital: Math.round(project.priceFrom * 0.2),
    zinssatz: 3.5,
    tilgung: 2.0,
    kaltmiete: project.rentPerSqm,
    hausgeld: 3.5,
    laufzeit: 10,
    mietsteigerung: 2.0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const results = calculateResults(inputs);

  const updateInput = useCallback((key: keyof CalcInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1
          className={`mb-4 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl lg:text-6xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Musterberechnung
        </h1>
        <p
          className={`mx-auto mb-12 max-w-lg text-center text-lg text-muted-foreground transition-all delay-200 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Beispielrechnung fuer {project.name} - aendern Sie die Werte live
        </p>

        <div
          className={`grid gap-8 lg:grid-cols-2 transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-foreground">
              <Calculator className="size-5 text-emerald-400" />
              Parameter
            </h2>
            <div className="space-y-5">
              <SliderInput icon={Euro} label="Kaufpreis" value={inputs.kaufpreis} min={100000} max={500000} step={5000} format={formatEuro} onChange={(v) => updateInput("kaufpreis", v)} />
              <SliderInput icon={Euro} label="Eigenkapital" value={inputs.eigenkapital} min={10000} max={200000} step={5000} format={formatEuro} onChange={(v) => updateInput("eigenkapital", v)} />
              <SliderInput icon={Percent} label="Zinssatz" value={inputs.zinssatz} min={1} max={6} step={0.1} format={(v) => `${v.toFixed(1)} %`} onChange={(v) => updateInput("zinssatz", v)} />
              <SliderInput icon={Percent} label="Tilgung" value={inputs.tilgung} min={1} max={5} step={0.5} format={(v) => `${v.toFixed(1)} %`} onChange={(v) => updateInput("tilgung", v)} />
              <SliderInput icon={Euro} label="Kaltmiete/m\u00B2" value={inputs.kaltmiete} min={8} max={25} step={0.5} format={(v) => `${v.toFixed(2)} EUR`} onChange={(v) => updateInput("kaltmiete", v)} />
              <SliderInput icon={Calendar} label="Zinsbindung" value={inputs.laufzeit} min={5} max={30} step={1} format={(v) => `${v} Jahre`} onChange={(v) => updateInput("laufzeit", v)} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-8">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-foreground">
              <TrendingUp className="size-5 text-blue-400" />
              Ergebnis
            </h2>
            <div className="space-y-4">
              <ResultCard label="Monatliche Rate" value={formatEuro(results.monatlicheRate)} color="text-foreground" />
              <ResultCard label="Netto-Mieteinnahme" value={formatEuro(results.monatlicheNettomiete)} color="text-emerald-400" />
              <ResultCard label="Monatliche Belastung" value={formatEuro(results.monatlichesBelastung)} color={results.monatlichesBelastung > 0 ? "text-red-400" : "text-emerald-400"} subtitle={results.monatlichesBelastung > 0 ? "Zuzahlung" : "Ueberschuss"} />
              <div className="my-6 h-px bg-border/50" />
              <ResultCard label="Eigenkapitalrendite" value={`${results.eigenkapitalRendite.toFixed(1)} %`} color="text-blue-400" />
              <ResultCard label={`Restschuld nach ${inputs.laufzeit} Jahren`} value={formatEuro(results.restschuld)} color="text-amber-400" />
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-xl bg-emerald-400/5 border border-emerald-400/20 p-4">
              <PiggyBank className="mt-0.5 size-5 shrink-0 text-emerald-400" />
              <p className="text-sm leading-relaxed text-foreground/80">
                Mit nur <span className="font-bold text-emerald-400">{formatEuro(Math.abs(results.monatlichesBelastung))}</span> monatlich bauen Sie ein Vermoegen von {formatEuro(inputs.kaufpreis)} auf. Der Mieter zahlt den Rest.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderInput({ icon: Icon, label, value, min, max, step, format, onChange }: { icon: typeof Euro; label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-sm font-bold text-foreground">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-foreground" />
    </div>
  );
}

function ResultCard({ label, value, color, subtitle }: { label: string; value: string; color: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subtitle && <p className="text-xs text-muted-foreground/60">{subtitle}</p>}
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
