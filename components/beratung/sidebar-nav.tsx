"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { STEPS } from "@/lib/beratung-steps";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarNavProps {
  slug: string;
  currentStep: number;
  visitedSteps: number[];
}

export function SidebarNav({ slug, currentStep, visitedSteps }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <nav
      className={cn(
        "fixed left-0 top-0 z-50 flex h-dvh flex-col border-r border-border/50 bg-background/95 backdrop-blur-sm transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        {!collapsed && (
          <span className="truncate text-sm font-semibold text-foreground">
            Beratung
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={collapsed ? "Sidebar erweitern" : "Sidebar einklappen"}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-2 py-2">
        {STEPS.map((step) => {
          const isActive = step.number === currentStep;
          const isVisited = visitedSteps.includes(step.number);
          const Icon = step.icon;

          return (
            <Link
              key={step.number}
              href={`/beratung/${slug}/${step.number}`}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : isVisited
                    ? "bg-secondary text-foreground"
                    : "bg-secondary/50 text-muted-foreground"
                )}
              >
                {isVisited && !isActive ? (
                  <Check className="size-3.5" />
                ) : (
                  step.number
                )}
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="truncate font-medium leading-tight">{step.shortTitle}</span>
                  <span className="truncate text-xs text-muted-foreground">{step.title}</span>
                </div>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-foreground" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border/50 px-3 py-3">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">
            Schritt {currentStep} von {STEPS.length}
          </p>
        )}
      </div>
    </nav>
  );
}
