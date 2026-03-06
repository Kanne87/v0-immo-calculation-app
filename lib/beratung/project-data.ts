// ─── Beratungsstrecke: Projektdaten-Typen & Spandauer Tor ────────
// Wiederverwendbares Template: Fuer ein neues Projekt einfach eine
// neue Datei nach demselben Schema anlegen.

// ─── Types ───────────────────────────────────────────────────────

export interface BigFiveCriterion {
  label: string
  score: number
  maxScore: number
  reasoning: string
}

export interface BigFiveCategory {
  score: number
  text: string
  criteria: BigFiveCriterion[]
  positives: string[]
  negatives: string[]
}

export interface BeratungProjectData {
  id: string
  slug: string
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  units: number
  unitSizes: { min: number; max: number; avg: number }
  priceFrom: number
  rentPerSqm: number
  kfwStandard: string
  constructionStart: string
  completion: string
  developer: {
    name: string
    legalForm: string
    salesCoordination: string
  }
  bigFive: {
    lage: BigFiveCategory
    zustand: BigFiveCategory
    grundriss: BigFiveCategory
    verwaltung: BigFiveCategory
    einkaufspreis: BigFiveCategory
  }
  location: {
    macro: MacroData
    meso: MesoData
    micro: MicroData
  }
  mabvSchedule: MaBVRate[]
  videoUrl?: string
}

export interface MacroData {
  city: string
  population: number
  populationNote: string
  gdp: number
  gdpNote: string
  vacancyRate: number
  rentNewConstruction: number
  students: number
  yieldResidential: number
  investmentVolume: number
  priceGrowthAvg: number
  topEmployers: { name: string; employees: string }[]
  highlights: string[]
  pressQuotes: { source: string; text: string; date: string }[]
}

export interface MesoData {
  district: string
  populationDistrict: number
  transitTimeCenter: { minutes: number; mode: string; station: string }
  carTimeCenter: { minutes: number; distanceKm: number }
  timeToPotsdamMin: number
  keyInfrastructure: { icon: string; text: string }[]
  quote: { text: string; source: string }
  bodenrichtwertMapFile: string
}

export interface MicroData {
  plotSizeSqm: number
  flurstuecke: string
  grundbuchBelastungen: number
  pois: { category: string; items: string[] }[]
  transitStops: { name: string; lines: string; walkMin: number }[]
  risks: { type: string; description: string; mitigation: string }[]
}

export interface MaBVRate {
  nr: number
  abschnitt: string
  monat: number
  prozent: number
}

// ─── Spandauer Tor Projektdaten ─────────────────────────────────

