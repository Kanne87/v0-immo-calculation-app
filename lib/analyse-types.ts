// Backoffice Objektanalyse: 7 Pruefbereiche
// Jeder Bereich hat Score, Status, interne Analyse, Verkaufsansicht

export type AnalyseStatus = "solide" | "pruefen" | "kritisch" | "offen"

export interface OffeneFrage {
  id: string
  bereich: string
  prioritaet: "kritisch" | "wichtig" | "nice-to-have"
  frage: string
  status: "offen" | "angefragt" | "beantwortet"
  antwort?: string
  datum?: string
}

export interface AnalyseBereich {
  id: string
  name: string
  score: number          // 0-10
  status: AnalyseStatus
  internText: string     // Blanke Wahrheit
  verkaufText: string    // Konstruktiv-ehrliche Darstellung
  details: Record<string, unknown>
  belege: string[]       // Nextcloud-Pfade oder URLs
  offeneFragen: OffeneFrage[]
}

// ==========================================
// 1. BAUTRAEGER
// ==========================================
export interface BautraegerDetails {
  firmenname: string
  rechtsform: string
  hrb: string
  sitz: string
  geschaeftsfuehrer: string
  gruendungsdatum: string
  stammkapital: number
  // Bilanzanalyse
  bilanzsumme?: number
  eigenkapitalquote?: number
  ueberschuldung?: { jahr: number; betrag: number }
  // Bonität
  creditreformIndex?: number
  creditreformKlasse?: string
  // Track Record
  jahreAktiv: number
  referenzprojekte: {
    name: string
    ort: string
    status: "fertiggestellt" | "im-bau" | "geplant"
    fertigstellung?: string
    vollstaendigVerkauft?: boolean
  }[]
  // Absicherungen
  mabvBuergschaft: boolean
  tuevBaucontrolling: boolean
  baucontrollingAnbieter?: string
  // Vorgaengergesellschaften
  vorgaenger?: {
    name: string
    hrb: string
    anmerkung: string
  }[]
}

// ==========================================
// 2. STANDORT
// ==========================================
export interface StandortDetails {
  makro: {
    stadt: string
    einwohner: number
    bip: number
    bipWachstum: string
    leerstandsquote: number
    mietpreisNeubau: number
    mietpreisBestand?: number
    studierende?: number
    spitzenrenditeWohnen?: number
    topArbeitgeber: { name: string; mitarbeiter?: number }[]
    pressestimmen?: string[]
  }
  meso: {
    bezirk: string
    einwohnerBezirk: number
    sbahnMinZentrum: number
    autoMinZentrum: number
    schluesselInfra: string[]         // z.B. Siemensstadt 2.0
    bodenrichtwertTrend?: string
    charakter: string                 // Freitext
  }
  mikro: {
    adresse: string
    grundstuecksgroesse: number
    pois: { name: string; kategorie: string; distanzM?: number }[]
    oepnvHaltestellen: { name: string; linien: string; gehminM: number }[]
    immissionen: { typ: string; beschreibung: string; schwere: "gering" | "mittel" | "hoch" }[]
  }
}

// ==========================================
// 3. RECHTLICHES
// ==========================================
export interface RechtlichesDetails {
  grundbuch: {
    amtsgericht: string
    blatt: string
    flurstuecke: string
    abteilungII: {
      anzahl: number
      zusammenfassung: string
      kritischeEintraege: string[]
    }
  }
  baugenehmigung: {
    vorhanden: boolean
    datum?: string
    aktenzeichen?: string
    auflagen?: string[]
  }
  teilungserklaerung: {
    geprueft: boolean
    auffaelligkeiten?: string[]
  }
  kaufvertrag: {
    geprueft: boolean
    auffaelligkeiten?: string[]
    auflassungsvormerkung: boolean
  }
  baulasten: {
    vorhanden: boolean
    beschreibung?: string
  }
}

// ==========================================
// 4. WIRTSCHAFTLICHKEIT
// ==========================================
export interface WirtschaftlichkeitDetails {
  kaufpreisProQm: number
  marktpreisProQm?: number
  kaufpreisAbweichungPct?: number
  bruttoMietrendite: number
  nettoMietrendite?: number
  kfwProgramm: string
  kfwZins: number
  kfwBetrag: number
  afaModell: string        // z.B. "3% linear 33J" oder "5% degressiv"
  sonderAfaParagraph?: string
  cashflowJahr1?: number
  cashflowJahr10?: number
  hebelwirkungFKPct?: number
  mietgarantieBis?: string
  mietgarantieHoehe?: number
}

