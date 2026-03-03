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
} from "lucide-react"
import type { SavedCalculation } from "@/lib/rechner-types"
import { HAUS1_EINHEITEN, PROJEKT_ECKDATEN } from "@/lib/units-data"
import type { WohneinheitData } from "@/lib/units-data"
import { eur } from "@/lib/rechner-calc"

// ─── Types ────────────────────────────────────────────────────────

type SortKey = "nr" | "wfl" | "kaufpreis"
type SortDir = "asc" | "desc"
type EtageFilter = "alle" | "EG" | "1. OG" | "2. OG" | "3. OG" | "DG"
type StatusFilter = "alle" | "frei" | "reserviert" | "verkauft"
type ZimmerFilter = "alle" | "1" | "2" | "3" | "4"

interface Props {
  savedCalcs: SavedCalculation[]
  onSelectUnit: (unit: WohneinheitData) => void
  onSelectCalc: (calc: SavedCalculation) => void
  onDeleteCalc: (id: string) => void
}

// ─── Status helpers ───────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  frei: "bg-emerald-400",
  reserviert: "bg-amber-400",
  verkauft: "bg-subtle",
}

const STATUS_TEXT: Record<string, string> = {
  frei: "text-emerald-400",
  reserviert: "text-amber-400",
  verkauft: "text-subtle",
}

// ─── Component ────────────────────────────────────────────────────

