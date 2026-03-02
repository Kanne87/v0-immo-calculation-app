// ─── Types ──────────────────────────────────────────────────────

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
  kumSteuer: number
  kumTilgung: number
  avgMonat: number
}

// ─── MaBV Auszahlungsstufen ─────────────────────────────────────
// §3 Abs. 2 MaBV: Raten bei Bautraegervertrag
export const MABV_STUFEN = [
  { pct: 0.30, label: "Beginn Erdarbeiten" },
  { pct: 0.28, label: "Rohbau inkl. Zimmererarbeiten" },
  { pct: 0.063, label: "Herstellung der Dachflaechen und Dachrinnen" },
  { pct: 0.063, label: "Rohinstallation Heizung/Sanitaer/Elektro" },
  { pct: 0.063, label: "Fenstereinbau inkl. Verglasung" },
  { pct: 0.063, label: "Innenputz (ohne Beiputzarbeiten)" },
  { pct: 0.063, label: "Estrich" },
  { pct: 0.042, label: "Fliesen" },
  { pct: 0.035, label: "Bezugsfertigkeit / Uebergabe" },
  { pct: 0.035, label: "Fassade" },
]

// ─── Default data (WE-003, EG, 1 Zi, 48,27 m²) ────────────────
// Korrigierte Werte aus Expose/Telis-Portal Stand 02.03.2026

export const defaultProjectData: ProjectData = {
  projektName: "Spandauer Tor – WE-003 (EG, 1 Zi.)",
  wfl: 48.27,
  bgf: 65.16,
  kaufpreis: 319000,   // 348.000 Gesamt - 29.000 Stellplatz
  grundstueck: 31900,  // ca. 10%
  stellplatz: 29000,
  gestPct: 6.0,        // Berlin (korrigiert von 6,5%)
  notarPct: 2.0,       // korrigiert von 1,5%
  grundschuldPct: 0.5,
  baubeginn: "2026-04-01",
  fertigstellung: "2028-12-31",
  mieteQm: 21.0,       // Mietgarantie lt. KV
  mieteStellplatz: 80,  // lt. KV
  inflation: 2.5,
  eigenkapital: 0,
  darlehen1Label: "KfW 298",
  darlehen1: 150000,
  zins1: 2.83,
  tilgung1: 1.78,
  zinsbindung1: 10,
  tilgungsfrei1: 0,
  darlehen2Label: "Hausbank",
  darlehen2: 198000,   // 348.000 - 150.000
  zins2: 4.30,
  tilgung2: 1.50,
  zinsbindung2: 10,
  married: 1,
  einkommen: 60000,
  kirche: 0,
  verwaltung: 807,     // (31,54 WEG + 35,70 SE) × 12
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
