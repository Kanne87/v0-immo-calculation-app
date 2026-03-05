"use client";

import { useEffect, useState } from "react";
import { Shield, PiggyBank, TrendingUp, Receipt, X } from "lucide-react";

const STEP_ICONS = [Shield, PiggyBank, TrendingUp, Receipt];
const STEP_COLORS = [
  "border-blue-500/50 bg-blue-500/5",
  "border-teal-500/50 bg-teal-500/5",
  "border-emerald-500/50 bg-emerald-500/5",
  "border-cyan-500/50 bg-cyan-500/5",
];
const ICON_COLORS = ["text-blue-400", "text-teal-400", "text-emerald-400", "text-cyan-400"];

const SOLUTION_DATA = {
  headline: "Strategie statt Glueck",
  steps: [
    {
      title: "Inflationsgeschuetztes Vermoegen",
      description: "Immobilien sind Sachwerte \u2013 ihr Wert steigt mit der Inflation, nicht dagegen.",
    },
    {
      title: "Genug Einkuenfte im Alter",
      description: "Mieteinnahmen als zweite Rente \u2013 planbar, steigernd, lebenslang.",
    },
    {
      title: "Fremdkapitalhebel",
      description: "Mit 20 % Eigenkapital 100 % Vermoegen aufbauen. Der Mieter zahlt den Kredit.",
    },
    {
      title: "Steuervorteile",
      description: "AfA, Werbungskosten, Zinsabzug \u2013 Immobilien bieten legale Steueroptimierung.",
    },
  ],
};

export function ModuleSolution() {
  const { headline, steps } = SOLUTION_DATA;
  const [mounted, setMounted] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= steps.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1
          className={`mb-16 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl lg:text-6xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {headline}
        </h1>

        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <div
            className={`relative rounded-2xl border border-border/30 bg-card/50 p-8 transition-all duration-700 ${
              mounted ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-foreground/[0.02]" />
            <h2 className="relative mb-6 text-2xl font-bold text-muted-foreground line-through decoration-destructive/50 decoration-2">
              {"Glueck & Hoffen"}
            </h2>
            <ul className="relative space-y-3">
              {[
                "Sparbuch mit 0,01% Zinsen",
                "Aktien ohne Strategie",
                "Gesetzliche Rente wird reichen",
                "Irgendwann anfangen",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground/60">
                  <X className="size-4 shrink-0 text-destructive/50" />
                  <span className="line-through">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`relative rounded-2xl border border-foreground/10 bg-card p-8 transition-all delay-200 duration-700 ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
          >
            <h2 className="mb-6 text-2xl font-bold text-foreground">Strategie</h2>
            <ul className="space-y-3">
              {[
                "Sachwert-Investition gegen Inflation",
                "Planbare Mieteinnahmen",
                "Fremdkapitalhebel nutzen",
                "Legale Steueroptimierung",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground/80">
                  <div className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const isVisible = i < visibleSteps;
            return (
              <div
                key={step.title}
                className={`relative rounded-xl border p-6 transition-all duration-500 ${STEP_COLORS[i]} ${
                  isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-background/50">
                    <Icon className={`size-4 ${ICON_COLORS[i]}`} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Schritt {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
