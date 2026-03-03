"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import type { ProjectData, CalcResult, SavedCalculation } from "@/lib/rechner-types"
import { defaultProjectData } from "@/lib/rechner-types"
import { decodeParamsToProject, calculate } from "@/lib/rechner-calc"
import { weToProjectData } from "@/lib/units-data"
import type { WohneinheitData } from "@/lib/units-data"
import { ALLE_PROJEKTE } from "@/lib/projects-data"
import {
  getSavedCalculations, saveCalculation, updateCalculation, deleteCalculation,
} from "@/lib/calculations-store"
import { ProjectList } from "@/components/rechner/project-list"
import { Calculator } from "@/components/rechner/calculator"
import { Onboarding } from "@/components/rechner/onboarding"
import { generatePdf } from "@/lib/pdf-export"
import type { AdvisorProfile } from "@/lib/advisor"
import { fetchAdvisorProfile, saveAdvisorProfile, getCachedProfile } from "@/lib/advisor"

function AppContent() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [view, setView] = useState<"loading" | "onboarding" | "list" | "calc">("loading")
  const [activeData, setActiveData] = useState<ProjectData | null>(null)
  const [isSharedView, setIsSharedView] = useState(false)
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile | null>(null)
  const [isTemplate, setIsTemplate] = useState(false)
  const [sourceUnitId, setSourceUnitId] = useState<string | null>(null)
  const [editingCalcId, setEditingCalcId] = useState<string | null>(null)
  const [savedCalcs, setSavedCalcs] = useState<SavedCalculation[]>([])

  useEffect(() => { setSavedCalcs(getSavedCalculations()) }, [])

  useEffect(() => {
    if (status !== "authenticated") return
    const sub = session?.user?.id || session?.user?.email || "unknown"
    async function loadProfile() {
      const cached = getCachedProfile(sub)
      if (cached) { setAdvisorProfile(cached); setView("list") }
      const serverResult = await fetchAdvisorProfile()
      if (serverResult) { setAdvisorProfile(serverResult); setView("list") }
      else if (serverResult === null) { setAdvisorProfile(null); setView("onboarding") }
      else { if (!cached) setView("onboarding") }
    }
    loadProfile()
  }, [status, session?.user?.id, session?.user?.email])

  useEffect(() => {
    if (view !== "list" && view !== "calc") return
    const shared = searchParams.get("shared")
    if (shared === "1") {
      const decoded = decodeParamsToProject(searchParams)
      const data = { ...defaultProjectData, ...decoded }
      setActiveData(data); setIsSharedView(true); setIsTemplate(false); setEditingCalcId(null); setView("calc")
    }
  }, [searchParams, view])

  const handleOnboardingComplete = useCallback(
    async (profileData: Omit<AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">) => {
      const saved = await saveAdvisorProfile(profileData)
      if (saved) setAdvisorProfile(saved)
      else {
        const localProfile: AdvisorProfile = { ...profileData, authentikSub: session?.user?.id || "local" }
        setAdvisorProfile(localProfile)
      }
      setView("list")
    }, [session])

  const handleSelectUnit = useCallback((unit: WohneinheitData, _projektId: string) => {
    const projectData = weToProjectData(unit)
    setActiveData(projectData); setIsTemplate(true); setSourceUnitId(unit.id)
    setEditingCalcId(null); setIsSharedView(false); setView("calc")
  }, [])

  const handleSelectCalc = useCallback((calc: SavedCalculation) => {
    setActiveData({ ...calc.projectData }); setIsTemplate(false)
    setSourceUnitId(calc.sourceUnitId); setEditingCalcId(calc.id)
    setIsSharedView(false); setView("calc")
  }, [])

  const handleDeleteCalc = useCallback((id: string) => {
    deleteCalculation(id); setSavedCalcs(getSavedCalculations())
  }, [])

  const handleBack = useCallback(() => {
    setView("list"); setActiveData(null); setIsTemplate(false)
    setSourceUnitId(null); setEditingCalcId(null); setIsSharedView(false)
    setSavedCalcs(getSavedCalculations())
    if (searchParams.get("shared")) window.history.replaceState({}, "", "/")
  }, [searchParams])

  const handleSaveNew = useCallback((description: string) => {
    if (!activeData || !sourceUnitId) return
    const sub = session?.user?.id || session?.user?.email || "unknown"
    saveCalculation({ description, sourceUnitId, projectData: activeData, authentikSub: sub })
    setSavedCalcs(getSavedCalculations())
  }, [activeData, sourceUnitId, session])

  const handleSaveExisting = useCallback(() => {
    if (!editingCalcId || !activeData) return
    updateCalculation(editingCalcId, { projectData: activeData })
    setSavedCalcs(getSavedCalculations())
  }, [editingCalcId, activeData])

  const handleExportPdf = useCallback((pdfData: ProjectData, pdfCalc: CalcResult) => {
    generatePdf(pdfData, pdfCalc, advisorProfile || undefined)
  }, [advisorProfile])

  const handleDataChange = useCallback((newData: ProjectData) => { setActiveData(newData) }, [])

  if (status === "loading" || view === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary font-mono text-sm animate-pulse">Lade Kapitalanlage-Rechner...</div>
      </div>
    )
  }

  if (view === "onboarding") {
    return <Onboarding email={session?.user?.email || undefined} name={session?.user?.name || undefined} onComplete={handleOnboardingComplete} />
  }

  if (view === "calc" && activeData) {
    return (
      <Calculator
        initialData={activeData} isSharedView={isSharedView} isTemplate={isTemplate}
        sourceUnitId={sourceUnitId || undefined} editingCalcId={editingCalcId}
        onBack={isSharedView ? undefined : handleBack} onExportPdf={handleExportPdf}
        onDataChange={handleDataChange} onSave={handleSaveNew} onSaveExisting={handleSaveExisting}
      />
    )
  }

  return (
    <ProjectList
      projekte={ALLE_PROJEKTE} savedCalcs={savedCalcs}
      onSelectUnit={handleSelectUnit} onSelectCalc={handleSelectCalc} onDeleteCalc={handleDeleteCalc}
    />
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary font-mono text-sm animate-pulse">Lade Kapitalanlage-Rechner...</div>
      </div>
    }>
      <AppContent />
    </Suspense>
  )
}
