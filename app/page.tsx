"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import type { ProjectTemplate, ProjectData, CalcResult } from "@/lib/rechner-types"
import {
  defaultProjectData,
  defaultTemplates,
} from "@/lib/rechner-types"
import { decodeParamsToProject } from "@/lib/rechner-calc"
import { ProjectList } from "@/components/rechner/project-list"
import { Calculator } from "@/components/rechner/calculator"
import { Onboarding } from "@/components/rechner/onboarding"
import { generatePdf } from "@/lib/pdf-export"
import type { AdvisorProfile } from "@/lib/advisor"
import {
  fetchAdvisorProfile,
  saveAdvisorProfile,
  getCachedProfile,
} from "@/lib/advisor"

function AppContent() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [view, setView] = useState<"loading" | "onboarding" | "list" | "calc">("loading")
  const [projects, setProjects] = useState<ProjectTemplate[]>(defaultTemplates)
  const [activeData, setActiveData] = useState<ProjectData | null>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isSharedView, setIsSharedView] = useState(false)
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile | null>(null)

  // Load advisor profile on mount
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return

    const sub = session.user.id

    async function loadProfile() {
      // Quick check: user-scoped localStorage cache
      const cached = getCachedProfile(sub)
      if (cached) {
        setAdvisorProfile(cached)
        setView("list")
      }

      // Then verify with server (authoritative)
      const serverResult = await fetchAdvisorProfile()

      if (serverResult) {
        // Server found a profile
        setAdvisorProfile(serverResult)
        setView("list")
      } else if (serverResult === null) {
        // Server explicitly said: no profile exists → onboarding
        setAdvisorProfile(null)
        setView("onboarding")
      } else {
        // undefined = network error → trust cache if available
        if (!cached) {
          setView("onboarding")
        }
      }
    }

    loadProfile()
  }, [status, session?.user?.id])

  // Handle shared URL
  useEffect(() => {
    if (view !== "list" && view !== "calc") return
    const shared = searchParams.get("shared")
    if (shared === "1") {
      const decoded = decodeParamsToProject(searchParams)
      const data = { ...defaultProjectData, ...decoded }
      setActiveData(data)
      setIsSharedView(true)
      setView("calc")
    }
  }, [searchParams, view])

  // Load projects from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kapitalanlage-projects")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "kapitalanlage-projects",
        JSON.stringify(projects)
      )
    } catch {
      // ignore
    }
  }, [projects])

  const handleOnboardingComplete = useCallback(
    async (profileData: Omit<AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">) => {
      const saved = await saveAdvisorProfile(profileData)
      if (saved) {
        setAdvisorProfile(saved)
      } else {
        // Fallback: create local profile
        const localProfile: AdvisorProfile = {
          ...profileData,
          authentikSub: session?.user?.id || "local",
        }
        setAdvisorProfile(localProfile)
      }
      setView("list")
    },
    [session]
  )

  const handleSelectProject = useCallback((project: ProjectTemplate) => {
    setActiveData({ ...project.defaults })
    setActiveProjectId(project.id)
    setIsSharedView(false)
    setView("calc")
  }, [])

  const handleNewProject = useCallback(() => {
    const id = `project-${Date.now()}`
    const newProject: ProjectTemplate = {
      id,
      name: "Neues Projekt",
      ort: "Standort",
      weAnzahl: 0,
      status: "In Planung",
      defaults: { ...defaultProjectData, projektName: "Neues Projekt" },
    }
    setProjects((prev) => [...prev, newProject])
    setActiveData({ ...newProject.defaults })
    setActiveProjectId(id)
    setIsSharedView(false)
    setView("calc")
  }, [])

  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const handleBack = useCallback(() => {
    if (activeData && activeProjectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, name: activeData.projektName, defaults: activeData }
            : p
        )
      )
    }
    setView("list")
    setActiveData(null)
    setActiveProjectId(null)
    setIsSharedView(false)
    if (searchParams.get("shared")) {
      window.history.replaceState({}, "", "/")
    }
  }, [activeData, activeProjectId, searchParams])

  const handleExportPdf = useCallback(
    (pdfData: ProjectData, pdfCalc: CalcResult) => {
      generatePdf(pdfData, pdfCalc, advisorProfile || undefined)
    },
    [advisorProfile]
  )

  const handleDataChange = useCallback((newData: ProjectData) => {
    setActiveData(newData)
  }, [])

  // Loading state
  if (status === "loading" || view === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary font-mono text-sm animate-pulse">
          Lade Kapitalanlage-Rechner...
        </div>
      </div>
    )
  }

  // Onboarding
  if (view === "onboarding") {
    return (
      <Onboarding
        email={session?.user?.email || undefined}
        name={session?.user?.name || undefined}
        onComplete={handleOnboardingComplete}
      />
    )
  }

  // Calculator
  if (view === "calc" && activeData) {
    return (
      <Calculator
        initialData={activeData}
        isSharedView={isSharedView}
        onBack={isSharedView ? undefined : handleBack}
        onExportPdf={handleExportPdf}
        onDataChange={handleDataChange}
      />
    )
  }

  // Project list
  return (
    <ProjectList
      projects={projects}
      onSelect={handleSelectProject}
      onNew={handleNewProject}
      onDelete={handleDeleteProject}
    />
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-primary font-mono text-sm animate-pulse">
            Lade Kapitalanlage-Rechner...
          </div>
        </div>
      }
    >
      <AppContent />
    </Suspense>
  )
}
