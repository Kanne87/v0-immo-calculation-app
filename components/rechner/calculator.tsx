"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { Building2, CreditCard, BarChart3, TrendingUp, Trophy, Eye, Pencil, Share2, FileDown, ArrowLeft, Save, CircleDot, Presentation } from "lucide-react"
import type { ProjectData, CalcResult } from "@/lib/rechner-types"
import { defaultProjectData } from "@/lib/rechner-types"
import { calculate, encodeProjectToParams } from "@/lib/rechner-calc"
import { getBeratungSlugForProjekt } from "@/lib/project-registry"
import { StepObjekt } from "./step-objekt"
import { StepFinanzierung } from "./step-finanzierung"
import { StepErgebnis } from "./step-ergebnis"
import { StepVerlauf } from "./step-verlauf"
import { StepRendite } from "./step-rendite"
import { SaveDialog, UnsavedWarning } from "./save-dialog"

const steps = [
  { label: "Objekt", shortLabel: "Obj.", icon: Building2 },
  { label: "Finanzierung", shortLabel: "Finanz.", icon: CreditCard },
  { label: "Ergebnis", shortLabel: "Ergebn.", icon: BarChart3 },
  { label: "10-Jahres", shortLabel: "10 J.", icon: TrendingUp },
  { label: "Rendite", shortLabel: "Rendite", icon: Trophy },
]

const FINANCE_KEYS: (keyof ProjectData)[] = [
  "eigenkapital",
  "darlehen1Label", "darlehen1", "zins1", "tilgung1", "zinsbindung1", "tilgungsfrei1",
  "darlehen2Label", "darlehen2", "zins2", "tilgung2", "zinsbindung2",
  "married", "einkommen", "kirche", "inflation",
]

function hasFinanceChanges(current: ProjectData, original: ProjectData): boolean {
  return FINANCE_KEYS.some((key) => current[key] !== original[key])
}

interface CalculatorProps {
  initialData?: ProjectData
  isSharedView?: boolean
  isTemplate?: boolean
  sourceUnitId?: string
  editingCalcId?: string | null
  onBack?: () => void
  onExportPdf?: (data: ProjectData, calc: CalcResult) => void
  onDataChange?: (data: ProjectData) => void
  onSave?: (description: string) => void
  onSaveExisting?: () => void
}

