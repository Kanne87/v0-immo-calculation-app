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
  BookOpen,
} from "lucide-react"
import type { SavedCalculation } from "@/lib/rechner-types"
import type { WohneinheitData } from "@/lib/units-data"
import type { ProjektDefinition } from "@/lib/projects-data"
import type { AdvisorProfile } from "@/lib/advisor"
import { eur } from "@/lib/rechner-calc"
import { ProfileMenu } from "./profile-menu"
import { ThemeToggle } from "./theme-toggle"
import { ObjektPraesentation } from "./objekt-praesentation"

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
  onProfileSave?: (updates: Omit<AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">) => Promise<void>
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
  const [sortKey, setSortKey] = useState<SortKey>("nr")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [showFilters, setShowFilters] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [showPraesentation, setShowPraesentation] = useState(false)

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
    if (sortKey !== col) return <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
    return sortDir === "asc" ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />
  }

  const displayName = projekt.haus ? `${projekt.name} – ${projekt.haus}` : projekt.name
  const hasPraesentation = projekt.coverImageUrl || (projekt.keyfacts?.length ?? 0) > 0 || (projekt.praesektionen?.length ?? 0) > 0 || projekt.videoUrl

  return (
    <section className="mb-6">
      <div className="w-full flex items-center justify-between mb-3 group">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-start gap-3 flex-1 min-w-0 text-left"
        >
          <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
              {displayName}
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-[10px] font-mono text-subtle">
                <MapPin className="w-3 h-3" />
                {projekt.adresse}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-primary/70">
                <Leaf className="w-3 h-3" />
                {projekt.energiestandard}
              </span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasPraesentation && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowPraesentation(true) }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all"
              title="Objektpräsentation öffnen"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Präsentation</span>
            </button>
          )}
          <span className="text-[10px] font-mono text-subtle bg-secondary px-1.5 py-0.5 rounded">
            {projekt.einheiten.length} Einheiten
          </span>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronDown className="w-4 h-4 text-subtle" /> : <ChevronUp className="w-4 h-4 text-subtle" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all border ${
                showFilters
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-secondary text-subtle border-border hover:text-foreground"
              }`}
            >
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>

          {showFilters && (
            <div className="mb-3 p-3 rounded-lg border border-border bg-secondary/30 flex flex-wrap gap-3">
              <div>
                <div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Etage</div>
                <div className="flex gap-1 flex-wrap">
                  {etagen.map((e) => (
                    <button key={e} onClick={() => setEtageFilter(e)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        etageFilter === e ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle hover:text-foreground"
                      }`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Zimmer</div>
                <div className="flex gap-1">
                  {zimmerWerte.map((z) => (
                    <button key={z} onClick={() => setZimmerFilter(z)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        zimmerFilter === z ? "bg-primary text-primary-foreground" : "bg-secondary text-subtle hover:text-foreground"
                      }`}>{z === "alle" ? "alle" : `${z} Zi.`}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[56px_52px_36px_58px_88px_60px] md:grid-cols-[70px_60px_44px_70px_100px_90px] gap-1 px-3 py-2 bg-secondary text-[9px] text-subtle font-mono uppercase tracking-wider">
              <button onClick={() => toggleSort("nr")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                WE <SortIcon col="nr" />
              </button>
              <span>Etage</span>
              <span>Zi.</span>
              <button onClick={() => toggleSort("wfl")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                m&#178; <SortIcon col="wfl" />
              </button>
              <button onClick={() => toggleSort("kaufpreis")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                Kaufpreis <SortIcon col="kaufpreis" />
              </button>
              <span className="hidden md:block">&#8364;/m&#178;</span>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {filteredUnits.map((we) => (
                <button
                  key={we.id}
                  onClick={() => onSelectUnit(we)}
                  className="w-full grid grid-cols-[56px_52px_36px_58px_88px_60px] md:grid-cols-[70px_60px_44px_70px_100px_90px] gap-1 px-3 py-2.5 text-[11px] font-mono transition-all border-t border-border/50 text-left hover:bg-primary/5 text-foreground cursor-pointer"
                >
                  <span className="font-semibold">{we.id}</span>
                  <span>{we.etage}</span>
                  <span>{we.zimmer}</span>
                  <span>{we.wfl}</span>
                  <span>{`${(we.gesamtKaufpreis / 1000).toFixed(0)}T€`}</span>
                  <span className="hidden md:block text-subtle">
                    {we.qmPreis.toLocaleString("de-DE")}
                  </span>
                </button>
              ))}
            </div>

            <div className="px-3 py-2 bg-secondary/50 border-t border-border">
              <span className="text-[9px] font-mono text-subtle">
                {filteredUnits.length} / {projekt.einheiten.length} Einheiten
              </span>
            </div>
          </div>
        </>
      )}

      {showPraesentation && (
        <ObjektPraesentation
          projekt={projekt}
          onClose={() => setShowPraesentation(false)}
        />
      )}
    </section>
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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [calcsCollapsed, setCalcsCollapsed] = useState(true)

  return (
    <div className="w-full max-w-[480px] md:max-w-[900px] mx-auto min-h-screen bg-background">
      <header className="px-5 pt-8 pb-5 border-b border-border relative">
        <div className="text-[11px] text-primary font-mono tracking-[3px] uppercase mb-1">
          Kapitalanlage-Rechner Pro
        </div>
        <h1 className="text-2xl font-serif text-foreground font-semibold mt-1 mb-1 text-balance">
          Immobilien-Kapitalanlagen
        </h1>
        <p className="text-xs text-dimmed font-mono">
          Neubauprojekte analysieren und vergleichen
        </p>
        <div className="absolute top-6 right-5 flex items-center gap-2">
          <ThemeToggle />
          {advisorProfile && onProfileSave && (
            <ProfileMenu profile={advisorProfile} onSave={onProfileSave} />
          )}
        </div>
      </header>

      <main className="p-5">
        <div className="mb-4">
          <h2 className="text-[11px] text-subtle font-mono uppercase tracking-[2px]">
            Verfügbare Projekte
          </h2>
        </div>

        {projekte.map((projekt) => (
          <ProjektSektion
            key={projekt.id}
            projekt={projekt}
            onSelectUnit={(unit) => onSelectUnit(unit, projekt.id)}
          />
        ))}

        <section className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCalcsCollapsed(!calcsCollapsed)}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-sm font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                Meine Berechnungen
              </h2>
              {savedCalcs.length > 0 && (
                <span className="text-[10px] font-mono text-subtle bg-secondary px-1.5 py-0.5 rounded">
                  {savedCalcs.length}
                </span>
              )}
              {calcsCollapsed
                ? <ChevronDown className="w-4 h-4 text-subtle" />
                : <ChevronUp className="w-4 h-4 text-subtle" />
              }
            </button>
            {onFreeCalc && (
              <button
                onClick={onFreeCalc}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span className="hidden sm:inline">Freie Berechnung</span>
                <span className="sm:hidden">Neu</span>
              </button>
            )}
          </div>

          {!calcsCollapsed && (
            savedCalcs.length === 0 ? (
              <div className="py-8 px-4 rounded-lg border border-dashed border-border bg-secondary/20 text-center">
                <FileText className="w-8 h-8 text-subtle mx-auto mb-2" />
                <p className="text-xs text-dimmed font-mono">
                  Noch keine Berechnungen gespeichert.
                </p>
                <p className="text-[10px] text-subtle font-mono mt-1">
                  Wähle eine Wohneinheit oder starte eine freie Berechnung.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {savedCalcs.map((calc) => (
                  <div key={calc.id} className="group relative bg-card rounded-lg border border-primary/15 hover:border-primary/40 transition-all cursor-pointer">
                    <button onClick={() => onSelectCalc(calc)} className="w-full p-3.5 text-left">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-serif text-foreground font-semibold truncate">{calc.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">{calc.sourceUnitId}</span>
                            <span className="text-[10px] font-mono text-subtle">
                              {new Date(calc.updatedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-[10px] font-mono text-dimmed">
                        <span>{`KP ${eur(calc.projectData.kaufpreis + calc.projectData.stellplatz, 0)}`}</span>
                        <span>{`${calc.projectData.wfl} m²`}</span>
                        <span>{`EK ${eur(calc.projectData.eigenkapital, 0)}`}</span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPendingDeleteId(calc.id) }}
                      className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-subtle hover:text-destructive transition-all"
                      aria-label="Berechnung löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPendingDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-xl">
            <div className="px-4 py-4">
              <h3 className="text-sm font-serif font-semibold text-foreground mb-2">Berechnung löschen?</h3>
              <p className="text-xs text-dimmed font-mono">
                {`„${savedCalcs.find((c) => c.id === pendingDeleteId)?.description}“ wird unwiderruflich gelöscht.`}
              </p>
            </div>
            <div className="flex gap-2 px-4 py-3 border-t border-border">
              <button onClick={() => setPendingDeleteId(null)} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all">Abbrechen</button>
              <button onClick={() => { onDeleteCalc(pendingDeleteId); setPendingDeleteId(null) }} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-all">Löschen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
