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

const STORAGE_PREFIX = "immo-advisor-profile-"

// ─── Client-side cache (localStorage, user-scoped) ───────────────

export function getCachedProfile(sub: string): AdvisorProfile | null {
  if (typeof window === "undefined" || !sub) return null
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + sub)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }
  return null
}

export function setCachedProfile(profile: AdvisorProfile): void {
  if (typeof window === "undefined" || !profile.authentikSub) return
  try {
    localStorage.setItem(STORAGE_PREFIX + profile.authentikSub, JSON.stringify(profile))
  } catch {
    // ignore
  }
}

export function clearCachedProfile(sub: string): void {
  if (typeof window === "undefined" || !sub) return
  try {
    localStorage.removeItem(STORAGE_PREFIX + sub)
  } catch {
    // ignore
  }
}

// ─── API calls (to our Next.js API route → Payload CMS) ─────────

/**
 * Fetch advisor profile from server.
 * Returns the profile if found, null if no profile exists,
 * or undefined on network/server error (caller can fall back to cache).
 */
export async function fetchAdvisorProfile(): Promise<AdvisorProfile | null | undefined> {
  try {
    const res = await fetch("/api/advisor")
    if (res.ok) {
      const data = await res.json()
      if (data.profile) {
        setCachedProfile(data.profile)
        return data.profile
      }
      // Server explicitly said: no profile
      return null
    }
    // Non-OK response → treat as error
    return undefined
  } catch {
    // Network error → caller should fall back to cache
    return undefined
  }
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
