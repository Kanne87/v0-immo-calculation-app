// ─── Projekt-Registry: Mapping Rechner ↔ Beratungsstrecke ↔ Analyse ──────
// Zentrales Mapping zwischen ProjektDefinition-IDs (Rechner),
// BeratungProjectData-Slugs (Beratungsstrecke) und Analyse-Slugs (Backoffice).
// Bei neuen Projekten: hier eine Zeile ergaenzen.

interface ProjectLink {
  rechnerProjektId: string
  beratungSlug: string
  analyseSlug: string
}

const LINKS: ProjectLink[] = [
  { rechnerProjektId: "spandauer-tor-h1", beratungSlug: "spandauer-tor", analyseSlug: "spandauer-tor-h1" },
]

export function getBeratungSlugForProjekt(projektId: string): string | null {
  return LINKS.find((l) => l.rechnerProjektId === projektId)?.beratungSlug ?? null
}

export function getRechnerProjektForBeratung(slug: string): string | null {
  return LINKS.find((l) => l.beratungSlug === slug)?.rechnerProjektId ?? null
}

export function getAnalyseSlugForProjekt(projektId: string): string | null {
  return LINKS.find((l) => l.rechnerProjektId === projektId)?.analyseSlug ?? null
}
