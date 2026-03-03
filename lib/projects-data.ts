// ─── Multi-Projekt Datenstruktur ──────────────────────────────────
import type { WohneinheitData } from "./units-data"
import { HAUS1_EINHEITEN, PROJEKT_ECKDATEN, STELLPLATZ_PREIS } from "./units-data"

export interface ProjektDefinition {
  id: string
  name: string
  haus?: string
  adresse: string
  bautraeger: string
  energiestandard: string
  baubeginn: string
  fertigstellung: string
  mietgarantie: number
  stellplatzMiete: number
  verwaltungWEG: number
  verwaltungSE: number
  instandhaltung: number
  gestPct: number
  notarPct: number
  grundschuldPct: number
  grundstueckAnteil: number
  stellplatzPreis: number
  weGesamt: number
  einheiten: WohneinheitData[]
}

export const SPANDAUER_TOR_HAUS1: ProjektDefinition = {
  id: "spandauer-tor-h1",
  name: PROJEKT_ECKDATEN.name,
  haus: PROJEKT_ECKDATEN.haus,
  adresse: PROJEKT_ECKDATEN.adresse,
  bautraeger: PROJEKT_ECKDATEN.bautraeger,
  energiestandard: PROJEKT_ECKDATEN.energiestandard,
  baubeginn: PROJEKT_ECKDATEN.baubeginn,
  fertigstellung: PROJEKT_ECKDATEN.fertigstellung,
  mietgarantie: PROJEKT_ECKDATEN.mietgarantie,
  stellplatzMiete: PROJEKT_ECKDATEN.stellplatzMiete,
  verwaltungWEG: PROJEKT_ECKDATEN.verwaltungWEG,
  verwaltungSE: PROJEKT_ECKDATEN.verwaltungSE,
  instandhaltung: PROJEKT_ECKDATEN.instandhaltung,
  gestPct: PROJEKT_ECKDATEN.gestPct,
  notarPct: PROJEKT_ECKDATEN.notarPct,
  grundschuldPct: PROJEKT_ECKDATEN.grundschuldPct,
  grundstueckAnteil: PROJEKT_ECKDATEN.grundstueckAnteil,
  stellplatzPreis: STELLPLATZ_PREIS,
  weGesamt: PROJEKT_ECKDATEN.weGesamt,
  einheiten: HAUS1_EINHEITEN,
}

// Neue Projekte hier anhängen
export const ALLE_PROJEKTE: ProjektDefinition[] = [
  SPANDAUER_TOR_HAUS1,
]
