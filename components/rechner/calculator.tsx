"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Building2, CreditCard, BarChart3, TrendingUp, Trophy, Eye, Pencil, Share2, FileDown, ArrowLeft } from "lucide-react"
import type { ProjectData, CalcResult } from "@/lib/rechner-types"
import { defaultProjectData } from "@/lib/rechner-types"
import { calculate, encodeProjectToParams } from "@/lib/rechner-calc"
import { StepObjekt } from "./step-objekt"
import { StepFinanzierung } from "./step-finanzierung"
import { StepErgebnis } from "./step-ergebnis"
import { StepVerlauf } from "./step-verlauf"
import { StepRendite } from "./step-rendite"
import { ThemeToggle } from "./theme-toggle"

const steps = [
  { label: "Objekt", icon: Building2 },
  { label: "Finanzierung", icon: CreditCard },
  { label: "Ergebnis", icon: BarChart3 },
  { label: "10-Jahres", icon: TrendingUp },
  { label: "Rendite", icon: Trophy },
]

interface CalculatorProps {
  initialData?: ProjectData
  isSharedView?: boolean
  onBack?: () => void
  onExportPdf?: (data: ProjectData, calc: CalcResult) => void
  onDataChange?: (data: ProjectData) => void
}

export function Calculator({
  initialData,
  isSharedView = false,
  onBack,
  onExportPdf,
  onDataChange,
}: CalculatorProps) {
  const [step, setStep] = useState(isSharedView ? 2 : 0)
  const [isClientView, setIsClientView] = useState(isSharedView)
  const [data, setData] = useState<ProjectData>(
    initialData || { ...defaultProjectData }
  )
  const [shareToast, setShareToast] = useState(false)

  const onChange = useCallback(
    <K extends keyof ProjectData>(key: K, val: ProjectData[K]) => {
      setData((prev) => ({ ...prev, [key]: val }))
    },
    []
  )

  const calc = useMemo(() => calculate(data), [data])

  // Propagate data changes to parent
  useEffect(() => {
    onDataChange?.(data)
  }, [data, onDataChange])

  // When toggling to client view, jump to step 2 if on input steps
  useEffect(() => {
    if (isClientView && step < 2) {
      setStep(2)
    }
  }, [isClientView, step])

  const handleShare = useCallback(() => {
    const params = encodeProjectToParams(data)
    const url = `${window.location.origin}/?shared=1&${params}`
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    })
  }, [data])

  const visibleSteps = isClientView ? steps.slice(2) : steps

  return (
    <div className="w-full max-w-[480px] md:max-w-[1200px] mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="px-5 pt-5 pb-3 border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-md hover:bg-secondary transition-colors text-dimmed hover:text-foreground"
                aria-label="Zurueck zur Projektliste"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="text-[11px] text-primary font-mono tracking-[3px] uppercase mb-0.5">
                Kapitalanlage-Rechner
              </div>
              <div className="text-[9px] text-subtle font-mono">
                {data.projektName} &middot; Immobilien &middot; KfW &middot; Sonder-AfA
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Berater/Kunden Toggle */}
            {!isSharedView && (
              <button
                onClick={() => setIsClientView(!isClientView)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono transition-all border ${
                  isClientView
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-secondary text-dimmed border-border hover:text-foreground"
                }`}
                aria-label={isClientView ? "Zur Berateransicht wechseln" : "Zur Kundenansicht wechseln"}
              >
                {isClientView ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <Pencil className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isClientView ? "Kunde" : "Berater"}
                </span>
              </button>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all relative"
              aria-label="Link teilen"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teilen</span>
              {shareToast && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-[9px] whitespace-nowrap">
                  Link kopiert!
                </span>
              )}
            </button>

            {/* PDF Export */}
            {onExportPdf && (
              <button
                onClick={() => onExportPdf(data, calc)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-mono bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all"
                aria-label="Als PDF exportieren"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Step navigation */}
        <div className="flex gap-0.5 mt-2">
          {visibleSteps.map((s, i) => {
            const actualIdx = isClientView ? i + 2 : i
            const Icon = s.icon
            return (
              <button
                key={actualIdx}
                onClick={() => setStep(actualIdx)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1 rounded transition-all text-[10px] font-mono tracking-wide ${
                  step === actualIdx
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-secondary text-subtle hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Content */}
      <main className="p-5 pb-10">
        {step === 0 && (
          <StepObjekt
            data={data}
            calc={calc}
            onChange={onChange}
            readOnly={isClientView}
          />
        )}
        {step === 1 && (
          <StepFinanzierung
            data={data}
            calc={calc}
            onChange={onChange}
            readOnly={isClientView}
          />
        )}
        {step === 2 && (
          <StepErgebnis calc={calc} gebaeudeWert={calc.gebaeudeWert} />
        )}
        {step === 3 && (
          <StepVerlauf
            calc={calc}
            gesamtKP={calc.gesamtKP}
            inflation={data.inflation}
          />
        )}
        {step === 4 && (
          <StepRendite
            calc={calc}
            eigenkapital={data.eigenkapital}
            darlehen1={data.darlehen1}
            darlehen2={data.darlehen2}
          />
        )}
      </main>
    </div>
  )
}