export function Calculator({
  initialData, isSharedView = false, isTemplate = false,
  sourceUnitId, editingCalcId, onBack, onExportPdf, onDataChange, onSave, onSaveExisting,
}: CalculatorProps) {
  const [step, setStep] = useState(isSharedView ? 2 : 0)
  const [isClientView, setIsClientView] = useState(isSharedView)
  const [data, setData] = useState<ProjectData>(initialData || { ...defaultProjectData })
  const [shareToast, setShareToast] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [isSaved, setIsSaved] = useState(!isTemplate)

  const originalData = useRef<ProjectData>(initialData || { ...defaultProjectData })
  const hasChanges = useMemo(() => hasFinanceChanges(data, originalData.current), [data])

  const onChange = useCallback(<K extends keyof ProjectData>(key: K, val: ProjectData[K]) => {
    setData((prev) => ({ ...prev, [key]: val }))
    setIsSaved(false)
  }, [])

  const calc = useMemo(() => calculate(data), [data])

  useEffect(() => {
    const autoEK = Math.max(0, Math.round(calc.gesamtInvest - data.darlehen1 - data.darlehen2))
    if (data.eigenkapital !== autoEK) setData((prev) => ({ ...prev, eigenkapital: autoEK }))
  }, [calc.gesamtInvest, data.darlehen1, data.darlehen2]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { onDataChange?.(data) }, [data, onDataChange])
  useEffect(() => { if (isClientView && step < 2) setStep(2) }, [isClientView, step])

  const handleShare = useCallback(() => {
    const params = encodeProjectToParams(data)
    const url = `${window.location.origin}/?shared=1&${params}`
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    })
  }, [data])

  const handleBack = useCallback(() => {
    if (hasChanges && !isSaved) setShowUnsavedWarning(true)
    else onBack?.()
  }, [hasChanges, isSaved, onBack])

  const handleSaveFromDialog = useCallback((description: string) => {
    onSave?.(description)
    setShowSaveDialog(false)
    setIsSaved(true)
  }, [onSave])

  const handleSaveExisting = useCallback(() => {
    onSaveExisting?.()
    setIsSaved(true)
  }, [onSaveExisting])

  const visibleSteps = isClientView ? steps.slice(2) : steps

  return (
    <div className="w-full max-w-[480px] md:max-w-[1200px] mx-auto min-h-screen bg-background">
      <header className="px-3 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        {/* Row 1: Title + Action Buttons */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {onBack && (
              <button onClick={handleBack} className="p-1.5 rounded-md hover:bg-secondary transition-colors text-dimmed hover:text-foreground flex-shrink-0" aria-label="Zurück">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="text-[10px] sm:text-[11px] text-primary font-mono tracking-[2px] sm:tracking-[3px] uppercase">
                  <span className="sm:hidden">KA-Rechner</span>
                  <span className="hidden sm:inline">Kapitalanlage-Rechner</span>
                </div>
                {isTemplate && (
                  <span className="text-[9px] font-mono bg-primary/15 text-primary px-1.5 py-0.5 rounded border border-primary/20 flex-shrink-0">Vorlage</span>
                )}
                {hasChanges && !isSaved && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 flex-shrink-0">
                    <CircleDot className="w-3 h-3" />Ungespeichert
                  </span>
                )}
              </div>
              <div className="text-[9px] text-subtle font-mono truncate mt-0.5">
                {data.projektName} · Immobilien · KfW · Sonder-AfA
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {(isTemplate || editingCalcId) && hasChanges && (
              <button
                onClick={() => { if (editingCalcId) handleSaveExisting(); else setShowSaveDialog(true) }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all min-h-[36px]"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{editingCalcId ? "Speichern" : "Speichern als..."}</span>
              </button>
            )}
            {!isSharedView && (
              <button onClick={() => setIsClientView(!isClientView)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono transition-all border min-h-[36px] ${
                  isClientView ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-dimmed border-border hover:text-foreground"
                }`}
              >
                {isClientView ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isClientView ? "Kunde" : "Berater"}</span>
              </button>
            )}
            <button onClick={handleShare} className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all relative min-h-[36px]">
              <Share2 className="w-3.5 h-3.5" /><span className="hidden sm:inline">Teilen</span>
              {shareToast && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-[9px] whitespace-nowrap z-20">Link kopiert!</span>}
            </button>
            {(() => {
              const slug = sourceUnitId && sourceUnitId !== "FREI" ? getBeratungSlugForProjekt("spandauer-tor-haus1") : null;
              return slug ? (
                <Link
                  href={`/beratung/${slug}/6?we=${sourceUnitId}`}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all min-h-[36px]"
                  title="Beratung mit dieser WE starten"
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Beratung</span>
                </Link>
              ) : null;
            })()}
            {onExportPdf && (
              <button onClick={() => onExportPdf(data, calc)} className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all min-h-[36px]">
                <FileDown className="w-3.5 h-3.5" /><span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Tab Navigation */}
        <div className="flex gap-1 mt-2">
          {visibleSteps.map((s, i) => {
            const actualIdx = isClientView ? i + 2 : i
            const Icon = s.icon
            return (
              <button key={actualIdx} onClick={() => setStep(actualIdx)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-2 sm:py-1.5 px-1 rounded transition-all font-mono tracking-wide min-h-[44px] ${
                  step === actualIdx ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-subtle hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                <span className="text-[8px] sm:text-[10px] leading-tight">{s.shortLabel}</span>
              </button>
            )
          })}
        </div>
      </header>

      <main className="p-3 sm:p-5 pb-10">
        {step === 0 && <StepObjekt data={data} calc={calc} onChange={onChange} readOnly={isClientView || isTemplate} isTemplate={isTemplate} />}
        {step === 1 && <StepFinanzierung data={data} calc={calc} onChange={onChange} readOnly={isClientView} />}
        {step === 2 && <StepErgebnis calc={calc} gebaeudeWert={calc.gebaeudeWert} data={data} />}
        {step === 3 && <StepVerlauf calc={calc} gesamtKP={calc.gesamtKP} inflation={data.inflation} darlehen1Label={data.darlehen1Label} darlehen2Label={data.darlehen2Label} />}
        {step === 4 && <StepRendite calc={calc} eigenkapital={data.eigenkapital} darlehen1={data.darlehen1} darlehen2={data.darlehen2} />}
      </main>

      {showSaveDialog && sourceUnitId && (
        <SaveDialog sourceUnitId={sourceUnitId} onSave={handleSaveFromDialog} onCancel={() => setShowSaveDialog(false)} />
      )}
      {showUnsavedWarning && (
        <UnsavedWarning
          onSave={() => { setShowUnsavedWarning(false); if (editingCalcId) { handleSaveExisting(); onBack?.() } else setShowSaveDialog(true) }}
          onDiscard={() => { setShowUnsavedWarning(false); onBack?.() }}
          onCancel={() => setShowUnsavedWarning(false)}
        />
      )}
    </div>
  )
}
