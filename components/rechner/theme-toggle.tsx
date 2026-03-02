"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all cursor-pointer"
      aria-label={isDark ? "Zur Tagansicht wechseln" : "Zur Nachtansicht wechseln"}
      title={isDark ? "Tag" : "Nacht"}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline">{isDark ? "Tag" : "Nacht"}</span>
    </button>
  )
}
