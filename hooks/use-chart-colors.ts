"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"

interface ChartColors {
  chart1: string
  chart2: string
  chart3: string
  gridStroke: string
  tooltipBg: string
  tooltipBorder: string
  foreground: string
  dimmed: string
  subtle: string
}

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function getColors(): ChartColors {
  return {
    chart1: readCssVar("--chart-1") || "#3a5aaa",
    chart2: readCssVar("--chart-2") || "#aa3a3a",
    chart3: readCssVar("--chart-3") || "#4a8a4a",
    gridStroke: readCssVar("--grid-stroke") || "#1a1a2e",
    tooltipBg: readCssVar("--tooltip-bg") || "#12121f",
    tooltipBorder: readCssVar("--tooltip-border") || "#2a2a3e",
    foreground: readCssVar("--foreground") || "#e0e0f0",
    dimmed: readCssVar("--dimmed") || "#8a8a9a",
    subtle: readCssVar("--subtle") || "#5a5a7a",
  }
}

export function useChartColors(): ChartColors {
  const { theme } = useTheme()
  const [colors, setColors] = useState<ChartColors>({
    chart1: "#3a5aaa",
    chart2: "#aa3a3a",
    chart3: "#4a8a4a",
    gridStroke: "#1a1a2e",
    tooltipBg: "#12121f",
    tooltipBorder: "#2a2a3e",
    foreground: "#e0e0f0",
    dimmed: "#8a8a9a",
    subtle: "#5a5a7a",
  })

  useEffect(() => {
    // Small delay to allow CSS variables to apply after theme switch
    const timer = setTimeout(() => {
      setColors(getColors())
    }, 50)
    return () => clearTimeout(timer)
  }, [theme])

  return colors
}
