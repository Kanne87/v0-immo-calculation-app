"use client";

import { useEffect, useState } from "react";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { MapPin, Hammer, LayoutGrid, Users, Tag } from "lucide-react";

const ICONS = [MapPin, Hammer, LayoutGrid, Users, Tag];
const COLORS = ["#3b82f6", "#14b8a6", "#22c55e", "#a78bfa", "#f59e0b"];

const HIGHLIGHTS: { key: string; label: string; points: string[] }[] = [
  {
    key: "lage",
    label: "Lage",
    points: ["Bundeshauptstadt Berlin", "0,8 % Leerstand", "RE zum Hbf in 15 Min.", "Siemensstadt 2.0"],
  },
  {
    key: "zustand",
    label: "Zustand",
    points: ["Neubau 2028", "KfW EH40 QNG Plus", "TÜV-Baucontrolling", "Massivbauweise"],
  },
  {
    key: "grundriss",
    label: "Grundriss",
    points: ["1–4 Zimmer", "Barrierefrei", "Loggia oder Terrasse", "Abstellraum je WE"],
  },
  {
    key: "verwaltung",
    label: "Verwaltung",
    points: ["Full-Service-Verwaltung", "Mietgarantie bis 2029", "Sie kümmern sich um nichts"],
  },
  {
    key: "einkaufspreis",
    label: "Einkaufspreis",
    points: ["Ab 7.200 €/m²", "12 % unter Berliner Markt", "KfW-Darlehen 150k zu 2,83 %", "3 % AfA über 33 Jahre"],
  },
];

export function ModuleBigFive({ project }: { project: BeratungProjectData }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1
          className={`mb-2 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          Die Erfolgsformel
        </h1>
        <p
          className={`mx-auto mb-12 max-w-lg text-center text-base text-muted-foreground transition-all delay-200 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          Fünf Kriterien, die über Erfolg und Misserfolg entscheiden.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-14">
          {HIGHLIGHTS.map((cat, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={cat.key}
                className={`flex flex-col items-center text-center rounded-2xl border border-border/40 bg-card px-4 py-6 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div
                  className="flex size-10 items-center justify-center rounded-xl mb-4"
                  style={{ backgroundColor: `${COLORS[i]}15` }}
                >
                  <Icon className="size-5" style={{ color: COLORS[i] }} />
                </div>
                <p
                  className="text-sm font-bold uppercase tracking-wider mb-4"
                  style={{ color: COLORS[i] }}
                >
                  {cat.label}
                </p>
                <div className="flex flex-col gap-2">
                  {cat.points.map((point) => (
                    <span
                      key={point}
                      className="text-sm font-semibold text-foreground leading-snug"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`mx-auto max-w-2xl rounded-xl border border-border/30 bg-secondary/30 px-6 py-5 transition-all delay-1000 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <p className="text-center text-sm italic leading-relaxed text-muted-foreground">
            „Stellen Sie sich vor, Sie erben eine 100&nbsp;m²-Wohnung in Berlin.
            Würden Sie sie verkaufen? Nein. Genau das bauen wir jetzt
            für Sie auf&nbsp;– nur smarter."
          </p>
        </div>
      </div>
    </div>
  );
}
