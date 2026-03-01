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
  bauzeitZinsPct: number

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

// ─── Default data ───────────────────────────────────────────────

export const defaultProjectData: ProjectData = {
  projektName: "Spandauer Tor",
  wfl: 51.55,
  bgf: 80.87,
  kaufpreis: 309000,
  grundstueck: 30900,
  stellplatz: 29000,
  gestPct: 6.5,
  notarPct: 1.5,
  grundschuldPct: 0.5,
  bauzeitZinsPct: 3.0,
  mieteQm: 18.0,
  mieteStellplatz: 60,
  inflation: 2.5,
  eigenkapital: 38870,
  darlehen1Label: "KfW 297/298",
  darlehen1: 150000,
  zins1: 2.83,
  tilgung1: 1.78,
  zinsbindung1: 10,
  tilgungsfrei1: 0,
  darlehen2Label: "Hausbank",
  darlehen2: 188000,
  zins2: 4.30,
  tilgung2: 1.50,
  zinsbindung2: 10,
  married: 1,
  einkommen: 60000,
  kirche: 0,
  verwaltung: 480,
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
