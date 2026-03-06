// ─── Beratungsstrecke: Projektdaten-Typen & Spandauer Tor ────────
// Wiederverwendbares Template: Fuer ein neues Projekt einfach eine
// neue Datei nach demselben Schema anlegen.

// ─── Types ───────────────────────────────────────────────────────

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
    lage: { score: number; text: string }
    zustand: { score: number; text: string }
    grundriss: { score: number; text: string }
    verwaltung: { score: number; text: string }
    einkaufspreis: { score: number; text: string }
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
      score: 8,
      text: "Berlin-Spandau: Bundeshauptstadt, 0.8% Leerstand, 7 Min. S-Bahn zum Hbf, Siemensstadt 2.0 als Zukunftstreiber",
    },
    zustand: {
      score: 9,
      text: "KfW EH40 QNG Plus Neubau, TUeV-kontrolliertes Baucontrolling, Massivbauweise, Fussbodenheizung, Aufzug",
    },
    grundriss: {
      score: 7,
      text: "1-4 Zimmer (33-109 m2), barrierefrei, Balkone/Terrassen, Abstellraeume, effiziente Grundrisse",
    },
    verwaltung: {
      score: 7,
      text: "Regionale Hausverwaltung, WEG + SE-Verwaltung, Untergemeinschaften je Haus",
    },
    einkaufspreis: {
      score: 8,
      text: "ab 7.200 EUR/m2 bei Durchschnitt Berlin-Neubau ~8.200 EUR/m2, KfW-Foerderung 150k je WE",
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
