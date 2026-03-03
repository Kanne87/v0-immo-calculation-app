// ─── Calculations Store (localStorage, Payload-ready) ────────────
import type { SavedCalculation, ProjectData } from "./rechner-types"

const STORAGE_KEY = "immo-saved-calculations"

function readAll(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(calcs: SavedCalculation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calcs))
  } catch {
    // quota exceeded etc.
  }
}

export function getSavedCalculations(): SavedCalculation[] {
  return readAll()
}

export function getSavedCalculation(id: string): SavedCalculation | undefined {
  return readAll().find((c) => c.id === id)
}

export function saveCalculation(params: {
  description: string
  sourceUnitId: string
  projectData: ProjectData
  authentikSub: string
  householdId?: string
  eventId?: string
}): SavedCalculation {
  const now = new Date().toISOString()
  const calc: SavedCalculation = {
    id: `calc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    authentikSub: params.authentikSub,
    description: params.description,
    sourceUnitId: params.sourceUnitId,
    projectData: { ...params.projectData },
    createdAt: now,
    updatedAt: now,
    householdId: params.householdId,
    eventId: params.eventId,
  }
  const all = readAll()
  all.unshift(calc)
  writeAll(all)
  return calc
}

export function updateCalculation(
  id: string,
  updates: Partial<Pick<SavedCalculation, "description" | "projectData" | "householdId" | "eventId">>
): SavedCalculation | null {
  const all = readAll()
  const idx = all.findIndex((c) => c.id === id)
  if (idx === -1) return null
  const updated = {
    ...all[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  if (updates.projectData) {
    updated.projectData = { ...updates.projectData }
  }
  all[idx] = updated
  writeAll(all)
  return updated
}

export function deleteCalculation(id: string): boolean {
  const all = readAll()
  const filtered = all.filter((c) => c.id !== id)
  if (filtered.length === all.length) return false
  writeAll(filtered)
  return true
}
