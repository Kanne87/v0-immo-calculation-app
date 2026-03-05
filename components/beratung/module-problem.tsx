"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingDown, Home, Percent } from "lucide-react";

const ICONS = [TrendingDown, Home, Percent];
const COLORS = ["text-red-400", "text-amber-400", "text-orange-400"];
const BG_COLORS = ["bg-red-400/10", "bg-amber-400/10", "bg-orange-400/10"];

const PROBLEM_DATA = {
  headline: "Was bewegt die Menschen?",
  cards: [
    {
      label: "Rentenluecke",
      value: "1.720 \u20AC",
      context: "Brutto-Rente bei 4.000 \u20AC Netto heute",
      source: "Deutsche Rentenversicherung, 2024",
    },
    {
      label: "Leerstand Berlin",
      value: "0,8 %",
      context: "Historisch niedrigster Wohnungsleerstand",
      source: "CBRE Research, Q4 2024",
    },
    {
      label: "Inflation seit 2020",
      value: "+22 %",
      context: "Kaufkraftverlust in nur 4 Jahren",
      source: "Statistisches Bundesamt, 2024",
    },
  ],
};

function AnimatedValue({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`inline-block transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {value}{suffix}
    </span>
  );
}

export function ModuleProblem() {
  const { cards, headline } = PROBLEM_DATA;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1
          className={`mb-4 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl lg:text-6xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {headline}
        </h1>
        <p
          className={`mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground transition-all delay-200 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Die drei groessten finanziellen Herausforderungen unserer Zeit
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={card.label}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-700 hover:border-border ${
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                <div className={`mb-6 flex size-12 items-center justify-center rounded-xl ${BG_COLORS[i]}`}>
                  <Icon className={`size-6 ${COLORS[i]}`} />
                </div>
                <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  {card.label}
                </p>
                <p className={`mb-4 text-5xl font-bold tracking-tight ${COLORS[i]}`}>
                  <AnimatedValue value={card.value} />
                </p>
                <p className="mb-4 text-base leading-relaxed text-foreground/80">
                  {card.context}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.source}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
