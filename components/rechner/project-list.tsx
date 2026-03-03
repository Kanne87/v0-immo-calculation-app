"use client"

import { useState, useMemo } from "react"
import {
  Building2,
  Calculator,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
  FileText,
  MapPin,
  Leaf,
  Plus,
} from "lucide-react"
import type { SavedCalculation } from "@/lib/rechner-types"
import type { WohneinheitData } from "@/lib/units-data"
import type { ProjektDefinition } from "@/lib/projects-data"
import type { AdvisorProfile } from "@/lib/advisor"
import { eur } from "@/lib/rechner-calc"
import { ProfileMenu } from "./profile-menu"

type SortKey = "nr" | "wfl" | "kaufpreis"
type SortDir = "asc" | "desc"

interface Props {
  projekte: ProjektDefinition[]
  savedCalcs: SavedCalculation[]
  advisorProfile?: AdvisorProfile | null
  onSelectUnit: (unit: WohneinheitData, projektId: string) => void
  onSelectCalc: (calc: SavedCalculation) => void
  onDeleteCalc: (id: string) => void
  onFreeCalc?: () => void
  onProfileSave?: (updates: Omit&lt;AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">) => Promise&lt;void>
}

function ProjektSektion({
  projekt,
  onSelectUnit,
}: {
  projekt: ProjektDefinition
  onSelectUnit: (unit: WohneinheitData) => void
}) {
  const [etageFilter, setEtageFilter] = useState("alle")
  const [zimmerFilter, setZimmerFilter] = useState("alle")
  const [sortKey, setSortKey] = useState&lt;SortKey>("nr")
  const [sortDir, setSortDir] = useState&lt;SortDir>("asc")
  const [showFilters, setShowFilters] = useState(false)
  const [collapsed, setCollapsed] = useState(true)

  const etagen = useMemo(() => {
    const set = new Set(projekt.einheiten.map((u) => u.etage))
    return ["alle", ...Array.from(set)]
  }, [projekt.einheiten])

  const zimmerWerte = useMemo(() => {
    const set = new Set(projekt.einheiten.map((u) => String(u.zimmer)))
    return ["alle", ...Array.from(set).sort()]
  }, [projekt.einheiten])

  const filteredUnits = useMemo(() => {
    let units = [...projekt.einheiten]
    if (etageFilter !== "alle") units = units.filter((u) => u.etage === etageFilter)
    if (zimmerFilter !== "alle") units = units.filter((u) => u.zimmer === Number(zimmerFilter))
    units.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1
      if (sortKey === "nr") return (a.nr - b.nr) * mul
      if (sortKey === "wfl") return (a.wfl - b.wfl) * mul
      return (a.gesamtKaufpreis - b.gesamtKaufpreis) * mul
    })
    return units
  }, [projekt.einheiten, etageFilter, zimmerFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return &lt;ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
    return sortDir === "asc" ? &lt;ChevronUp className="w-2.5 h-2.5" /> : &lt;ChevronDown className="w-2.5 h-2.5" />
  }

  const displayName = projekt.haus ? `${projekt.name} – ${projekt.haus}` : projekt.name

