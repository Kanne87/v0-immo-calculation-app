// ─── Types ──────────────────────────────────────────────────────────────

export interface ProjectTemplate {
  id: string
  name: string
  ort: string
  weAnzahl: number
  status: string
  defaults: ProjectData
}

export interface ProjectData {
  // Objekt
  projektName: string
  wfl: number
  bgf: number
  kaufpreis: number
  grundstueck: number
  stellplatz: number

  // Nebenkosten
  gestPct: number
  notarPct: number
  grundschuldPct: number

  // Bauzeit
  baubeginn: string     // ISO date string "YYYY-MM-DD"
  fertigstellung: string // ISO date string "YYYY-MM-DD"

  // Miete
  mieteQm: number
  mieteStellplatz: number
  inflation: number

  // Finanzierung
  eigenkapital: number

  darlehen1Label: string
  darlehen1: number
  zins1: number
  tilgung1: number
  zinsbindung1: number
  tilgungsfrei1: number

  darlehen2Label: string
  darlehen2: number
  zins2: number
  tilgung2: number
  zinsbindung2: number

  // Steuer
  married: number
  einkommen: number
  kirche: number

  // Verwaltung
  verwaltung: number
}

// ─── Gespeicherte Berechnung ─────────────────────────────────
export interface SavedCalculation {
  id: string
  authentikSub: string
  description: string
  sourceUnitId: string
  projectData: ProjectData
  createdAt: string
  updatedAt: string
  householdId?: string
  eventId?: string
}

export interface YearResult {
  j: number
  miete: number
  zinsen: number
  tilgung: number
  rate1: number
  rate2: number
  restschuld1: number
  restschuld2: number
  restschuldGesamt: number
  afaDegr: number
  afaSonder: number
  einmalig: number
  steuerErgebnis: number
  steuerWirkung: number
  verwaltung: number
  instandhaltung: number
  ueberschuss: number
}

export interface CalcResult {
  gesamtKP: number
  nebenkosten: number
  nkGesamt: number
  gesamtInvest: number
  gebaeudeWert: number
  mieteJahr: number
  marginalRate: number
  einmaligeWK: number
  sonderAfaBasis: number
  sonder7bBerechtigt: boolean
  gebaeudeKostenProQmBGF: number
  gestBetrag: number
  notarBetrag: number
  grundschuldBetrag: number
  bauzeitZinsen: number
  bauzeitMonate: number
  jahre: YearResult[]
  j1: YearResult
  aufwandJ1: number
  aufwandMonat: number
  restschuldEnde: number
  wertsteigerung: number
  vermoegenEnde: number
  gewinn: number
  rendite: number
  renditeGesamt: number
  kumSteuer: number
  kumTilgung: number
  avgMonat: number
}

// ─── MaBV Auszahlungsstufen ──────────────────────────────────
// Quelle: Expos&#xe9; Spandauer Tor / Immo Projekt Berlin-Spandau I GmbH
// Kaufvertrag &#xa7;3 Abs. 2 MaBV, Seite 80 des Verkaufsprospekts (Stand Jan. 2026)
// 13 projektspezifische Stufen, Summe = 100 %
//
// monatRef = realistischer Abrufzeitpunkt bei 18 Monaten Bauzeit
// (Basis: MFH 5+ Geschosse, Massiv/Betonfertigteile, TG, KfW EH40)
// Skaliert proportional bei abweichender Bauzeit.
export const MABV_STUFEN = [
  { pct: 0.300, label: "Beginn Erdarbeiten",                        monatRef: 0 },
  { pct: 0.280, label: "Rohbaufertigstellung inkl. Zimmererarbeiten", monatRef: 5 },
  { pct: 0.056, label: "Herstellung der Dachflaechen und Dachrinnen", monatRef: 6 },
  { pct: 0.021, label: "Rohinstallation Heizungsanlagen",            monatRef: 8 },
  { pct: 0.021, label: "Rohinstallation Sanitaranlagen",             monatRef: 8 },
  { pct: 0.021, label: "Rohinstallation Elektroanlagen",             monatRef: 8 },
  { pct: 0.070, label: "Fenstereinbau inkl. Verglasung",             monatRef: 7 },
  { pct: 0.042, label: "Innenputz (ohne Beiputzarbeiten)",           monatRef: 10 },
  { pct: 0.021, label: "Estrich",                                    monatRef: 11 },
  { pct: 0.028, label: "Fliesenarbeiten im Sanitaerbereich",         monatRef: 13 },
  { pct: 0.084, label: "Bezugsfertigkeit und Besitzuebergabe",       monatRef: 16 },
  { pct: 0.021, label: "Fassadenarbeiten",                           monatRef: 17 },
  { pct: 0.035, label: "Vollstaendige Fertigstellung",               monatRef: 18 },
]

// Referenz-Bauzeit zu der die monatRef-Werte geh&#xf6;ren
export const MABV_REF_MONATE = 18

// ─── Default data (WE-003, EG, 1 Zi, 48,27 m&#xb2;) ──────────────
// EK = Nebenkosten (348.000 * 8,5% = 29.580)
// D2 = GesamtKP - D1 (348.000 - 150.000 = 198.000)
export const defaultProjectData: ProjectData = {
  projektName: "Spandauer Tor \u2013 WE-003 (EG, 1 Zi.)",
  wfl: 48.27,
  bgf: 65.16,
  kaufpreis: 319000,
  grundstueck: 31900,
  stellplatz: 29000,
  gestPct: 6.0,
  notarPct: 2.0,
  grundschuldPct: 0.5,
  baubeginn: "2026-05-01",
  fertigstellung: "2027-11-01",
  mieteQm: 21.0,
  mieteStellplatz: 80,
  inflation: 2.5,
  eigenkapital: 29580,
  darlehen1Label: "KfW 298",
  darlehen1: 150000,
  zins1: 2.83,
  tilgung1: 1.78,
  zinsbindung1: 10,
  tilgungsfrei1: 0,
  darlehen2Label: "Hausbank",
  darlehen2: 198000,
  zins2: 4.30,
  tilgung2: 1.50,
  zinsbindung2: 10,
  married: 1,
  einkommen: 60000,
  kirche: 0,
  verwaltung: 807,
}

export const defaultTemplates: ProjectTemplate[] = [
  {
    id: "spandauer-tor",
    name: "Spandauer Tor",
    ort: "Berlin-Spandau",
    weAnzahl: 264,
    status: "KfW EH40 QNG Plus",
    defaults: { ...defaultProjectData },
  },
]
