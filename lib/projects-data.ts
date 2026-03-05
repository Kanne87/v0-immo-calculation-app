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
  { label: "Wohnfl\u00e4che", value: "15.593 m\u00b2" },
  { label: "Gewerbeeinheiten", value: "6" },
  { label: "Gewerbefl\u00e4che", value: "2.148 m\u00b2" },
]

const SPANDAU_SEKTIONEN: PraesSektion[] = [
  {
    title: "Immobilie",
    rows: [
      { label: "Prospektherausgeber", value: "Immo Projekt Berlin-Spandau I GmbH, Lassenstra\u00dfe 11-15, 14193 Berlin" },
      { label: "Produkt", value: "Neubau von 10 Mehrfamilienh\u00e4usern, 1 Gewerbehaus nebst Kita und PKW-Stellpl\u00e4tze" },
      { label: "Wohnungsgr\u00f6\u00dfen", value: "32,82 m\u00b2 bis 108,52 m\u00b2" },
      { label: "Kaufpreis pro WE", value: "ab 236.000,00 \u20ac" },
      { label: "Kaufpreis Stellplatz", value: "29.000,00 \u20ac" },
    ],
  },
  {
    title: "Steuer & F\u00f6rderung",
    rows: [
      { label: "Lineare AfA", value: "3,0 % linear \u00fcber 33 Jahre gem. \u00a7 7 Abs. 4 Satz 1 Nr. 2a EStG (Neubau nach 31.12.2022, JStG 2022)" },
      { label: "Degressive Sonder-AfA", value: "5 % im ersten Jahr auf Investitionskosten, danach 5 % vom Restwert (Wachstumschancengesetz)" },
      { label: "Sonder-AfA \u00a7 7b EStG", value: "Grundlage: KfW EH40 QNG Plus" },
      { label: "KfW-F\u00f6rderung", value: "Programm 297 (Eigennutzer) und 298 (Kapitalanleger), je bis 150.000 \u20ac, Zins ab ca. 1,13 % p. a. (Stand Okt. 2025)" },
    ],
  },
  {
    title: "Miete & Kosten",
    rows: [
      { label: "Mieterwartung", value: "ca. 21,00 \u20ac/m\u00b2 Netto-Kaltmiete, Au\u00dfenstellplatz 80,00 \u20ac/mtl." },
      { label: "Mietgarantie", value: "Bis 31.03.2029 zu 21,00 \u20ac/m\u00b2 zzgl. BKA-Vorauszahlungen; bei Nichtbelegung zahlt Verk\u00e4ufer Nettomiete f\u00fcr 1 Jahr" },
      { label: "WEG-Verwaltung", value: "ca. 26,50 \u20ac/mtl. zzgl. USt." },
      { label: "SE-Verwaltung", value: "ca. 30,00 \u20ac/mtl. zzgl. USt." },
      { label: "Stellplatz-Verwaltung", value: "ca. 5,00 \u20ac/mtl. zzgl. USt." },
      { label: "Instandhaltungsr\u00fccklage", value: "0,25 \u20ac/m\u00b2 pro Monat" },
      { label: "Erwerbsnebenkosten", value: "ca. 8,00 % (2,00 % Notar/Grundbuch + 6,00 % Grunderwerbsteuer Berlin)" },
    ],
  },
  {
    title: "Grundbuch",
    rows: [
      { label: "Adresse", value: "Brunsb\u00fctteler Damm 60\u201380, 13581 Berlin" },
      { label: "Amtsgericht", value: "Spandau | Grundbuch von Spandau | Gemarkung Klosterfelde" },
      { label: "Blatt", value: "45246" },
      { label: "Flurst\u00fcck", value: "Flur 1, Flurst\u00fcck 1393 und 1391" },
      { label: "Grundst\u00fccksgr\u00f6\u00dfe", value: "Teilfl\u00e4chen 9.796 m\u00b2 + 6.850 m\u00b2, gesamt ca. 16.646 m\u00b2" },
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
