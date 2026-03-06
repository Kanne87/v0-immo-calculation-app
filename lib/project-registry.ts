// ─── Projekt-Registry: Mapping Rechner ↔ Beratungsstrecke ──────
// Zentrales Mapping zwischen ProjektDefinition-IDs (Rechner) und
// BeratungProjectData-Slugs (Beratungsstrecke).
// Bei neuen Projekten: hier eine Zeile ergaenzen.

interface ProjectLink {
  rechnerProjektId: string
  beratungSlug: string
}

const LINKS: ProjectLink[] = [
  { rechnerProjektId: "spandauer-tor-h1", beratungSlug: "spandauer-tor" },
]

export function getBeratungSlugForProjekt(projektId: string): string | null {
  return LINKS.find((l) => l.rechnerProjektId === projektId)?.beratungSlug ?? null
}

export function getRechnerProjektForBeratung(slug: string): string | null {
  return LINKS.find((l) => l.beratungSlug === slug)?.rechnerProjektId ?? null
}
