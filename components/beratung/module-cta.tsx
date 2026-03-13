"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  CheckCircle2,
  Circle,
  Rocket,
  ArrowRight,
} from "lucide-react";

const CTA_DATA = {
  headline: "Jetzt sind SIE dran",
  steps: [
    {
      label: "Finanzierungsbudget pruefen",
      description: "Gemeinsam ermitteln wir Ihre maximale monatliche Belastung und den Kaufpreisrahmen.",
    },
    {
      label: "Unterlagen einreichen",
      description: "Gehaltsabrechnungen, Steuerbescheid und Eigenkapitalnachweis vorbereiten.",
    },
    {
      label: "Wohnung reservieren",
      description: "Ihre Wunschwohnung wird für 14 Tage unverbindlich reserviert.",
    },
    {
      label: "Notartermin",
      description: "Kaufvertrag pruefen und beim Notar unterzeichnen \u2013 wir begleiten Sie.",
    },
  ],
};

export function ModuleCTA() {
  const { headline, steps } = CTA_DATA;
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(new Array(steps.length).fill(false));

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleStep = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const completedCount = checked.filter(Boolean).length;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div
          className={`mb-4 flex justify-center transition-all duration-700 ${
            mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-cyan-400/10">
            <Rocket className="size-8 text-cyan-400" />
          </div>
        </div>

        <h1
          className={`mb-4 text-center text-4xl font-bold tracking-tight text-foreground transition-all delay-100 duration-700 md:text-5xl lg:text-6xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {headline}
        </h1>
        <p
          className={`mx-auto mb-12 max-w-lg text-center text-lg text-muted-foreground transition-all delay-200 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {completedCount} von {steps.length} Schritten erledigt
        </p>

        <div
          className={`mx-auto mb-10 h-1.5 max-w-md overflow-hidden rounded-full bg-secondary transition-all delay-300 duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-500 hover:border-border ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } ${checked[i] ? "border-cyan-400/30 bg-cyan-400/5" : ""}`}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              <div className="flex items-center pt-0.5">
                <Checkbox
                  checked={checked[i]}
                  onCheckedChange={() => toggleStep(i)}
                  className="size-5"
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h3
                    className={`text-lg font-bold transition-colors ${
                      checked[i] ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {checked[i] ? (
                    <Badge variant="secondary" className="bg-cyan-400/10 text-cyan-400">
                      Erledigt
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Offen
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <div className="pt-1">
                {checked[i] ? (
                  <CheckCircle2 className="size-5 text-cyan-400" />
                ) : (
                  <Circle className="size-5 text-muted-foreground/30" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 flex flex-col items-center gap-4 transition-all delay-700 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Button
            size="lg"
            className="gap-2 bg-foreground px-8 text-background hover:bg-foreground/90"
            onClick={() => {
              alert("PDF-Export wird in der Vollversion mit jsPDF generiert.");
            }}
          >
            <FileDown className="size-4" />
            Beratungsprotokoll als PDF exportieren
          </Button>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="size-3" />
            Oder direkt zur Reservierung
          </p>
        </div>
      </div>
    </div>
  );
}