// ==========================================
// 5. BAU UND QUALITAET
// ==========================================
export interface BauQualitaetDetails {
  energiestandard: string        // z.B. KfW EH40 QNG Plus
  bauweise: string               // z.B. Massiv/Betonfertigteile
  schallschutz: string           // z.B. DIN 4109 erhoehter Schallschutz
  ausstattung: "standard" | "gehoben" | "luxus"
  ausstattungDetails?: string[]
  tiefgarage: boolean
  aufzug: boolean
  barrierefreiheit: boolean
  pvAnlage?: boolean
  waermepumpe?: boolean
  fussbodenheizung?: boolean
  bauzeitMonate: number
  baubeginn: string
  fertigstellung: string
}

// ==========================================
// 6. RISIKOFAKTOREN
// ==========================================
export interface Risiko {
  id: string
  typ: "bautraeger" | "standort" | "markt" | "bau" | "recht" | "finanzierung"
  titel: string
  beschreibung: string
  schwere: "gering" | "mittel" | "hoch" | "kritisch"
  mitigation?: string
  status: "offen" | "mitigiert" | "akzeptiert"
}

export interface RisikofaktorenDetails {
  risiken: Risiko[]
  gesamtbewertung: string
}

// ==========================================
// 7. VERTRAGLICHES
// ==========================================
export interface VertraglichesDetails {
  mabvZahlungsplan: {
    nr: number
    abschnitt: string
    prozent: number
    datum?: string
  }[]
  buergschaften: {
    typ: string       // z.B. "MaBV Paragraph 7"
    vorhanden: boolean
    details?: string
  }[]
  gewaehrleistung: {
    dauerJahre: number
    details?: string
  }
  mietgarantie: {
    vorhanden: boolean
    bis?: string
    hoehe?: number
    bedingungen?: string
  }
  ruecktrittsrechte?: string
  sonderwuensche?: string
  einbehalt?: {
    prozent: number
    dauer?: string
  }
}

// ==========================================
// GESAMT-ANALYSE PRO PROJEKT
// ==========================================
export interface ProjektAnalyse {
  projektId: string
  projektName: string
  erstelltAm: string
  aktualisiertAm: string
  gesamtScore: number
  gesamtVerdict: string
  bereiche: {
    bautraeger: AnalyseBereich & { details: BautraegerDetails }
    standort: AnalyseBereich & { details: StandortDetails }
    rechtliches: AnalyseBereich & { details: RechtlichesDetails }
    wirtschaftlichkeit: AnalyseBereich & { details: WirtschaftlichkeitDetails }
    bauQualitaet: AnalyseBereich & { details: BauQualitaetDetails }
    risikofaktoren: AnalyseBereich & { details: RisikofaktorenDetails }
    vertragliches: AnalyseBereich & { details: VertraglichesDetails }
  }
}

// Bereich-Keys fuer Iteration
export const ANALYSE_BEREICHE = [
  "bautraeger", "standort", "rechtliches", "wirtschaftlichkeit",
  "bauQualitaet", "risikofaktoren", "vertragliches"
] as const
export type AnalyseBereichKey = typeof ANALYSE_BEREICHE[number]

export const BEREICH_LABELS: Record<AnalyseBereichKey, string> = {
  bautraeger: "Bautr\u00e4ger",
  standort: "Standort",
  rechtliches: "Rechtliches",
  wirtschaftlichkeit: "Wirtschaftlichkeit",
  bauQualitaet: "Bau & Qualit\u00e4t",
  risikofaktoren: "Risikofaktoren",
  vertragliches: "Vertragliches",
}

export const STATUS_CONFIG: Record<AnalyseStatus, { label: string; color: string; bg: string }> = {
  solide: { label: "Solide", color: "text-green-800", bg: "bg-green-100" },
  pruefen: { label: "Pr\u00fcfen", color: "text-amber-800", bg: "bg-amber-100" },
  kritisch: { label: "Kritisch", color: "text-red-800", bg: "bg-red-100" },
  offen: { label: "Offen", color: "text-blue-800", bg: "bg-blue-100" },
}
