"use client"

import { Plus, Building2, MapPin, Users, BadgeCheck, Trash2 } from "lucide-react"
import type { ProjectTemplate } from "@/lib/rechner-types"

interface Props {
  projects: ProjectTemplate[]
  onSelect: (project: ProjectTemplate) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export function ProjectList({ projects, onSelect, onNew, onDelete }: Props) {
  return (
    <div className="w-full max-w-[480px] md:max-w-[800px] mx-auto min-h-screen bg-background">
      <header className="px-5 pt-8 pb-6 border-b border-border">
        <div className="text-[11px] text-primary font-mono tracking-[3px] uppercase mb-1">
          Kapitalanlage-Rechner Pro
        </div>
        <h1 className="text-2xl font-serif text-foreground font-semibold mt-1 mb-1 text-balance">
          Meine Projekte
        </h1>
        <p className="text-xs text-dimmed font-mono">
          Immobilien-Kapitalanlagen vergleichen und analysieren
        </p>
      </header>

      <main className="p-5">
        {/* New project button */}
        <button
          onClick={onNew}
          className="w-full mb-6 flex items-center justify-center gap-2 py-4 px-5 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all font-mono text-sm"
        >
          <Plus className="w-5 h-5" />
          Neues Projekt
        </button>

        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-card rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer"
            >
              <button
                onClick={() => onSelect(project)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-serif font-semibold text-foreground">
                        {project.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1 text-dimmed">
                    <MapPin className="w-3 h-3" />
                    {project.ort}
                  </div>
                  <div className="flex items-center gap-1 text-dimmed">
                    <Users className="w-3 h-3" />
                    {project.weAnzahl} WE
                  </div>
                  <div className="flex items-center gap-1 text-primary/80">
                    <BadgeCheck className="w-3 h-3" />
                    {project.status}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] font-mono text-subtle">
                  <span>
                    KP {(project.defaults.kaufpreis / 1000).toFixed(0)}k |{" "}
                    {project.defaults.wfl} m2
                  </span>
                  <span className="text-primary">
                    {project.defaults.mieteQm} EUR/m2
                  </span>
                </div>
              </button>

              {/* Delete button */}
              {project.id !== "spandauer-tor" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(project.id)
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-subtle hover:text-destructive transition-all"
                  aria-label={`Projekt ${project.name} loeschen`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-subtle mx-auto mb-4" />
            <p className="text-dimmed font-serif text-sm">
              Noch keine Projekte vorhanden
            </p>
            <p className="text-subtle text-xs font-mono mt-1">
              Erstellen Sie Ihr erstes Projekt
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