export function ProjectList({
  savedCalcs,
  onSelectUnit,
  onSelectCalc,
  onDeleteCalc,
}: Props) {
  // Filter state
  const [etageFilter, setEtageFilter] = useState<EtageFilter>("alle")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle")
  const [zimmerFilter, setZimmerFilter] = useState<ZimmerFilter>("alle")
  const [sortKey, setSortKey] = useState<SortKey>("nr")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [showFilters, setShowFilters] = useState(false)

  // Delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  // Filtered + sorted units
  const filteredUnits = useMemo(() => {
    let units = [...HAUS1_EINHEITEN]

    if (etageFilter !== "alle") {
      units = units.filter((u) => u.etage === etageFilter)
    }
    if (statusFilter !== "alle") {
      units = units.filter((u) => u.status === statusFilter)
    }
    if (zimmerFilter !== "alle") {
      units = units.filter((u) => u.zimmer === Number(zimmerFilter))
    }

    units.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1
      if (sortKey === "nr") return (a.nr - b.nr) * mul
      if (sortKey === "wfl") return (a.wfl - b.wfl) * mul
      return (a.gesamtKaufpreis - b.gesamtKaufpreis) * mul
    })

    return units
  }, [etageFilter, statusFilter, zimmerFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
    return sortDir === "asc" ? (
      <ChevronUp className="w-2.5 h-2.5" />
    ) : (
      <ChevronDown className="w-2.5 h-2.5" />
    )
  }

  // Stats
  const freiCount = HAUS1_EINHEITEN.filter((u) => u.status === "frei").length
  const resCount = HAUS1_EINHEITEN.filter((u) => u.status === "reserviert").length

  return (
    <div className="w-full max-w-[480px] md:max-w-[900px] mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="px-5 pt-8 pb-5 border-b border-border">
        <div className="text-[11px] text-primary font-mono tracking-[3px] uppercase mb-1">
          Kapitalanlage-Rechner Pro
        </div>
        <h1 className="text-2xl font-serif text-foreground font-semibold mt-1 mb-1 text-balance">
          {PROJEKT_ECKDATEN.name} \u2013 {PROJEKT_ECKDATEN.haus}
        </h1>
        <p className="text-xs text-dimmed font-mono">
          {PROJEKT_ECKDATEN.adresse} \u00B7 {PROJEKT_ECKDATEN.energiestandard}
        </p>
      </header>

      <main className="p-5">
        {/* ─── Section 1: Meine Berechnungen ──────────────────── */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-serif font-semibold text-foreground">
              Meine Berechnungen
            </h2>
            {savedCalcs.length > 0 && (
              <span className="text-[10px] font-mono text-subtle bg-secondary px-1.5 py-0.5 rounded">
                {savedCalcs.length}
              </span>
            )}
          </div>

          {savedCalcs.length === 0 ? (
            <div className="py-8 px-4 rounded-lg border border-dashed border-border bg-secondary/20 text-center">
              <FileText className="w-8 h-8 text-subtle mx-auto mb-2" />
              <p className="text-xs text-dimmed font-mono">
                Noch keine Berechnungen gespeichert.
              </p>
              <p className="text-[10px] text-subtle font-mono mt-1">
                W\u00E4hle eine Wohneinheit aus und erstelle deine erste Berechnung.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {savedCalcs.map((calc) => (
                <div
                  key={calc.id}
                  className="group relative bg-card rounded-lg border border-primary/15 hover:border-primary/40 transition-all cursor-pointer"
                >
                  <button
                    onClick={() => onSelectCalc(calc)}
                    className="w-full p-3.5 text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-serif text-foreground font-semibold truncate">
                          {calc.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">
                            {calc.sourceUnitId}
                          </span>
                          <span className="text-[10px] font-mono text-subtle">
                            {new Date(calc.updatedAt).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 text-[10px] font-mono text-dimmed">
                      <span>KP {eur(calc.projectData.kaufpreis + calc.projectData.stellplatz, 0)}</span>
                      <span>{calc.projectData.wfl} m\u00B2</span>
                      <span>EK {eur(calc.projectData.eigenkapital, 0)}</span>
                    </div>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPendingDeleteId(calc.id)
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-subtle hover:text-destructive transition-all"
                    aria-label="Berechnung l\u00F6schen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Section 2: Wohneinheiten ───────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-serif font-semibold text-foreground">
                Wohneinheiten
              </h2>
              <span className="text-[10px] font-mono text-subtle bg-secondary px-1.5 py-0.5 rounded">
                {freiCount} frei \u00B7 {resCount} reserviert
              </span>
            </div>
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

          {/* Filters */}
          {showFilters && (
            <div className="mb-3 p-3 rounded-lg border border-border bg-secondary/30 flex flex-wrap gap-3">
              <div>
                <div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Etage</div>
                <div className="flex gap-1">
                  {(["alle", "EG", "1. OG", "2. OG", "3. OG", "DG"] as EtageFilter[]).map((e) => (
                    <button
                      key={e}
                      onClick={() => setEtageFilter(e)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        etageFilter === e
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-subtle hover:text-foreground"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Zimmer</div>
                <div className="flex gap-1">
                  {(["alle", "1", "2", "3", "4"] as ZimmerFilter[]).map((z) => (
                    <button
                      key={z}
                      onClick={() => setZimmerFilter(z)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        zimmerFilter === z
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-subtle hover:text-foreground"
                      }`}
                    >
                      {z === "alle" ? "alle" : `${z} Zi.`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-subtle font-mono uppercase tracking-wider mb-1">Status</div>
                <div className="flex gap-1">
                  {(["alle", "frei", "reserviert", "verkauft"] as StatusFilter[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                        statusFilter === s
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-subtle hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WE Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[56px_52px_36px_58px_88px_60px] md:grid-cols-[70px_60px_44px_70px_100px_80px_90px] gap-1 px-3 py-2 bg-secondary text-[9px] text-subtle font-mono uppercase tracking-wider">
              <button onClick={() => toggleSort("nr")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                WE <SortIcon col="nr" />
              </button>
              <span>Etage</span>
              <span>Zi.</span>
              <button onClick={() => toggleSort("wfl")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                m\u00B2 <SortIcon col="wfl" />
              </button>
              <button onClick={() => toggleSort("kaufpreis")} className="flex items-center gap-0.5 hover:text-foreground transition-colors">
                Kaufpreis <SortIcon col="kaufpreis" />
              </button>
              <span>Status</span>
              <span className="hidden md:block">\u20AC/m\u00B2</span>
            </div>

            {/* Rows */}
            <div className="max-h-[500px] overflow-y-auto">
              {filteredUnits.map((we) => {
                const isAvailable = we.status !== "verkauft"
                return (
                  <button
                    key={we.id}
                    onClick={() => isAvailable && onSelectUnit(we)}
                    disabled={!isAvailable}
                    className={`w-full grid grid-cols-[56px_52px_36px_58px_88px_60px] md:grid-cols-[70px_60px_44px_70px_100px_80px_90px] gap-1 px-3 py-2.5 text-[11px] font-mono transition-all border-t border-border/50 text-left ${
                      isAvailable
                        ? "hover:bg-primary/5 text-foreground cursor-pointer"
                        : "text-subtle/40 cursor-not-allowed"
                    }`}
                  >
                    <span className="font-semibold">{we.id}</span>
                    <span>{we.etage}</span>
                    <span>{we.zimmer}</span>
                    <span>{we.wfl}</span>
                    <span>{(we.gesamtKaufpreis / 1000).toFixed(0)}T\u20AC</span>
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[we.status]}`} />
                      <span className={`text-[9px] ${STATUS_TEXT[we.status]}`}>
                        {we.status === "frei" ? "frei" : we.status === "reserviert" ? "res." : "verk."}
                      </span>
                    </span>
                    <span className="hidden md:block text-subtle">
                      {we.qmPreis.toLocaleString("de-DE")}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 px-3 py-2 bg-secondary/50 border-t border-border">
              {["frei", "reserviert", "verkauft"].map((s) => (
                <span key={s} className="flex items-center gap-1 text-[9px] font-mono text-subtle">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                  {s}
                </span>
              ))}
              <span className="text-[9px] font-mono text-subtle ml-auto">
                {filteredUnits.length} / {HAUS1_EINHEITEN.length} Einheiten
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Delete confirmation inline */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPendingDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-xl">
            <div className="px-4 py-4">
              <h3 className="text-sm font-serif font-semibold text-foreground mb-2">
                Berechnung l\u00F6schen?
              </h3>
              <p className="text-xs text-dimmed font-mono">
                \u201E{savedCalcs.find((c) => c.id === pendingDeleteId)?.description}\u201C wird unwiderruflich gel\u00F6scht.
              </p>
            </div>
            <div className="flex gap-2 px-4 py-3 border-t border-border">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={() => {
                  onDeleteCalc(pendingDeleteId)
                  setPendingDeleteId(null)
                }}
                className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-all"
              >
                L\u00F6schen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
