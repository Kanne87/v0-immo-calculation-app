"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

const STORAGE_KEY = "immo-theme"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY) as "dark" | "light" | null
    const initial = stored || "dark"
    setTheme(initial)
    document.documentElement.setAttribute("data-theme", initial)
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-md bg-secondary text-dimmed border border-border hover:text-foreground hover:border-primary/30 transition-all"
      aria-label={theme === "dark" ? "Helles Design" : "Dunkles Design"}
      title={theme === "dark" ? "Helles Design" : "Dunkles Design"}
    >
      {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  )
}
