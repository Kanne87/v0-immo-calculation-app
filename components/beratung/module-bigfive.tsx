"use client";

import { useEffect, useState } from "react";
import type { BeratungProjectData, BigFiveCategory } from "@/lib/beratung/project-data";
import { MapPin, Hammer, LayoutGrid, Users, Tag, ChevronDown, Check, X } from "lucide-react";

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

function CriterionBar({ label, score, maxScore, reasoning }: { label: string; score: number; maxScore: number; reasoning: string }) {
  const pct = (score / maxScore) * 100;
  const color = pct >= 80 ? "bg-emerald-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="py-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold text-muted-foreground">{score}/{maxScore}</span>
      </div>
      <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground/80">{reasoning}</p>
    </div>
  );
}

function CategoryDetail({ data }: { data: BigFiveCategory }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1">
        {data.criteria.map((c) => (
          <CriterionBar key={c.label} {...c} />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.positives.length > 0 && (
          <div className="rounded-lg bg-emerald-400/5 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Staerken</p>
            <ul className="space-y-1.5">
              {data.positives.map((p) => (
                <li key={p} className="flex items-start gap-2 text-xs text-foreground/80">
                  <Check className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.negatives.length > 0 && (
          <div className="rounded-lg bg-red-400/5 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-red-400">Risiken</p>
            <ul className="space-y-1.5">
              {data.negatives.map((n) => (
                <li key={n} className="flex items-start gap-2 text-xs text-foreground/80">
                  <X className="mt-0.5 size-3 shrink-0 text-red-400" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function ModuleBigFive({ project }: { project: BeratungProjectData }) {
  const { bigFive } = project;
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const toggle = (key: string) => setExpanded((prev) => (prev === key ? null : key));

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 py-12">
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

        <div className="space-y-3">
          {categories.map((cat, i) => {
            const Icon = ICONS[i];
            const isOpen = expanded === cat.key;

            return (
              <div
                key={cat.key}
                className={`overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 ${
                  isOpen ? "border-border" : ""
                } ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
              >
                <button
                  onClick={() => toggle(cat.key)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-secondary/30"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${COLORS[i]}15` }}
                  >
                    <Icon className="size-5" style={{ color: COLORS[i] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground">
                      {cat.label}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {cat.data.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <ScoreRing score={cat.data.score} color={COLORS[i]} size={52} delay={600 + i * 80} />
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-border/30 px-5 pb-5">
                    <CategoryDetail data={cat.data} />
                  </div>
                </div>
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
