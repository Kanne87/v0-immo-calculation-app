// ─── Multi-Projekt Datenstruktur ──────────────────────────────────
import type { WohneinheitData } from "./units-data"
import { HAUS1_EINHEITEN, PROJEKT_ECKDATEN, STELLPLATZ_PREIS } from "./units-data"

export interface KeyFact {
  label: string
  value: string
}

export interface PraesSektion {
  title: string
  rows: { label: string; value: string }[]
}

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
  videoUrl?: string
  coverImageUrl?: string
  keyfacts?: KeyFact[]
  praesektionen?: PraesSektion[]
}

const SPANDAU_KEYFACTS: KeyFact[] = [
  { label: "Baujahr", value: "2028" },
  { label: "MFH", value: "10" },
  { label: "Wohneinheiten", value: "264" },
  { label: "Wohnfläche", value: "15.593 m²" },
  { label: "Gewerbeeinheiten", value: "6" },
  { label: "Gewerbefläche", value: "2.148 m²" },
]

const SPANDAU_SEKTIONEN: PraesSektion[] = [
  {
    title: "Immobilie",
    rows: [
      { label: "Prospektherausgeber", value: "Immo Projekt Berlin-Spandau I GmbH, Lassenstraße 11-15, 14193 Berlin" },
      { label: "Produkt", value: "Neubau von 10 Mehrfamilienhäusern, 1 Gewerbehaus nebst Kita und PKW-Stellplätze" },
      { label: "Wohnungsgrößen", value: "32,82 m² bis 108,52 m²" },
      { label: "Kaufpreis pro WE", value: "ab 236.000,00 €" },
      { label: "Kaufpreis Stellplatz", value: "29.000,00 €" },
    ],
  },
  {
    title: "Steuer & Förderung",
    rows: [
      { label: "Lineare AfA", value: "3,0 % linear über 33 Jahre gem. § 7 Abs. 4 Satz 1 Nr. 2a EStG (Neubau nach 31.12.2022, JStG 2022)" },
      { label: "Degressive Sonder-AfA", value: "5 % im ersten Jahr auf Investitionskosten, danach 5 % vom Restwert (Wachstumschancengesetz)" },
      { label: "Sonder-AfA § 7b EStG", value: "Grundlage: KfW EH40 QNG Plus" },
      { label: "KfW-Förderung", value: "Programm 297 (Eigennutzer) und 298 (Kapitalanleger), je bis 150.000 €, Zins ab ca. 1,13 % p. a. (Stand Okt. 2025)" },
    ],
  },
  {
    title: "Miete & Kosten",
    rows: [
      { label: "Mieterwartung", value: "ca. 21,00 €/m² Netto-Kaltmiete, Außenstellplatz 80,00 €/mtl." },
      { label: "Mietgarantie", value: "Bis 31.03.2029 zu 21,00 €/m² zzgl. BKA-Vorauszahlungen; bei Nichtbelegung zahlt Verkäufer Nettomiete für 1 Jahr" },
      { label: "WEG-Verwaltung", value: "ca. 26,50 €/mtl. zzgl. USt." },
      { label: "SE-Verwaltung", value: "ca. 30,00 €/mtl. zzgl. USt." },
      { label: "Stellplatz-Verwaltung", value: "ca. 5,00 €/mtl. zzgl. USt." },
      { label: "Instandhaltungsrücklage", value: "0,25 €/m² pro Monat" },
      { label: "Erwerbsnebenkosten", value: "ca. 8,00 % (2,00 % Notar/Grundbuch + 6,00 % Grunderwerbsteuer Berlin)" },
    ],
  },
  {
    title: "Grundbuch",
    rows: [
      { label: "Adresse", value: "Brunsbütteler Damm 60–80, 13581 Berlin" },
      { label: "Amtsgericht", value: "Spandau | Grundbuch von Spandau | Gemarkung Klosterfelde" },
      { label: "Blatt", value: "45246" },
      { label: "Flurstück", value: "Flur 1, Flurstück 1393 und 1391" },
      { label: "Grundstücksgröße", value: "Teilflächen 9.796 m² + 6.850 m², gesamt ca. 16.646 m²" },
    ],
  },
]

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
  videoUrl: "https://kailohmann.de/spandauer_tor.mp4",
  // coverImageUrl: "https://...",
  keyfacts: SPANDAU_KEYFACTS,
  praesektionen: SPANDAU_SEKTIONEN,
}

export const ALLE_PROJEKTE: ProjektDefinition[] = [
  SPANDAUER_TOR_HAUS1,
]
