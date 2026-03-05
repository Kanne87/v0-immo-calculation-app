"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { STEPS } from "@/lib/beratung-steps";
import { SidebarNav } from "./sidebar-nav";
import { ModuleProblem } from "./module-problem";
import { ModuleSolution } from "./module-solution";
import { ModuleBigFive } from "./module-bigfive";
import { ModuleLocation } from "./module-location";
import { ModuleProject } from "./module-project";
import { ModuleCalculator } from "./module-calculator";
import { ModuleCTA } from "./module-cta";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepViewProps {
  project: BeratungProjectData;
  step: number;
}

export function StepView({ project, step }: StepViewProps) {
  const router = useRouter();
  const [visitedSteps, setVisitedSteps] = useState<number[]>([]);

  useEffect(() => {
    setVisitedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, [step]);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      const newStep = direction === "prev" ? step - 1 : step + 1;
      if (newStep >= 1 && newStep <= STEPS.length) {
        router.push(`/beratung/${project.slug}/${newStep}`);
      }
    },
    [step, router, project.slug]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  useEffect(() => {
    let startX = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 80) {
        navigate(diff > 0 ? "next" : "prev");
      }
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [navigate]);

  const renderModule = () => {
    switch (step) {
      case 1:
        return <ModuleProblem />;
      case 2:
        return <ModuleSolution />;
      case 3:
        return <ModuleBigFive project={project} />;
      case 4:
        return <ModuleLocation project={project} />;
      case 5:
        return <ModuleProject project={project} />;
      case 6:
        return <ModuleCalculator project={project} />;
      case 7:
        return <ModuleCTA />;
      default:
        return <ModuleProblem />;
    }
  };

  return (
    <div className="flex min-h-dvh bg-background">
      <SidebarNav slug={project.slug} currentStep={step} visitedSteps={visitedSteps} />

      <main className="ml-16 flex-1">
        {renderModule()}
      </main>

      <div className="fixed bottom-0 left-16 right-0 z-40 flex items-center justify-between border-t border-border/30 bg-background/90 px-6 py-3 backdrop-blur-sm">
        <button
          onClick={() => navigate("prev")}
          disabled={step <= 1}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
          {step > 1 ? STEPS[step - 2].shortTitle : ""}
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s.number}
              className={`size-1.5 rounded-full transition-colors ${
                s.number === step ? "bg-foreground" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate("next")}
          disabled={step >= STEPS.length}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          {step < STEPS.length ? STEPS[step].shortTitle : ""}
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
