"use client"

import { Building2, FileText, Home, Landmark, BarChart3, Scale, TrendingUp, Trophy, Receipt, CreditCard } from "lucide-react"
import type { ReactNode } from "react"

const iconMap: Record<string, ReactNode> = {
  building: <Building2 className="w-[18px] h-[18px] text-primary" />,
  receipt: <Receipt className="w-[18px] h-[18px] text-primary" />,
  home: <Home className="w-[18px] h-[18px] text-primary" />,
  landmark: <Landmark className="w-[18px] h-[18px] text-primary" />,
  chart: <BarChart3 className="w-[18px] h-[18px] text-primary" />,
  bank: <CreditCard className="w-[18px] h-[18px] text-primary" />,
  scale: <Scale className="w-[18px] h-[18px] text-primary" />,
  trending: <TrendingUp className="w-[18px] h-[18px] text-primary" />,
  trophy: <Trophy className="w-[18px] h-[18px] text-primary" />,
  file: <FileText className="w-[18px] h-[18px] text-primary" />,
}

export function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-4 mt-2">
      <div className="flex items-center gap-2 mb-0.5">
        {iconMap[icon] || null}
        <h3 className="m-0 text-[15px] font-semibold text-primary font-serif tracking-wide">
          {title}
        </h3>
      </div>
      {subtitle && (
        <p className="m-0 text-[11px] text-subtle pl-[26px]">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function ResultRow({
  label,
  value,
  highlight,
  bold,
  negative,
  indent,
}: {
  label: string
  value: string
  highlight?: boolean
  bold?: boolean
  negative?: boolean
  indent?: boolean
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 rounded ${
        indent ? "px-3" : "px-0"
      } mb-px ${highlight ? "bg-primary/[0.08]" : ""}`}
    >
      <span
        className={`text-[13px] ${
          indent ? "font-mono text-xs" : "font-serif"
        } ${bold ? "text-foreground font-semibold" : "text-dimmed"}`}
      >
        {label}
      </span>
      <span
        className={`font-serif ${
          highlight
            ? "text-primary font-semibold text-[15px]"
            : negative
              ? "text-negative text-[13px]"
              : bold
                ? "text-foreground font-semibold text-[13px]"
                : "text-foreground/70 text-[13px]"
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function Divider() {
  return <div className="h-px bg-border my-1.5" />
}

export function GoldDivider() {
  return <div className="h-0.5 bg-primary my-2.5" />
}

export function ResultCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card rounded-lg p-3.5 border border-border">
      {children}
    </div>
  )
}

export function HighlightCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primary/[0.08] rounded-lg p-3 border border-primary/20">
      {children}
    </div>
  )
}

export function Disclaimer() {
  return (
    <div className="mt-5 p-3 bg-primary/5 rounded-lg border border-primary/15">
      <p className="text-[9px] text-subtle m-0 leading-relaxed font-mono">
        Hinweis: Diese Berechnung dient der Orientierung und stellt keine
        Steuer- oder Finanzberatung dar. Steuerliche Auswirkungen sind
        individuell durch einen Steuerberater zu pruefen. Alle Angaben ohne
        Gewaehr. Wert- und Mietentwicklung basieren auf Annahmen.
      </p>
    </div>
  )
}
