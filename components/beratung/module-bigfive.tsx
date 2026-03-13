"use client";

import { useEffect, useState } from "react";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { MapPin, Hammer, LayoutGrid, Users, Tag } from "lucide-react";

const ICONS = [MapPin, Hammer, LayoutGrid, Users, Tag];
const COLORS = ["#3b82f6", "#14b8a6", "#22c55e", "#a78bfa", "#f59e0b"];

function ScoreRing({
  score,
  color,
  size = 72,
  delay = 0,
}: {
  score: number;
  color: string;
  size?: number;
  delay?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference - progress : circumference}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-foreground">{score.toFixed(1)}</span>
      </div>
    </div>
  );
}

export function ModuleBigFive({ project }: { project: BeratungProjectData }) {
  const { bigFive } = project;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { key: "lage", label: "Lage", data: bigFive.lage },
    { key: "zustand", label: "Zustand", data: bigFive.zustand },
    { key: "grundriss", label: "Grundriss", data: bigFive.grundriss },
    { key: "verwaltung", label: "Verwaltung", data: bigFive.verwaltung },
    { key: "einkaufspreis", label: "Einkaufspreis", data: bigFive.einkaufspreis },
  ];

  const totalScore =
    categories.reduce((sum, c) => sum + c.data.score, 0) / categories.length;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <h1
          className={`mb-2 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          Die Erfolgsformel
        </h1>
        <p
          className={`mx-auto mb-10 max-w-md text-center text-base text-muted-foreground transition-all delay-200 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          F\u00fcnf Kriterien, die \u00fcber Erfolg und Misserfolg entscheiden.
        </p>

        <div className="grid grid-cols-5 gap-3 mb-10">
          {categories.map((cat, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={cat.key}
                className={`flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-5 transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${COLORS[i]}12` }}
                >
                  <Icon className="size-4" style={{ color: COLORS[i] }} />
                </div>
                <ScoreRing score={cat.data.score} color={COLORS[i]} delay={500 + i * 100} />
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground text-center">
                  {cat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className={`flex items-center justify-center gap-4 mb-10 transition-all delay-700 duration-700 ${mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
        >
          <div className="h-px flex-1 bg-border/50" />
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Gesamt</span>
            <ScoreRing score={totalScore} color="var(--primary)" size={56} delay={900} />
          </div>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <div
          className={`mx-auto max-w-2xl rounded-xl border border-border/30 bg-secondary/30 px-6 py-5 transition-all delay-1000 duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <p className="text-center text-sm italic leading-relaxed text-muted-foreground">
            {"\u201eStellen Sie sich vor, Sie erben eine 100 m\u00B2-Wohnung in Berlin. W\u00fcrden Sie sie verkaufen? Nein. Genau das bauen wir jetzt f\u00fcr Sie auf \u2013 nur smarter.\u201c"}
          </p>
        </div>
      </div>
    </div>
  );
}
