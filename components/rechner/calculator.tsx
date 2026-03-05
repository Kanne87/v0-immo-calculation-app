"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { Building2, CreditCard, BarChart3, TrendingUp, Trophy, Eye, Pencil, Share2, FileDown, ArrowLeft, Save, CircleDot } from "lucide-react"
import type { ProjectData, CalcResult } from "@/lib/rechner-types"
import { defaultProjectData } from "@/lib/rechner-types"
import { calculate, encodeProjectToParams } from "@/lib/rechner-calc"
import { StepObjekt } from "./step-objekt"
import { StepFinanzierung } from "./step-finanzierung"
import { StepErgebnis } from "./step-ergebnis"
import { StepVerlauf } from "./step-verlauf"
import { StepRendite } from "./step-rendite"
import { SaveDialog, UnsavedWarning } from "./save-dialog"

const steps = [
  { label: "Objekt", icon: Building2 },
  { label: "Finanzierung", icon: CreditCard },
  { label: "Ergebnis", icon: BarChart3 },
  { label: "10-Jahres", icon: TrendingUp },
  { label: "Rendite", icon: Trophy },
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
      <header className="px-5 pt-5 pb-3 border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={handleBack} className="p-1.5 rounded-md hover:bg-secondary transition-colors text-dimmed hover:text-foreground" aria-label="Zurück">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[11px] text-primary font-mono tracking-[3px] uppercase mb-0.5">Kapitalanlage-Rechner</div>
                {isTemplate && (
                  <span className="text-[9px] font-mono bg-primary/15 text-primary px-1.5 py-0.5 rounded border border-primary/20">Vorlage</span>
                )}
                {hasChanges && !isSaved && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400">
                    <CircleDot className="w-3 h-3" />Ungespeichert
                  </span>
                )}
              </div>
              <div className="text-[9px] text-subtle font-mono">
                {data.projektName} · Immobilien · KfW · Sonder-AfA
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {(isTemplate || editingCalcId) && hasChanges && (
              <button
                onClick={() => { if (editingCalcId) handleSaveExisting(); else setShowSaveDialog(true) }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{editingCalcId ? "Speichern" : "Speichern als..."}</span>
              </button>
            )}
            {!isSharedView && (
              <button onClick={() => setIsClientView(!isClientView)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono transition-all border ${
                  isClientView ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-dimmed border-border hover:text-foreground"
                }`}
              >
                {isClientView ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isClientView ? "Kunde" : "Berater"}</span>
              </button>
            )}
            <button onClick={handleShare} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all relative">
              <Share2 className="w-3.5 h-3.5" /><span className="hidden sm:inline">Teilen</span>
              {shareToast && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-[9px] whitespace-nowrap">Link kopiert!</span>}
            </button>
            {onExportPdf && (
              <button onClick={() => onExportPdf(data, calc)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all">
                <FileDown className="w-3.5 h-3.5" /><span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-0.5 mt-2">
          {visibleSteps.map((s, i) => {
            const actualIdx = isClientView ? i + 2 : i
            const Icon = s.icon
            return (
              <button key={actualIdx} onClick={() => setStep(actualIdx)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded transition-all text-[10px] font-mono tracking-wide ${
                  step === actualIdx ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-subtle hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" /><span className="hidden sm:inline">{s.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      <main className="p-5 pb-10">
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
