// \u2500\u2500\u2500 Haus 1 Spandauer Tor \u2013 Einheitendatenbank \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export interface WohneinheitData {
  id: string
  nr: number
  etage: string
  zimmer: number
  wfl: number
  gesamtKaufpreis: number
  stellplatz: number
  kaufpreis: number
  qmPreis: number
  rendite: number
  status: "frei" | "reserviert" | "verkauft"
}

export const STELLPLATZ_PREIS = 29000

export const HAUS1_EINHEITEN: WohneinheitData[] = [
  { id: "WE-001", nr: 1,  etage: "EG",    zimmer: 2, wfl: 58.05, gesamtKaufpreis: 418000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 418000 - STELLPLATZ_PREIS, qmPreis: 7201, rendite: 3.5, status: "reserviert" },
  { id: "WE-002", nr: 2,  etage: "EG",    zimmer: 2, wfl: 55.24, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7205, rendite: 3.5, status: "reserviert" },
  { id: "WE-003", nr: 3,  etage: "EG",    zimmer: 1, wfl: 48.27, gesamtKaufpreis: 348000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 348000 - STELLPLATZ_PREIS, qmPreis: 7209, rendite: 3.5, status: "frei" },
  { id: "WE-004", nr: 4,  etage: "EG",    zimmer: 2, wfl: 59.16, gesamtKaufpreis: 426000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 426000 - STELLPLATZ_PREIS, qmPreis: 7201, rendite: 3.5, status: "frei" },
  { id: "WE-005", nr: 5,  etage: "EG",    zimmer: 1, wfl: 36.20, gesamtKaufpreis: 261000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 261000 - STELLPLATZ_PREIS, qmPreis: 7210, rendite: 3.5, status: "reserviert" },
  { id: "WE-006", nr: 6,  etage: "EG",    zimmer: 4, wfl: 99.48, gesamtKaufpreis: 717000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 717000 - STELLPLATZ_PREIS, qmPreis: 7207, rendite: 3.5, status: "frei" },
  { id: "WE-007", nr: 7,  etage: "1. OG", zimmer: 2, wfl: 55.85, gesamtKaufpreis: 402000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 402000 - STELLPLATZ_PREIS, qmPreis: 7198, rendite: 3.5, status: "frei" },
  { id: "WE-008", nr: 8,  etage: "1. OG", zimmer: 2, wfl: 55.28, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7200, rendite: 3.5, status: "frei" },
  { id: "WE-009", nr: 9,  etage: "1. OG", zimmer: 2, wfl: 55.26, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7202, rendite: 3.5, status: "frei" },
  { id: "WE-010", nr: 10, etage: "1. OG", zimmer: 2, wfl: 59.04, gesamtKaufpreis: 425000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 425000 - STELLPLATZ_PREIS, qmPreis: 7199, rendite: 3.5, status: "frei" },
  { id: "WE-011", nr: 11, etage: "1. OG", zimmer: 1, wfl: 35.69, gesamtKaufpreis: 257000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 257000 - STELLPLATZ_PREIS, qmPreis: 7201, rendite: 3.5, status: "reserviert" },
  { id: "WE-012", nr: 12, etage: "1. OG", zimmer: 4, wfl: 98.34, gesamtKaufpreis: 708000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 708000 - STELLPLATZ_PREIS, qmPreis: 7200, rendite: 3.5, status: "frei" },
  { id: "WE-013", nr: 13, etage: "2. OG", zimmer: 2, wfl: 55.79, gesamtKaufpreis: 402000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 402000 - STELLPLATZ_PREIS, qmPreis: 7206, rendite: 3.5, status: "frei" },
  { id: "WE-014", nr: 14, etage: "2. OG", zimmer: 2, wfl: 55.28, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7200, rendite: 3.5, status: "frei" },
  { id: "WE-015", nr: 15, etage: "2. OG", zimmer: 2, wfl: 55.26, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7202, rendite: 3.5, status: "frei" },
  { id: "WE-016", nr: 16, etage: "2. OG", zimmer: 2, wfl: 58.65, gesamtKaufpreis: 423000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 423000 - STELLPLATZ_PREIS, qmPreis: 7212, rendite: 3.5, status: "frei" },
  { id: "WE-017", nr: 17, etage: "2. OG", zimmer: 1, wfl: 35.69, gesamtKaufpreis: 257000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 257000 - STELLPLATZ_PREIS, qmPreis: 7201, rendite: 3.5, status: "reserviert" },
  { id: "WE-018", nr: 18, etage: "2. OG", zimmer: 4, wfl: 98.12, gesamtKaufpreis: 707000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 707000 - STELLPLATZ_PREIS, qmPreis: 7205, rendite: 3.5, status: "frei" },
  { id: "WE-019", nr: 19, etage: "3. OG", zimmer: 2, wfl: 55.79, gesamtKaufpreis: 402000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 402000 - STELLPLATZ_PREIS, qmPreis: 7206, rendite: 3.5, status: "frei" },
  { id: "WE-020", nr: 20, etage: "3. OG", zimmer: 2, wfl: 55.28, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7200, rendite: 3.5, status: "frei" },
  { id: "WE-021", nr: 21, etage: "3. OG", zimmer: 2, wfl: 55.26, gesamtKaufpreis: 398000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 398000 - STELLPLATZ_PREIS, qmPreis: 7202, rendite: 3.5, status: "frei" },
  { id: "WE-022", nr: 22, etage: "3. OG", zimmer: 2, wfl: 58.65, gesamtKaufpreis: 423000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 423000 - STELLPLATZ_PREIS, qmPreis: 7212, rendite: 3.5, status: "frei" },
  { id: "WE-023", nr: 23, etage: "3. OG", zimmer: 1, wfl: 35.69, gesamtKaufpreis: 257000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 257000 - STELLPLATZ_PREIS, qmPreis: 7201, rendite: 3.5, status: "reserviert" },
  { id: "WE-024", nr: 24, etage: "3. OG", zimmer: 4, wfl: 96.65, gesamtKaufpreis: 696000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 696000 - STELLPLATZ_PREIS, qmPreis: 7201, rendite: 3.5, status: "reserviert" },
  { id: "WE-025", nr: 25, etage: "DG",    zimmer: 2, wfl: 50.39, gesamtKaufpreis: 363000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 363000 - STELLPLATZ_PREIS, qmPreis: 7204, rendite: 3.5, status: "reserviert" },
  { id: "WE-026", nr: 26, etage: "DG",    zimmer: 2, wfl: 44.52, gesamtKaufpreis: 321000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 321000 - STELLPLATZ_PREIS, qmPreis: 7210, rendite: 3.5, status: "reserviert" },
  { id: "WE-027", nr: 27, etage: "DG",    zimmer: 2, wfl: 45.19, gesamtKaufpreis: 326000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 326000 - STELLPLATZ_PREIS, qmPreis: 7214, rendite: 3.5, status: "frei" },
  { id: "WE-028", nr: 28, etage: "DG",    zimmer: 3, wfl: 78.73, gesamtKaufpreis: 567000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 567000 - STELLPLATZ_PREIS, qmPreis: 7202, rendite: 3.5, status: "reserviert" },
  { id: "WE-029", nr: 29, etage: "DG",    zimmer: 3, wfl: 78.83, gesamtKaufpreis: 568000, stellplatz: STELLPLATZ_PREIS, kaufpreis: 568000 - STELLPLATZ_PREIS, qmPreis: 7205, rendite: 3.5, status: "frei" },
]