export const SPANDAUER_TOR_BERATUNG: BeratungProjectData = {
  id: "spandauer-tor",
  slug: "spandauer-tor",
  name: "Spandauer Tor",
  address: "Brunsbuetteler Damm 60-80, 13581 Berlin (Spandau)",
  coordinates: { lat: 52.5401, lng: 13.2027 },
  units: 264,
  unitSizes: { min: 32.82, max: 108.52, avg: 58.7 },
  priceFrom: 236000,
  rentPerSqm: 21.0,
  kfwStandard: "KfW EH40 QNG Plus",
  constructionStart: "2026-05-01",
  completion: "2028",
  developer: {
    name: "Immo Projekt Berlin-Spandau I GmbH (MAXAR AG)",
    legalForm: "GmbH, HRB 276414 B",
    salesCoordination: "DS Konzept GmbH & Co. KG, Magdeburg",
  },

  bigFive: {
    lage: {
      score: 7.6,
      text: "Berlin-Spandau: Bundeshauptstadt, 0.8% Leerstand, 15 Min. RE zum Hbf, Siemensstadt 2.0 als Zukunftstreiber",
      criteria: [
        { label: "Leerstandsquote", score: 10, maxScore: 10, reasoning: "0.8% Leerstand in Gesamtberlin — de facto Vollvermietung. Unter 1% gilt als Wohnungsmangel." },
        { label: "OEPNV-Anbindung", score: 6, maxScore: 10, reasoning: "Expose nennt 7 Min. — das gilt nur fuer ICE nonstop. Realistisch: ca. 15-17 Min. RE, ca. 30 Min. S-Bahn (S3/S9 ueber Stadtbahn) zum Hauptbahnhof. (Quelle: berlin.de, Rome2Rio) U7 am Rathaus Spandau in Laufweite, aber kein direkter U-Bahn-Anschluss am Grundstueck." },
        { label: "Wirtschaftskraft", score: 9, maxScore: 10, reasoning: "Berlin BIP 207 Mrd. EUR, Wachstum ueber Bundesdurchschnitt. Siemensstadt 2.0 als Milliardenprojekt direkt nebenan. Tesla, DB, Charite als Top-Arbeitgeber." },
        { label: "Bevoelkerungsprognose", score: 8, maxScore: 10, reasoning: "Berlin waechst Richtung 4 Mio. Fuer Spandau erwarten Makler 2-4% Preissteigerung p.a. (Immodo Berlin, Jan 2026). Aber: nicht alle Bezirke wachsen gleich." },
        { label: "Mikrolage", score: 6, maxScore: 10, reasoning: "Brunsbuetteler Damm ist Hauptverkehrsstrasse. DB InfraGo plant zusaetzliches Gleis noerdlich des Grundstuecks (bestaetigt durch Grundbuch Abt. II + Expose S.40-43). 5m Wartungsweg eingeplant. Kompensiert durch Naehe zu Spandau Arcaden und Havel." },
        { label: "Bodenrichtwert", score: 7, maxScore: 10, reasoning: "BRW 1.200 EUR/m2 Wohnbauflaeche (BORIS Berlin, Stichtag 01.01.2025, Zone Pichelsdorfer Str./Wilhelmstadt). Naehe Bahnhof: 1.600 EUR/m2. Solider Mittelwert fuer Spandau." },
      ],
      positives: ["Bundeshauptstadt mit Wohnungsmangel (0.8% Leerstand)", "Siemensstadt 2.0 als Zukunftstreiber", "2-4% Preissteigerungsprognose fuer Spandau (Makler-Konsens)", "Bodenrichtwert 1.200 EUR/m2 (BORIS 2025)"],
      negatives: ["OEPNV: 15-17 Min. RE zum Hbf, nicht 7 Min. wie im Expose", "DB-Gleisausbau noerdlich = mehr Bahnlaerm (Grundbuch bestaetigt)", "Spandau ist kein A-Lage-Bezirk innerhalb Berlins"],
    },
    zustand: {
      score: 9,
      text: "KfW EH40 QNG Plus Neubau, TUeV-kontrolliertes Baucontrolling, Massivbauweise, Fussbodenheizung, Aufzug",
      criteria: [
        { label: "Energiestandard", score: 10, maxScore: 10, reasoning: "KfW EH40 QNG Plus ist der hoechste foerderfaehige Standard. Waermepumpe, PV-Anlage, WDVS. Zukunftssicher gegen steigende Energiekosten." },
        { label: "Bauqualitaet", score: 9, maxScore: 10, reasoning: "Massivbauweise (Betonfertigteile + Ortbeton), TUeV-Baucontrolling. Kein Abzug fuer Leichtbau oder fehlende Qualitaetssicherung." },
        { label: "Ausstattung", score: 9, maxScore: 10, reasoning: "Fussbodenheizung, Aufzug, Videogegensprechanlage, elektrische Rolllaeden, bodengleiche Duschen. Gehoben fuer Neubau-Kapitalanlage." },
        { label: "Bautraeger-Erfahrung", score: 7, maxScore: 10, reasoning: "MAXAR AG erst seit 2021/22 aktiv, Stammkapital 50k EUR. Referenzprojekt Falkensee verkauft. Aber: Bilanzielle Ueberschuldung 2023 (8.84 Mio EUR). TUeV-Controlling kompensiert teilweise." },
      ],
      positives: ["Hoechster KfW-Standard (EH40 QNG Plus)", "TUeV-kontrolliertes Baucontrolling", "Massivbauweise, kein Fertighaus"],
      negatives: ["Projekt noch nicht gebaut — Ausfuehrungsqualitaet unbekannt", "Bautraeger bilanziell duenn (50k Grundkapital)"],
    },
    grundriss: {
      score: 7.5,
      text: "Bogenfoermiger Grundriss mit 6 WE/Geschoss. 1-4 Zimmer, barrierefrei, jede WE mit Abstellraum und Loggia/Terrasse.",
      criteria: [
        { label: "Raumaufteilung", score: 7, maxScore: 10, reasoning: "Offene Wohn/Ess/Koch-Bereiche, separate Schlafzimmer ab 2 Zi. Baeder innenliegend (kein Tageslicht) bei kleineren WE. 4-Zi-Eckwohnungen mit 2 Baedern geloest." },
        { label: "Aussenbereiche", score: 9, maxScore: 10, reasoning: "Konsequent: Jede WE hat Loggia, Balkon oder Terrasse. Im DG (4.OG) grosszuegige Dachterrassen. EG mit ebenerdigen Terrassen." },
        { label: "Flexibilitaet", score: 7, maxScore: 10, reasoning: "Guter Mix: 1-Zi (35-48 m2), 2-Zi (44-59 m2), 3-Zi (78-79 m2), 4-Zi (96-109 m2). Jede WE mit Abstellraum. Aber: Bogenform schraenkt Moeblierung stellenweise ein." },
        { label: "Belichtung", score: 7, maxScore: 10, reasoning: "Bogenform = viele WE mit guter Suedost-/Suedwest-Belichtung. Nordseitige WE (im oberen Bogen) weniger Sonne. Alle 1-2 Zi einseitig orientiert (keine Durchlueftung)." },
        { label: "Effizienz", score: 8, maxScore: 10, reasoning: "Kurze Flure, kompakte Erschliessung ueber 2 Treppenhaeuser + Aufzug. Wenig verlorene Flaeche. Faktor BGF/Wfl ca. 1.35 — solide." },
      ],
      positives: ["Jede WE mit Abstellraum und Aussenbereich", "Grosszuegige Dachterrassen im DG", "4-Zi mit 2 Baedern", "Effizienter Grundriss, wenig Verkehrsflaeche"],
      negatives: ["Innenliegende Baeder ohne Fenster bei kleineren WE", "Bogenform schraenkt Moeblierung teils ein", "Einseitige Orientierung bei 1-2-Zi-WE"],
    },
    verwaltung: {
      score: 7,
      text: "Regionale Hausverwaltung, WEG + SE-Verwaltung, Untergemeinschaften je Haus",
      criteria: [
        { label: "WEG-Struktur", score: 8, maxScore: 10, reasoning: "Untergemeinschaften je Haus (10 Haeuser). Entscheidungen koennen je Haus getroffen werden — kein 264-WE-Moloch bei Eigentuemerversammlungen." },
        { label: "Verwaltung", score: 7, maxScore: 10, reasoning: "Regionale Hausverwaltung (noch nicht benannt). WEG- und SE-Verwaltung getrennt. Professionell, aber kein ueberregionaler Property Manager." },
        { label: "Kosten", score: 6, maxScore: 10, reasoning: "WEG ca. 26.50 EUR + SE ca. 30.00 EUR + Stellplatz 5.00 EUR = 61.50 EUR/Monat zzgl. USt. Am oberen Rand fuer Neubau, aber durch SE-Trennung gerechtfertigt." },
        { label: "Mietgarantie", score: 8, maxScore: 10, reasoning: "Verkaeuferin garantiert 21 EUR/m2 bis 31.03.2029. Bei Nichtbelegung wird Nettomiete fuer 1 Jahr gezahlt. Gute Absicherung fuer die Anfangsphase." },
      ],
      positives: ["Untergemeinschaften je Haus — schlanke Entscheidungen", "Mietgarantie bis 2029 mit Leerstandsabsicherung"],
      negatives: ["Verwaltungskosten am oberen Rand", "Hausverwaltung noch nicht benannt"],
    },
    einkaufspreis: {
      score: 7.5,
      text: "Ab 7.200 EUR/m2 — 12% unter Berlin-Neubau-Durchschnitt, aber 50% ueber Spandauer Neubau-Einstieg. KfW 150k je WE.",
      criteria: [
        { label: "Preis vs. Berlin-Durchschnitt", score: 8, maxScore: 10, reasoning: "7.200 EUR/m2 bei Berlin-Neubau-Durchschnitt 8.220 EUR/m2 (Guthmann 2026) = ca. 12% unter Markt. Preisvorteil gegenueber Berlin-Gesamtmarkt ist real." },
        { label: "Preis vs. Spandau lokal", score: 5, maxScore: 10, reasoning: "Lokaler Spandau-Neubau-Einstieg liegt bei ca. 4.800 EUR/m2 (Immodo Marktanalyse 2025). Unser Projekt bei 7.200 EUR/m2 = 50% darueber. Der hohe KfW-Standard (EH40 QNG Plus) rechtfertigt einen Aufschlag, aber nicht in dieser Hoehe." },
        { label: "KfW-Foerderung", score: 9, maxScore: 10, reasoning: "KfW 298: bis 150.000 EUR Darlehen pro WE bei ca. 2.83% Zins. Senkt die effektive Finanzierungslast erheblich. EH40 QNG Plus qualifiziert automatisch." },
        { label: "Nebenkosten", score: 6, maxScore: 10, reasoning: "Berlin GrESt 6% + Notar/Grundbuch 2% = 8% Nebenkosten. Hoechster GrESt-Satz in Deutschland. Frisst ca. 2/3 des Preisvorteils gegenueber Berlin-Durchschnitt." },
        { label: "Mietrendite (mit Risiko-Vorbehalt)", score: 7, maxScore: 10, reasoning: "Mietgarantie 21 EUR/m2 bis 2029 ergibt 3.5% Bruttomietrendite. ABER: Spandau-Durchschnitt liegt bei 11.77 EUR/m2 (ImmoScout Q1/2026). Selbst Spandau-Toplagen erreichen nur 18.36 EUR/m2 (Immoportal). Nach Garantie-Ablauf realistisch 16-18 EUR/m2 = Rendite faellt auf ca. 2.7-3.0%." },
      ],
      positives: ["12% unter Berlin-Neubau-Durchschnitt (Guthmann 2026: 8.220 EUR/m2)", "KfW-Foerderung 150k pro WE bei 2.83% Zins", "Mietgarantie 21 EUR/m2 bis 2029 sichert Anfangsrendite"],
      negatives: ["50% ueber Spandauer Neubau-Einstieg (lokal ca. 4.800 EUR/m2)", "8% Erwerbsnebenkosten (GrESt Berlin 6%)", "Nach Mietgarantie-Ablauf 2029: realistisch 16-18 EUR/m2 statt 21 EUR/m2", "Stellplatz 29.000 EUR kommt zum Kaufpreis hinzu"],
    },
  },

  location: {
    macro: {
      city: "Berlin",
      population: 3902645,
      populationNote: "Juni 2025, Tendenz Richtung 4 Mio",
      gdp: 207.1,
      gdpNote: "Mrd. EUR (2024), Prognose +11% bis 2030",
      vacancyRate: 0.8,
      rentNewConstruction: 26.0,
      students: 200852,
      yieldResidential: 3.7,
      investmentVolume: 3.4,
      priceGrowthAvg: 2.3,
      topEmployers: [
        { name: "Deutsche Bahn", employees: "30.062" },
        { name: "Charite", employees: "23.479" },
        { name: "Tesla", employees: "12.500" },
        { name: "Siemens", employees: "k.A." },
        { name: "BER Flughafen", employees: "2.159" },
      ],
      highlights: [
        "Bevoelkerungsreichste EU-Metropole",
        "82% der Regionen: Preisanstieg durchschnittlich 2,3% (IW Koeln, Juni 2025)",
        "BIP-Wachstum ueber Bundesdurchschnitt seit 2000 (durchschnittlich 4,5% vs. 3,5%)",
        "Wohninvestments: 3,4 Mrd. EUR",
        "Groesste Staedtoekonomie Deutschlands, drittgroesste Europas",
        "~4.800 Start-ups, Hauptstadt der Gruender",
        "Hoechste Forscher- und Akademikerdichte Deutschlands",
      ],
      pressQuotes: [
        {
          source: "IW Koeln",
          text: "Nach Preisrueckgaengen bis 2024 steigen die Immobilienpreise wieder - in 82% der Regionen um durchschnittlich 2,3%",
          date: "Juni 2025",
        },
        {
          source: "Wuest Partner",
          text: "Berliner Speckguertel: Bevoelkerungszahl seit 2017 um 6,3% gestiegen, sinkende Leerstandsquoten",
          date: "Mai 2025",
        },
        {
          source: "ImmoScout24",
          text: "Anfang 2024 suchten Mieter erstmals mehr im Speckguertel (41,9%) als innerhalb der Stadtgrenzen (35,8%)",
          date: "Maerz 2024",
        },
      ],
    },

    meso: {
      district: "Spandau",
      populationDistrict: 42000,
      transitTimeCenter: {
        minutes: 7,
        mode: "S-Bahn",
        station: "Bahnhof Spandau",
      },
      carTimeCenter: { minutes: 20, distanceKm: 16 },
      timeToPotsdamMin: 45,
      keyInfrastructure: [
        { icon: "factory", text: "Siemens AG / Siemensstadt 2.0 - Innovationscampus als Zukunftstreiber" },
        { icon: "shopping-bag", text: "Spandau Arcaden - wichtigstes Einkaufszentrum" },
        { icon: "building", text: "BSH Technologiezentrum Waeschepflege - 900 Mitarbeiter" },
        { icon: "zap", text: "Heizkraftwerk Reuter (Vattenfall) - Energieversorgung seit 1931" },
        { icon: "landmark", text: "Historische Altstadt mit St.-Nikolai-Kirche" },
        { icon: "castle", text: "Zitadelle Spandau" },
        { icon: "waves", text: "Havel-Naehe: hoher Freizeit- und Naturwert" },
        { icon: "train", text: "DB-Ausbau noerdliche Bahnstrecke (zusaetzliches Gleis geplant)" },
      ],
      quote: {
        text: "Wer in Spandau wohnt, hat das Gefuehl in einem ruhigen, naturnahen Umfeld zu wohnen und gleichzeitig mitten in der Berliner Metropolregion zuhause zu sein.",
        source: "Expose Spandauer Tor",
      },
      bodenrichtwertMapFile: "Bodenrichtwerkarte_Wohnen_09.07.25.png",
    },

    micro: {
      plotSizeSqm: 16646,
      flurstuecke: "Flur 1, Flurstueck 1393 (ca. 9.796 m2) + 1391 (ca. 6.850 m2)",
      grundbuchBelastungen: 13,
      pois: [
        {
          category: "OePNV",
          items: ["Bahnhof Spandau (S-Bahn, RE, ICE, U7)"],
        },
        {
          category: "Einkauf",
          items: ["Spandau Arcaden", "ALDI", "Kaufland", "Lidl", "GALERIA Berlin Spandau"],
        },
        {
          category: "Gastronomie",
          items: ["KAFFEE 26", "Chettinad", "Romiosini bei Achilles", "Grand Gala"],
        },
        {
          category: "Oeffentlich",
          items: [
            "Rathaus Spandau",
            "Amtsgericht Spandau",
            "DRK Kreisverband Spandau eV",
            "Teiba Moschee",
          ],
        },
        {
          category: "Auto & Service",
          items: [
            "Audi Zentrum Berlin-Spandau",
            "Mercedes-Benz Niederlassung",
            "DEKRA Automobil",
            "CAR ROYAL",
            "MKK Autoservice",
            "BSR Recyclinghof",
          ],
        },
        {
          category: "Fitness & Freizeit",
          items: ["McFIT Fitnessstudio", "Copyshop Spandau"],
        },
      ],
      transitStops: [
        {
          name: "Bahnhof Spandau",
          lines: "S3, S9, RE2, RE4, RE6, RB10, RB13, RB14",
          walkMin: 8,
        },
      ],
      risks: [
        {
          type: "Schienenverkehr",
          description:
            "DB InfraGo plant zusaetzliches Gleis noerdlich des Grundstuecks. 5m Wartungsweg am noerdlichen Grundstuecksrand eingeplant. Erhoehtes Zugaufkommen moeglich.",
          mitigation:
            "Schallschutz nach DIN 4109-1:2018-01 (Mindestanforderungen). Mieter muessen ueber Immissionen schriftlich aufgeklaert werden (Kaufvertrag).",
        },
      ],
    },
  },

  mabvSchedule: [
    { nr: 1, abschnitt: "Beginn Erdarbeiten", monat: 0, prozent: 30 },
    { nr: 2, abschnitt: "Rohbau inkl. Zimmererarbeiten", monat: 5, prozent: 28 },
    { nr: 3, abschnitt: "Dachflaechen und Dachrinnen", monat: 6, prozent: 5.6 },
    { nr: 4, abschnitt: "Rohinstallation Heizung", monat: 7, prozent: 2.1 },
    { nr: 5, abschnitt: "Rohinstallation Sanitaer", monat: 7, prozent: 2.1 },
    { nr: 6, abschnitt: "Rohinstallation Elektro", monat: 7, prozent: 2.1 },
    { nr: 7, abschnitt: "Fenstereinbau inkl. Verglasung", monat: 8, prozent: 7.0 },
    { nr: 8, abschnitt: "Innenputz", monat: 10, prozent: 4.2 },
    { nr: 9, abschnitt: "Estrich", monat: 11, prozent: 2.1 },
    { nr: 10, abschnitt: "Fliesenarbeiten", monat: 13, prozent: 2.8 },
    { nr: 11, abschnitt: "Bezugsfertigkeit / Uebergabe", monat: 16, prozent: 8.4 },
    { nr: 12, abschnitt: "Fassadenarbeiten", monat: 17, prozent: 2.1 },
    { nr: 13, abschnitt: "Vollstaendige Fertigstellung", monat: 18, prozent: 3.5 },
  ],
  videoUrl: "https://minio.kailohmann.de/immo-assets/spandauer-tor/video.mp4",
}

// ─── Registry aller Beratungsprojekte ───────────────────────────

export const BERATUNG_PROJEKTE: BeratungProjectData[] = [
  SPANDAUER_TOR_BERATUNG,
]

export function getBeratungProject(slug: string): BeratungProjectData | undefined {
  return BERATUNG_PROJEKTE.find((p) => p.slug === slug)
}
