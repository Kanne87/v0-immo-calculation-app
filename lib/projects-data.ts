// ─── Multi-Projekt Datenstruktur ──────────────────────────────────
import type { WohneinheitData } from "./units-data"
import { HAUS1_EINHEITEN, PROJEKT_ECKDATEN, STELLPLATZ_PREIS } from "./units-data"

export interface FaktenblattRow {
  label: string
  value: string
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
  faktenblatt?: FaktenblattRow[]
}

const SPANDAU_FAKTENBLATT: FaktenblattRow[] = [
  { label: "Prospektherausgeber", value: "Immo Projekt Berlin-Spandau I GmbH, Lassenstraße 11-15 in 14193 Berlin" },
  { label: "Produkt", value: "Neubau von 10 Mehrfamilienhäusern, 1 Gewerbehaus nebst Kita und PKW-Stellplätze" },
  { label: "Baujahr", value: "2028" },
  { label: "Anzahl WE", value: "264 Neubauwohnungen" },
  { label: "Anzahl GE", value: "6 Gewerbeeinheiten im Haus 11 + Kita in Haus 5 und 6" },
  { label: "Wohnungsgrößen", value: "von 32,82 m² bis 108,52 m²" },
  { label: "Kaufpreis pro WE", value: "ab 236.000,00 €" },
  { label: "Kaufpreis je Außenstellplatz", value: "29.000,00 €" },
  { label: "Lineare Abschreibung", value: "Lineare AfA gem. § 7 Abs. 4 Satz 1 Nr. 2a EStG 3,0 % linear für die Dauer von 33 Jahren, bezogen auf die Neubausubstanz (Errichtung nach dem 31.12.2022 gemäß JStG 2022)" },
  { label: "Degressive Sonder-AfA", value: "Rückführende Einführung einer degressiven Sonder-AfA in Höhe von 5 % zur Anwendung. Im ersten Jahr können 5 % der Investitionskosten geltend gemacht werden und danach 5 % des Restwertes" },
  { label: "Sonder-AfA § 7b EStG", value: "Grundlage KfW EH40 QNG Plus" },
  { label: "KfW-Förderung", value: "Grundlage KfW EH40 QNG Plus Programm 297 (für Eigennutzer) bis zu 150.000,00 € mit variablem Zins ab ca. 1,13 % je nach Laufzeit, Programm 298 (für Kapitalanleger) bis zu 150.000,00 € mit variablem Zins ab ca. 1,13 % je nach Laufzeit (Stand Oktober 2025)" },
  { label: "Erwerbsnebenkosten", value: "ca. 8,00 % davon ca. 2,00 % Notar- und Grundbuchkosten und 6,00 % Grunderwerbsteuer in Berlin" },
  { label: "Mieterwartung", value: "ca. 21,00 €/m² / Netto-Kaltmiete pro Wohnfläche, Außenstellplatz 80,00 €/ mtl." },
  { label: "Mietgarantie", value: "Verpflichtung des Verkäufers die Wohnungen bis spätestens 31.03.2029 zu 21,00 €/m² zzgl. BKA-Vorauszahlungen zu vermieten. Bei nicht vermieteter WE bei Besitzübergang verpflichtet sich der Verkäufer die Nettomiete für ein Jahr zu zahlen" },
  { label: "Mietnebenkosten", value: "WEG-Verwaltung Wohnungen mtl. ca. 26,50 €/mtl. zzgl. USt. SE-Verwaltung Wohnungen ca. 30,00 €/mtl. zzgl. USt. PKW-Stellplatz ca. 5,00 €/mtl. zzgl. USt." },
  { label: "Instandhaltungsrücklage", value: "geplant 0,25 €/m² im Monat pro Wohnung" },
  { label: "Angaben zum Grundbuch", value: "Adresse: Brunsbütteler Damm 60-80, 13581 Berlin · Amtsgericht: Spandau | Grundbuch von Spandau | Gemarkung Klosterfelde" },
  { label: "Blatt: 45246", value: "Flur 1, Flurstück 1393 und 1391 · zu vermessende Teilflächen von 9.796 m² und 6.850 m² · Größe gesamt ca. 16.646 m²" },
  { label: "Wohnfläche", value: "ca. 15.593,49 m² (Gewerbefläche ca. 2.148,29 m²)" },
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
  videoUrl: "https://cloud.kailohmann.de/s/2ZQ6bbpLzmMgtJk/download",
  // coverImageUrl: "https://...",  ← Bild-URL hier eintragen
  faktenblatt: SPANDAU_FAKTENBLATT,
}

// Neue Projekte hier anhängen
export const ALLE_PROJEKTE: ProjektDefinition[] = [
  SPANDAUER_TOR_HAUS1,
]
