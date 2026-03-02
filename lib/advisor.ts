// ─── Berater-Profil: Types + Storage ─────────────────────────────

export interface AdvisorProfile {
  authentikSub: string
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  zip: string
  city: string
  createdAt?: string
  updatedAt?: string
}

const STORAGE_KEY = "immo-advisor-profile"

// ─── Client-side cache (localStorage) ────────────────────────────

export function getCachedProfile(): AdvisorProfile | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }
  return null
}

export function setCachedProfile(profile: AdvisorProfile): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore
  }
}

export function clearCachedProfile(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// ─── API calls (to our Next.js API route → Payload CMS) ─────────

export async function fetchAdvisorProfile(): Promise<AdvisorProfile | null> {
  try {
    const res = await fetch("/api/advisor")
    if (res.ok) {
      const data = await res.json()
      if (data.profile) {
        setCachedProfile(data.profile)
        return data.profile
      }
    }
  } catch {
    // Fallback to cache
  }
  return getCachedProfile()
}

export async function saveAdvisorProfile(
  profile: Omit<AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">
): Promise<AdvisorProfile | null> {
  try {
    const res = await fetch("/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.profile) {
        setCachedProfile(data.profile)
        return data.profile
      }
    }
  } catch {
    // ignore
  }
  return null
}