export const PROJEKT_ECKDATEN = {
  name: "Spandauer Tor",
  haus: "Haus 1",
  adresse: "Brunsbuetteler Damm 60-80, 13581 Berlin (Spandau)",
  bautraeger: "Immo Projekt Berlin-Spandau I GmbH (MAXAR AG)",
  baubeginn: "2026-05-01",
  fertigstellung: "2027-11-01",
  energiestandard: "KfW EH40 QNG Plus",
  mietgarantie: 21.00,
  stellplatzMiete: 80,
  verwaltungWEG: 31.54,
  verwaltungSE: 35.70,
  instandhaltung: 0.25,
  gestPct: 6.0,
  notarPct: 1.5,
  grundschuldPct: 0.5,
  grundstueckAnteil: 0.10,
  weGesamt: 264,
  haus1WE: 29,
  darlehen1: 150000,
  zins1: 2.83,
  tilgung1: 1.78,
  zins2: 4.30,
  tilgung2: 1.50,
}

import type { ProjectData } from "./rechner-types"

export function weToProjectData(we: WohneinheitData): ProjectData {
  const grundstueck = Math.round(we.kaufpreis * PROJEKT_ECKDATEN.grundstueckAnteil)
  const gesamtKP = we.kaufpreis + we.stellplatz
  const nkPctSumme = (PROJEKT_ECKDATEN.gestPct + PROJEKT_ECKDATEN.notarPct + PROJEKT_ECKDATEN.grundschuldPct) / 100
  const eigenkapital = Math.round(gesamtKP * nkPctSumme)
  const darlehen2 = gesamtKP - PROJEKT_ECKDATEN.darlehen1

  return {
    projektName: `${PROJEKT_ECKDATEN.name} \u2013 ${we.id} (${we.etage}, ${we.zimmer} Zi.)`,
    wfl: we.wfl,
    bgf: Math.round(we.wfl * 1.35 * 100) / 100,
    kaufpreis: we.kaufpreis,
    grundstueck,
    stellplatz: we.stellplatz,
    gestPct: PROJEKT_ECKDATEN.gestPct,
    notarPct: PROJEKT_ECKDATEN.notarPct,
    grundschuldPct: PROJEKT_ECKDATEN.grundschuldPct,
    baubeginn: PROJEKT_ECKDATEN.baubeginn,
    fertigstellung: PROJEKT_ECKDATEN.fertigstellung,
    mieteQm: PROJEKT_ECKDATEN.mietgarantie,
    mieteStellplatz: PROJEKT_ECKDATEN.stellplatzMiete,
    inflation: 2.5,
    eigenkapital,
    darlehen1Label: "KfW 298",
    darlehen1: PROJEKT_ECKDATEN.darlehen1,
    zins1: PROJEKT_ECKDATEN.zins1,
    tilgung1: PROJEKT_ECKDATEN.tilgung1,
    zinsbindung1: 10,
    tilgungsfrei1: 1,
    darlehen2Label: "Hausbank",
    darlehen2,
    zins2: PROJEKT_ECKDATEN.zins2,
    tilgung2: PROJEKT_ECKDATEN.tilgung2,
    zinsbindung2: 10,
    married: 1,
    einkommen: 60000,
    kirche: 0,
    verwaltung: Math.round((PROJEKT_ECKDATEN.verwaltungWEG + PROJEKT_ECKDATEN.verwaltungSE) * 12),
  }
}
