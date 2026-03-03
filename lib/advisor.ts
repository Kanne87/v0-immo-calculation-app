// ─── Berater-Profil: Types + Storage ─────────────────────

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
const STORAGE_ANY = "immo-advisor-profile-any"

// ─── Client-side cache (localStorage, user-scoped) ───────────

export function getCachedProfile(sub: string): AdvisorProfile | null {
  if (typeof window === "undefined") return null
  try {
    // Try user-specific key first
    if (sub) {
      const stored = localStorage.getItem(STORAGE_PREFIX + sub)
      if (stored) return JSON.parse(stored)
    }
    // Fallback: any cached profile (covers case where sub changed)
    const any = localStorage.getItem(STORAGE_ANY)
    if (any) return JSON.parse(any)
  } catch {
    // ignore
  }
  return null
}

export function setCachedProfile(profile: AdvisorProfile): void {
  if (typeof window === "undefined") return
  try {
    if (profile.authentikSub) {
      localStorage.setItem(STORAGE_PREFIX + profile.authentikSub, JSON.stringify(profile))
    }
    // Also store under generic key as fallback
    localStorage.setItem(STORAGE_ANY, JSON.stringify(profile))
  } catch {
    // ignore
  }
}

export function clearCachedProfile(sub: string): void {
  if (typeof window === "undefined") return
  try {
    if (sub) localStorage.removeItem(STORAGE_PREFIX + sub)
    localStorage.removeItem(STORAGE_ANY)
  } catch {
    // ignore
  }
}

// ─── API calls (to our Next.js API route → Payload CMS) ─────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch advisor profile from server with retry.
 * Returns the profile if found, null if no profile exists (definitive),
 * or undefined on persistent error (caller should fall back to cache).
 *
 * Retries up to 3 times on 401/network errors (session might not be ready).
 */
export async function fetchAdvisorProfile(): Promise<AdvisorProfile | null | undefined> {
  const maxRetries = 3
  const retryDelays = [500, 1500, 3000]

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch("/api/advisor")
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setCachedProfile(data.profile)
          return data.profile
        }
        // Server explicitly said: no profile (200 with profile: null)
        return null
      }
      if (res.status === 401 && attempt < maxRetries - 1) {
        // Session not ready yet – wait and retry
        console.log(`[advisor] 401 on attempt ${attempt + 1}, retrying in ${retryDelays[attempt]}ms...`)
        await delay(retryDelays[attempt])
        continue
      }
      // Other error status – treat as error
      return undefined
    } catch {
      if (attempt < maxRetries - 1) {
        console.log(`[advisor] Network error on attempt ${attempt + 1}, retrying...`)
        await delay(retryDelays[attempt])
        continue
      }
      return undefined
    }
  }
  return undefined
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