  return (
    &lt;section className="mb-6">
      &lt;button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        &lt;div className="flex items-start gap-3">
          &lt;div className="p-2 bg-primary/10 rounded-lg mt-0.5">
            &lt;Building2 className="w-5 h-5 text-primary" />
          &lt;/div>
          &lt;div className="text-left">
            &lt;h2 className="text-base font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            &lt;/h2>
            &lt;div className="flex items-center gap-3 mt-0.5">
              &lt;span className="flex items-center gap-1 text-[10px] font-mono text-subtle">
                &lt;MapPin className="w-3 h-3" />
                {projekt.adresse}
              &lt;/span>
              &lt;span className="flex items-center gap-1 text-[10px] font-mono text-primary/70">
                &lt;Leaf className="w-3 h-3" />
                {projekt.energiestandard}
              &lt;/span>
            &lt;/div>
          &lt;/div>
        &lt;/div>
        &lt;div className="flex items-center gap-3">
          &lt;span className="text-[10px] font-mono text-subtle bg-secondary px-1.5 py-0.5 rounded">
            {projekt.einheiten.length} Einheiten
          &lt;/span>
          {collapsed ? &lt;ChevronDown className="w-4 h-4 text-subtle" /> : &lt;ChevronUp className="w-4 h-4 text-subtle" />}
        &lt;/div>
      &lt;/button>

      {!collapsed &amp;&amp; (
        &lt;>
          &lt;div className="flex justify-end mb-2">
            &lt;button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all border ${
                showFilters
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-secondary text-subtle border-border hover:text-foreground"
              }`}
            >
              &lt;Filter className="w-3 h-3" />
              Filter
            &lt;/button>
          &lt;/div>

          {showFilters &amp;&amp; (
            &lt;div className="mb-3 p-3 rounded-lg border border-border bg-secondary/30 flex flex-wrap gap-3">
              &lt;div>
                &lt;div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Etage&lt;/div>
                &lt;div className="flex gap-1 flex-wrap">
                  {etagen.map((e) => (
                    &lt;button key={e} onClick={() => setEtageFilter(e)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        etageFilter === e ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle hover:text-foreground"
                      }`}>{e}&lt;/button>
                  ))}
                &lt;/div>
              &lt;/div>
              &lt;div>
                &lt;div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Zimmer&lt;/div>
                &lt;div className="flex gap-1">
                  {zimmerWerte.map((z) => (
                    &lt;button key={z} onClick={() => setZimmerFilter(z)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        zimmerFilter === z ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle hover:text-foreground"
                      }`}>{z === "alle" ? "alle" : `${z} Zi.`}&lt;/button>
                  ))}
                &lt;/div>
              &lt;/div>
            &lt;/div>
          )}

          &lt;div className="rounded-lg border border-border overflow-hidden">
            &lt;div className="grid grid-cols-[56px_52px_36px_58px_88px_60px] md:grid-cols-[70px_60px_44px_70px_100px_90px] gap-1 px-3 py-2 bg-secondary text-[9px] text-subtle font-mono uppercase tracking-wider">
              &lt;button onClick={() => toggleSort("nr")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                WE &lt;SortIcon col="nr" />
              &lt;/button>
              &lt;span>Etage&lt;/span>
              &lt;span>Zi.&lt;/span>
              &lt;button onClick={() => toggleSort("wfl")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                {"m²"} &lt;SortIcon col="wfl" />
              &lt;/button>
              &lt;button onClick={() => toggleSort("kaufpreis")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                Kaufpreis &lt;SortIcon col="kaufpreis" />
              &lt;/button>
              &lt;span className="hidden md:block">{"€/m²"}&lt;/span>
            &lt;/div>

            &lt;div className="max-h-[500px] overflow-y-auto">
              {filteredUnits.map((we) => (
                &lt;button
                  key={we.id}
                  onClick={() => onSelectUnit(we)}
                  className="w-full grid grid-cols-[56px_52px_36px_58px_88px_60px] md:grid-cols-[70px_60px_44px_70px_100px_90px] gap-1 px-3 py-2.5 text-[11px] font-mono transition-all border-t border-border/50 text-left hover:bg-primary/5 text-foreground cursor-pointer"
                >
                  &lt;span className="font-semibold">{we.id}&lt;/span>
                  &lt;span>{we.etage}&lt;/span>
                  &lt;span>{we.zimmer}&lt;/span>
                  &lt;span>{we.wfl}&lt;/span>
                  &lt;span>{`${(we.gesamtKaufpreis / 1000).toFixed(0)}T€`}&lt;/span>
                  &lt;span className="hidden md:block text-subtle">
                    {we.qmPreis.toLocaleString("de-DE")}
                  &lt;/span>
                &lt;/button>
              ))}
            &lt;/div>

            &lt;div className="px-3 py-2 bg-secondary/50 border-t border-border">
              &lt;span className="text-[9px] font-mono text-subtle">
                {filteredUnits.length} / {projekt.einheiten.length} Einheiten
              &lt;/span>
            &lt;/div>
          &lt;/div>
        &lt;/>
      )}
    &lt;/section>
  )
}

export function ProjectList({
  projekte,
  savedCalcs,
  advisorProfile,
  onSelectUnit,
  onSelectCalc,
  onDeleteCalc,
  onFreeCalc,
  onProfileSave,
}: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState&lt;string | null>(null)

  return (
    &lt;div className="w-full max-w-[480px] md:max-w-[900px] mx-auto min-h-screen bg-background">
      &lt;header className="px-5 pt-8 pb-5 border-b border-border relative">
        &lt;div className="text-[11px] text-primary font-mono tracking-[3px] uppercase mb-1">
          Kapitalanlage-Rechner Pro
        &lt;/div>
        &lt;h1 className="text-2xl font-serif text-foreground font-semibold mt-1 mb-1 text-balance">
          Immobilien-Kapitalanlagen
        &lt;/h1>
        &lt;p className="text-xs text-dimmed font-mono">
          Neubauprojekte analysieren und vergleichen
        &lt;/p>
        {advisorProfile &amp;&amp; onProfileSave &amp;&amp; (
          &lt;div className="absolute top-6 right-5">
            &lt;ProfileMenu profile={advisorProfile} onSave={onProfileSave} />
          &lt;/div>
        )}
      &lt;/header>

      &lt;main className="p-5">
        &lt;section className="mb-8">
          &lt;div className="flex items-center justify-between mb-3">
            &lt;div className="flex items-center gap-2">
              &lt;Calculator className="w-4 h-4 text-primary" />
              &lt;h2 className="text-sm font-serif font-semibold text-foreground">
                Meine Berechnungen
              &lt;/h2>
            {savedCalcs.length > 0 &amp;&amp; (
              &lt;span className="text-[10px] font-mono text-subtle bg-secondary px-1.5 py-0.5 rounded">
                {savedCalcs.length}
              &lt;/span>
            )}
            &lt;/div>
            {onFreeCalc &amp;&amp; (
              &lt;button
                onClick={onFreeCalc}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
              >
                &lt;Plus className="w-3 h-3" />
                &lt;span className="hidden sm:inline">Freie Berechnung&lt;/span>
                &lt;span className="sm:hidden">Neu&lt;/span>
              &lt;/button>
            )}
          &lt;/div>

          {savedCalcs.length === 0 ? (
            &lt;div className="py-8 px-4 rounded-lg border border-dashed border-border bg-secondary/20 text-center">
              &lt;FileText className="w-8 h-8 text-subtle mx-auto mb-2" />
              &lt;p className="text-xs text-dimmed font-mono">
                Noch keine Berechnungen gespeichert.
              &lt;/p>
              &lt;p className="text-[10px] text-subtle font-mono mt-1">
                {"Wähle eine Wohneinheit oder starte eine freie Berechnung."}
              &lt;/p>
            &lt;/div>
          ) : (
            &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {savedCalcs.map((calc) => (
                &lt;div key={calc.id} className="group relative bg-card rounded-lg border border-primary/15 hover:border-primary/40 transition-all cursor-pointer">
                  &lt;button onClick={() => onSelectCalc(calc)} className="w-full p-3.5 text-left">
                    &lt;div className="flex items-start justify-between mb-2">
                      &lt;div className="flex-1 min-w-0">
                        &lt;div className="text-sm font-serif text-foreground font-semibold truncate">{calc.description}&lt;/div>
                        &lt;div className="flex items-center gap-2 mt-1">
                          &lt;span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">{calc.sourceUnitId}&lt;/span>
                          &lt;span className="text-[10px] font-mono text-subtle">
                            {new Date(calc.updatedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                          &lt;/span>
                        &lt;/div>
                      &lt;/div>
                    &lt;/div>
                    &lt;div className="flex gap-4 text-[10px] font-mono text-dimmed">
                      &lt;span>{`KP ${eur(calc.projectData.kaufpreis + calc.projectData.stellplatz, 0)}`}&lt;/span>
                      &lt;span>{`${calc.projectData.wfl} m²`}&lt;/span>
                      &lt;span>{`EK ${eur(calc.projectData.eigenkapital, 0)}`}&lt;/span>
                    &lt;/div>
                  &lt;/button>
                  &lt;button
                    onClick={(e) => { e.stopPropagation(); setPendingDeleteId(calc.id) }}
                    className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-subtle hover:text-destructive transition-all"
                    aria-label={"Berechnung löschen"}
                  >
                    &lt;Trash2 className="w-3.5 h-3.5" />
                  &lt;/button>
                &lt;/div>
              ))}
            &lt;/div>
          )}
        &lt;/section>

        &lt;div className="mb-4">
          &lt;h2 className="text-[11px] text-subtle font-mono uppercase tracking-[2px]">
            {"Verfügbare Projekte"}
          &lt;/h2>
        &lt;/div>

        {projekte.map((projekt) => (
          &lt;ProjektSektion
            key={projekt.id}
            projekt={projekt}
            onSelectUnit={(unit) => onSelectUnit(unit, projekt.id)}
          />
        ))}
      &lt;/main>

      {pendingDeleteId &amp;&amp; (
        &lt;div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          &lt;div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPendingDeleteId(null)} />
          &lt;div className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-xl">
            &lt;div className="px-4 py-4">
              &lt;h3 className="text-sm font-serif font-semibold text-foreground mb-2">{"Berechnung löschen?"}&lt;/h3>
              &lt;p className="text-xs text-dimmed font-mono">
                {`„${savedCalcs.find((c) => c.id === pendingDeleteId)?.description}" wird unwiderruflich gelöscht.`}
              &lt;/p>
            &lt;/div>
            &lt;div className="flex gap-2 px-4 py-3 border-t border-border">
              &lt;button onClick={() => setPendingDeleteId(null)} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all">Abbrechen&lt;/button>
              &lt;button onClick={() => { onDeleteCalc(pendingDeleteId); setPendingDeleteId(null) }} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-all">{"Löschen"}&lt;/button>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      )}
    &lt;/div>
  )
}
