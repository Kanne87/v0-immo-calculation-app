"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ALLE_ANALYSEN } from "@/lib/analyse-data"
import {
  ANALYSE_BEREICHE, BEREICH_LABELS, STATUS_CONFIG,
  type AnalyseBereichKey, type ProjektAnalyse, type AnalyseBereich, type OffeneFrage,
} from "@/lib/analyse-types"
import { ChevronLeft, FileText, AlertTriangle, CheckCircle, HelpCircle, Send } from "lucide-react"

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 10) * circ
  const color = score >= 7 ? "var(--positive)" : score >= 5 ? "var(--chart-4)" : "var(--destructive)"
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-semibold text-lg">
        {score.toFixed(1)}
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.offen
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 7 ? "bg-green-600" : score >= 5 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="h-1 rounded-full bg-secondary overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score * 10}%` }} />
    </div>
  )
}

function BereichCard({ bereichKey, bereich, isActive, onClick }: {
  bereichKey: AnalyseBereichKey
  bereich: AnalyseBereich
  isActive: boolean
  onClick: () => void
}) {
  const scoreColor = bereich.score >= 7 ? "text-green-700" : bereich.score >= 5 ? "text-amber-600" : "text-red-600"
  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-4 rounded-xl border transition-all ${
        isActive ? "border-primary bg-card shadow-sm" : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{BEREICH_LABELS[bereichKey]}</span>
        <span className={`font-semibold text-sm ${scoreColor}`}>{bereich.score.toFixed(1)}</span>
      </div>
      <ScoreBar score={bereich.score} />
      <div className="flex items-center gap-2 mt-2">
        <StatusPill status={bereich.status} />
        {bereich.offeneFragen.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {bereich.offeneFragen.filter(f => f.status === "offen").length} offen
          </span>
        )}
      </div>
    </button>
  )
}

function BereichDetail({ bereich }: { bereich: AnalyseBereich }) {
  const [showVerkauf, setShowVerkauf] = useState(false)
  return (
    <div className="space-y-6">
      {/* Toggle Intern / Verkauf */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowVerkauf(false)}
          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
            !showVerkauf ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40"
          }`}
        >
          <AlertTriangle className="inline w-3.5 h-3.5 mr-1.5" />
          Interne Analyse
        </button>
        <button
          onClick={() => setShowVerkauf(true)}
          className={`px-4 py-2 text-sm rounded-lg border transition-all ${
            showVerkauf ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/40"
          }`}
        >
          <CheckCircle className="inline w-3.5 h-3.5 mr-1.5" />
          Verkaufsansicht
        </button>
      </div>

      {/* Text */}
      <div className={`p-4 rounded-xl border-l-4 ${
        showVerkauf ? "border-l-blue-400 bg-blue-50/50" : "border-l-red-400 bg-red-50/50"
      }`}>
        <p className="text-sm leading-relaxed">
          {showVerkauf ? bereich.verkaufText : bereich.internText}
        </p>
      </div>

      {/* Belege */}
      {bereich.belege.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Belege</h4>
          <div className="space-y-1">
            {bereich.belege.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{b.split("/").pop()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offene Fragen */}
      {bereich.offeneFragen.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Offene Fragen ({bereich.offeneFragen.filter(f => f.status === "offen").length} offen)
          </h4>
          <div className="space-y-2">
            {bereich.offeneFragen.map(frage => (
              <FrageItem key={frage.id} frage={frage} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FrageItem({ frage }: { frage: OffeneFrage }) {
  const prioColor = frage.prioritaet === "kritisch" ? "bg-red-500"
    : frage.prioritaet === "wichtig" ? "bg-amber-500" : "bg-blue-400"
  const statusCfg = frage.status === "offen" ? { label: "Offen", cls: "text-blue-700 bg-blue-100" }
    : frage.status === "angefragt" ? { label: "Angefragt", cls: "text-amber-700 bg-amber-100" }
    : { label: "Beantwortet", cls: "text-green-700 bg-green-100" }
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${prioColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed">{frage.frage}</p>
        {frage.antwort && (
          <p className="text-xs text-muted-foreground mt-1 p-2 bg-secondary rounded">{frage.antwort}</p>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusCfg.cls}`}>
        {statusCfg.label}
      </span>
    </div>
  )
}

export default function AnalysePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const slug = params.slug as string
  const analyse = ALLE_ANALYSEN[slug]
  const [activeBereich, setActiveBereich] = useState<AnalyseBereichKey>("bautraeger")

  const alleOffeneFragen = useMemo(() => {
    if (!analyse) return []
    return ANALYSE_BEREICHE.flatMap(key =>
      analyse.bereiche[key].offeneFragen
    ).filter(f => f.status === "offen")
  }, [analyse])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary font-mono text-sm animate-pulse">Lade Analyse...</div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Kein Zugriff. Admin-Berechtigung erforderlich.</p>
          <button onClick={() => router.push("/")} className="mt-4 text-primary underline text-sm">
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  if (!analyse) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Analyse nicht gefunden: {slug}</p>
          <button onClick={() => router.push("/")} className="mt-4 text-primary underline text-sm">
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  const currentBereich = analyse.bereiche[activeBereich]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-xl">{analyse.projektName}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                  Backoffice
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aktualisiert: {analyse.aktualisiertAm}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Gesamt-Score */}
        <div className="flex items-center gap-5 p-5 rounded-xl bg-secondary/50 mb-6">
          <ScoreRing score={analyse.gesamtScore} />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Gesamt-Score</p>
            <p className="font-semibold text-base" style={{
              color: analyse.gesamtScore >= 7 ? "var(--positive)" : analyse.gesamtScore >= 5 ? "var(--chart-4)" : "var(--destructive)"
            }}>
              {analyse.gesamtVerdict}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {alleOffeneFragen.length} offene Fragen,{" "}
              {ANALYSE_BEREICHE.filter(k => analyse.bereiche[k].status === "kritisch").length} kritische Bereiche
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
            onClick={() => {
              const text = alleOffeneFragen.map((f, i) => `${i + 1}. [${f.prioritaet.toUpperCase()}] ${f.frage}`).join("\n")
              navigator.clipboard.writeText(text)
            }}
          >
            <Send className="w-3.5 h-3.5" />
            Fragenkatalog kopieren
          </button>
        </div>

        {/* Main Layout: Sidebar + Detail */}
        <div className="grid grid-cols-[280px_1fr] gap-6">
          {/* Sidebar: Bereiche */}
          <div className="space-y-2">
            {ANALYSE_BEREICHE.map(key => (
              <BereichCard
                key={key}
                bereichKey={key}
                bereich={analyse.bereiche[key]}
                isActive={activeBereich === key}
                onClick={() => setActiveBereich(key)}
              />
            ))}
          </div>

          {/* Detail Panel */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-lg">{BEREICH_LABELS[activeBereich]}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <StatusPill status={currentBereich.status} />
                  <span className="text-sm font-medium" style={{
                    color: currentBereich.score >= 7 ? "var(--positive)" : currentBereich.score >= 5 ? "var(--chart-4)" : "var(--destructive)"
                  }}>
                    {currentBereich.score.toFixed(1)} / 10
                  </span>
                </div>
              </div>
              <ScoreRing score={currentBereich.score} size={48} />
            </div>
            <BereichDetail bereich={currentBereich} />
          </div>
        </div>
      </div>
    </div>
  )
}
