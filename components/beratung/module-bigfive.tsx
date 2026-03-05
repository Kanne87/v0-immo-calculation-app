"use client";

import { useEffect, useState } from "react";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { MapPin, Hammer, LayoutGrid, Users, Tag } from "lucide-react";

const ICONS = [MapPin, Hammer, LayoutGrid, Users, Tag];
const COLORS = ["#3b82f6", "#14b8a6", "#22c55e", "#a78bfa", "#f59e0b"];

function ScoreRing({
  score,
  color,
  size = 80,
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
          strokeWidth={4}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference - progress : circumference}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{score.toFixed(1)}</span>
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
      <div className="mx-auto w-full max-w-5xl">
        <h1
          className={`mb-4 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl lg:text-6xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Die Erfolgsformel
        </h1>
        <p
          className={`mx-auto mb-6 max-w-lg text-center text-lg text-muted-foreground transition-all delay-200 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          BIG FIVE Bewertung: {project.name}
        </p>

        <div
          className={`mx-auto mb-12 flex items-center justify-center transition-all delay-300 duration-700 ${
            mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <ScoreRing score={totalScore} color="#22c55e" size={120} delay={400} />
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {categories.map((cat, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={cat.key}
                className={`group flex flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center transition-all duration-500 hover:border-border ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${500 + i * 100}ms` }}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </p>
                <ScoreRing score={cat.data.score} color={COLORS[i]} delay={700 + i * 100} />
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  {cat.data.text}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className={`mx-auto mt-12 max-w-3xl rounded-xl border border-border/30 bg-secondary/30 px-6 py-4 transition-all delay-1000 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <p className="text-center text-sm italic leading-relaxed text-muted-foreground">
            {'"Stellen Sie sich vor, Sie erben eine 100 m\u00B2-Wohnung in Berlin. Wuerden Sie sie verkaufen? Nein. Genau das bauen wir jetzt fuer Sie auf \u2013 nur smarter."'}
          </p>
        </div>
      </div>
    </div>
  );
}
