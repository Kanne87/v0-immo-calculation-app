"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { ProjectTemplate, ProjectData, CalcResult } from "@/lib/rechner-types"
import {
  defaultProjectData,
  defaultTemplates,
} from "@/lib/rechner-types"
import { decodeParamsToProject } from "@/lib/rechner-calc"
import { ProjectList } from "@/components/rechner/project-list"
import { Calculator } from "@/components/rechner/calculator"
import { generatePdf } from "@/lib/pdf-export"

function AppContent() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"list" | "calc">("list")
  const [projects, setProjects] = useState<ProjectTemplate[]>(defaultTemplates)
  const [activeData, setActiveData] = useState<ProjectData | null>(null)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isSharedView, setIsSharedView] = useState(false)

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

  // Handle shared URL
  useEffect(() => {
    const shared = searchParams.get("shared")
    if (shared === "1") {
      const decoded = decodeParamsToProject(searchParams)
      const data = { ...defaultProjectData, ...decoded }
      setActiveData(data)
      setIsSharedView(true)
      setView("calc")
    }
  }, [searchParams])

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
    // If we have active data, save it back to the project
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
    // Clean URL if shared
    if (searchParams.get("shared")) {
      window.history.replaceState({}, "", "/")
    }
  }, [activeData, activeProjectId, searchParams])

  const handleExportPdf = useCallback(
    (pdfData: ProjectData, pdfCalc: CalcResult) => {
      generatePdf(pdfData, pdfCalc)
    },
    []
  )

  const handleDataChange = useCallback((newData: ProjectData) => {
    setActiveData(newData)
  }, [])

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
