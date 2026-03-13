// ─── Beratungsstrecke: Projektdaten-Typen & Spandauer Tor ────────
// Wiederverwendbares Template: Für ein neues Projekt einfach eine
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
  flurstücke: string
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
  address: "Brunsbütteler Damm 60-80, 13581 Berlin (Spandau)",
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
      score: 7.8,
      text: "Berlin-Spandau: Bundeshauptstadt, 0.8% Leerstand, RE zum Hbf in 15 Min., Siemensstadt 2.0 als Zukunftstreiber",
      criteria: [
        { label: "Leerstandsquote", score: 10, maxScore: 10, reasoning: "0.8% Leerstand in Gesamtberlin — de facto Vollvermietung. Unter 1% gilt als Wohnungsmangel." },
        { label: "ÖPNV-Anbindung", score: 7, maxScore: 10, reasoning: "8 Min. Fußweg zum Bahnhof Spandau. Von dort: RE ca. 15-17 Min. zum Hbf (alle 20 Min.), S-Bahn ca. 30 Min. (S3/S9 über Stadtbahn), ICE ca. 7 Min. (nonstop, kein Pendler-Regelfall). U7 am Rathaus Spandau in Laufweite. Exposé-Angabe '7 Min. S-Bahn' ist unpräzise — bezieht sich auf ICE." },
        { label: "Wirtschaftskraft", score: 9, maxScore: 10, reasoning: "Berlin BIP 207 Mrd. EUR, Wachstum über Bundesdurchschnitt. Siemensstadt 2.0 als Milliardenprojekt direkt nebenan. Tesla, DB, Charite als Top-Arbeitgeber." },
        { label: "Bevölkerungsprognose", score: 8, maxScore: 10, reasoning: "Berlin wächst Richtung 4 Mio. Für Spandau erwarten Makler 2-4% Preissteigerung p.a. (Immodo Berlin, Jan 2026). Zuzug aus teureren Innenstadtbezirken treibt Nachfrage." },
        { label: "Mikrolage", score: 6, maxScore: 10, reasoning: "Brunsbütteler Damm ist Hauptverkehrsstraße. DB InfraGo plant zusätzliches Gleis nördlich des Grundstücks (bestätigt durch Grundbuch Abt. II + Exposé S.40-43). 5m Wartungsweg eingeplant. Kompensiert durch Nähe zu Spandau Arcaden und Havel." },
      ],
      positives: ["Bundeshauptstadt mit Wohnungsmangel (0.8% Leerstand)", "Siemensstadt 2.0 als Zukunftstreiber", "RE zum Hbf in 15 Min., ICE in 7 Min.", "2-4% Preissteigerungsprognose für Spandau (Makler-Konsens)"],
      negatives: ["Exposé-Angabe '7 Min. S-Bahn' unpräzise — S-Bahn braucht 30 Min.", "DB-Gleisausbau nördlich = mehr Bahnlärm (Grundbuch bestätigt)", "Spandau ist kein A-Lage-Bezirk innerhalb Berlins"],
    },
    zustand: {
      score: 9,
      text: "KfW EH40 QNG Plus Neubau, TÜV-kontrolliertes Baucontrolling, Massivbauweise, Fußbodenheizung, Aufzug",
      criteria: [
        { label: "Energiestandard", score: 10, maxScore: 10, reasoning: "KfW EH40 QNG Plus ist der höchste förderfähige Standard. Wärmepumpe, PV-Anlage, WDVS. Zukunftssicher gegen steigende Energiekosten." },
        { label: "Bauqualität", score: 9, maxScore: 10, reasoning: "Massivbauweise (Betonfertigteile + Ortbeton), TÜV-Baucontrolling. Kein Abzug für Leichtbau oder fehlende Qualitätssicherung." },
        { label: "Ausstattung", score: 9, maxScore: 10, reasoning: "Fußbodenheizung, Aufzug, Videogegensprechanlage, elektrische Rollladen, bodengleiche Duschen. Gehoben für Neubau-Kapitalanlage." },
        { label: "Bauträger-Erfahrung", score: 7, maxScore: 10, reasoning: "MAXAR AG erst seit 2021/22 aktiv, Stammkapital 50k EUR. Referenzprojekt Falkensee verkauft. Aber: Bilanzielle Überschuldung 2023 (8.84 Mio EUR). TÜV-Controlling kompensiert teilweise." },
      ],
      positives: ["Höchster KfW-Standard (EH40 QNG Plus)", "TÜV-kontrolliertes Baucontrolling", "Massivbauweise, kein Fertighaus"],
      negatives: ["Projekt noch nicht gebaut — Ausführungsqualität unbekannt", "Bauträger bilanziell dünn (50k Grundkapital)"],
    },
    grundriss: {
      score: 7.5,
      text: "Bogenförmiger Grundriss mit 6 WE/Geschoss. 1-4 Zimmer, barrierefrei, jede WE mit Abstellraum und Loggia/Terrasse.",
      criteria: [
        { label: "Raumaufteilung", score: 7, maxScore: 10, reasoning: "Offene Wohn/Ess/Koch-Bereiche, separate Schlafzimmer ab 2 Zi. Bäder innenliegend (kein Tageslicht) bei kleineren WE. 4-Zi-Eckwohnungen mit 2 Bädern gelöst." },
        { label: "Außenbereiche", score: 9, maxScore: 10, reasoning: "Konsequent: Jede WE hat Loggia, Balkon oder Terrasse. Im DG (4.OG) großzügige Dachterrassen. EG mit ebenerdigen Terrassen." },
        { label: "Flexibilität", score: 7, maxScore: 10, reasoning: "Guter Mix: 1-Zi (35-48 m2), 2-Zi (44-59 m2), 3-Zi (78-79 m2), 4-Zi (96-109 m2). Jede WE mit Abstellraum. Aber: Bogenform schränkt Möblierung stellenweise ein." },
        { label: "Belichtung", score: 7, maxScore: 10, reasoning: "Bogenform = viele WE mit guter Südost-/Südwest-Belichtung. Nordseitige WE (im oberen Bogen) weniger Sonne. Alle 1-2 Zi einseitig orientiert (keine Durchlüftung)." },
        { label: "Effizienz", score: 8, maxScore: 10, reasoning: "Kurze Flure, kompakte Erschließung über 2 Treppenhäuser + Aufzug. Wenig verlorene Fläche. Faktor BGF/Wfl ca. 1.35 — solide." },
      ],
      positives: ["Jede WE mit Abstellraum und Außenbereich", "Großzügige Dachterrassen im DG", "4-Zi mit 2 Bädern", "Effizienter Grundriss, wenig Verkehrsfläche"],
      negatives: ["Innenliegende Bäder ohne Fenster bei kleineren WE", "Bogenform schränkt Möblierung teils ein", "Einseitige Orientierung bei 1-2-Zi-WE"],
    },
    verwaltung: {
      score: 8,
      text: "Full-Service für Investoren: SE-Verwaltung übernimmt Mieterwechsel + Neuvermietung. Untergemeinschaften je Haus.",
      criteria: [
        { label: "WEG-Struktur", score: 8, maxScore: 10, reasoning: "Untergemeinschaften je Haus (10 Häuser). Entscheidungen können je Haus getroffen werden — kein 264-WE-Moloch bei Eigentümerversammlungen. Investor hat Mitsprache im überschaubaren Rahmen." },
        { label: "SE-Verwaltung (Full-Service)", score: 9, maxScore: 10, reasoning: "SE-Verwaltung kümmert sich um alles: Mieterwechsel, Neuvermietung, Mietinkasso, Nebenkostenabrechnung, Handwerkerkoordination. Der Investor muss sich um nichts kümmern — genau das ist der Anspruch der Zielgruppe. WEG- und SE-Verwaltung sauber getrennt." },
        { label: "Kosten (Preis für Service)", score: 7, maxScore: 10, reasoning: "WEG ca. 26.50 EUR + SE ca. 30.00 EUR + Stellplatz 5.00 EUR = 61.50 EUR/Monat zzgl. USt. Das ist der Preis für Full-Service-Verwaltung. Aus Investorensicht relevant: Was bleibt netto übrig? Die Kosten sind in der Musterberechnung bereits eingepreist." },
        { label: "Mietgarantie", score: 8, maxScore: 10, reasoning: "Verkäuferin garantiert 21 EUR/m2 bis 31.03.2029. Bei Nichtbelegung wird Nettomiete für 1 Jahr gezahlt. Investor trägt in der Anfangsphase kein Leerstandsrisiko." },
      ],
      positives: ["SE-Verwaltung: Full-Service bei Mieterwechsel und Neuvermietung", "Investor muss sich um nichts kümmern", "Untergemeinschaften je Haus — schlanke Entscheidungen", "Mietgarantie bis 2029 mit Leerstandsabsicherung"],
      negatives: ["Hausverwaltung noch nicht namentlich benannt"],
    },
    einkaufspreis: {
      score: 8,
      text: "Ab 7.200 EUR/m2 — 12% unter Berlin-Neubau-Durchschnitt (8.220 EUR/m2). KfW EH40 QNG Plus rechtfertigt Aufschlag gegenüber Standard-Neubau.",
      criteria: [
        { label: "Preis vs. Berlin-Neubau", score: 8, maxScore: 10, reasoning: "7.200 EUR/m2 bei Berlin-Neubau-Durchschnitt 8.220 EUR/m2 (Guthmann 2026) = ca. 12% unter Markt. Fair verglichen mit anderen KfW-EH40-Projekten: dieser Standard ist baulich teurer (Wärmepumpe, PV, WDVS, Lüftung), der Aufschlag gegenüber Standard-Neubau (ca. 4.800 EUR/m2 in Spandau) ist durch die Langlebigkeit und niedrigere Betriebskosten gerechtfertigt." },
        { label: "KfW-Förderung", score: 9, maxScore: 10, reasoning: "KfW 298: bis 150.000 EUR Darlehen pro WE bei ca. 2.83% Zins. Senkt die effektive Finanzierungslast erheblich. EH40 QNG Plus qualifiziert automatisch. Hebel: Je höher der KfW-Anteil am Gesamtdarlehen, desto größer der Zinsvorteil." },
        { label: "Nebenkosten", score: 6, maxScore: 10, reasoning: "Berlin GrESt 6% + Notar/Grundbuch 2% = 8% Nebenkosten. Höchster GrESt-Satz in Deutschland. Frisst ca. 2/3 des Preisvorteils gegenüber Berlin-Durchschnitt." },
        { label: "Mietrendite", score: 8, maxScore: 10, reasoning: "Mietgarantie 21 EUR/m2 bis 2029 ergibt 3.5% Bruttomietrendite. Nach Garantie-Ablauf: Mieter zahlt weiterhin Vertragsmiete (kein automatischer Abschlag). Bei Mieterwechsel: Mietpreisbremse greift nicht bei Neubau nach 2014, d.h. freie Preisgestaltung. Spandau-Neubau-Toplagen bei 18+ EUR/m2 (2026), mit 3-4% Mietsteigerung p.a. bis 2029 plausibel bei 20-22 EUR/m2. KfW-EH40-Standard erhoht Zahlungsbereitschaft durch niedrige Nebenkosten." },
        { label: "Langlebigkeit (EH40-Vorteil)", score: 9, maxScore: 10, reasoning: "KfW EH40 QNG Plus: Massivbauweise mit Betonfertigteilen, Wärmedämmung nach höchstem Standard, Wärmepumpe statt Gasheizung. Kein Sanierungsstau für Jahrzehnte. Energiekosten für Mieter ca. 40-50% unter Bestand. Das ist der entscheidende Hebel gegenüber Standard-Neubau: weniger Instandhaltung, längere Nutzungsdauer, kein GEG-Nachrüstungsbedarf." },
      ],
      positives: ["12% unter Berlin-Neubau-Durchschnitt (Guthmann 2026: 8.220 EUR/m2)", "KfW-Förderung 150k pro WE bei 2.83% Zins", "Mietpreisbremse greift nicht — freie Preisgestaltung bei Neuvermietung", "EH40 QNG: Kein Sanierungsstau, niedrige Betriebskosten, lange Nutzungsdauer"],
      negatives: ["8% Erwerbsnebenkosten (GrESt Berlin 6%)", "Stellplatz 29.000 EUR kommt zum Kaufpreis hinzu"],
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
        "Bevölkerungsreichste EU-Metropole",
        "82% der Regionen: Preisanstieg durchschnittlich 2,3% (IW Koeln, Juni 2025)",
        "BIP-Wachstum über Bundesdurchschnitt seit 2000 (durchschnittlich 4,5% vs. 3,5%)",
        "Wohninvestments: 3,4 Mrd. EUR",
        "Größte Städteökonomie Deutschlands, drittgroesste Europas",
        "~4.800 Start-ups, Hauptstadt der Gründer",
        "Höchste Forscher- und Akademikerdichte Deutschlands",
      ],
      pressQuotes: [
        {
          source: "IW Koeln",
          text: "Nach Preisrückgängen bis 2024 steigen die Immobilienpreise wieder - in 82% der Regionen um durchschnittlich 2,3%",
          date: "Juni 2025",
        },
        {
          source: "Wuest Partner",
          text: "Berliner Speckgürtel: Bevölkerungszahl seit 2017 um 6,3% gestiegen, sinkende Leerstandsquoten",
          date: "Mai 2025",
        },
        {
          source: "ImmoScout24",
          text: "Anfang 2024 suchten Mieter erstmals mehr im Speckgürtel (41,9%) als innerhalb der Stadtgrenzen (35,8%)",
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
        { icon: "waves", text: "Havel-Nähe: hoher Freizeit- und Naturwert" },
        { icon: "train", text: "DB-Ausbau nördliche Bahnstrecke (zusätzliches Gleis geplant)" },
      ],
      quote: {
        text: "Wer in Spandau wohnt, hat das Gefühl in einem ruhigen, naturnahen Umfeld zu wohnen und gleichzeitig mitten in der Berliner Metropolregion zuhause zu sein.",
        source: "Expose Spandauer Tor",
      },
      bodenrichtwertMapFile: "Bodenrichtwerkarte_Wohnen_09.07.25.png",
    },

    micro: {
      plotSizeSqm: 16646,
      flurstücke: "Flur 1, Flurstück 1393 (ca. 9.796 m2) + 1391 (ca. 6.850 m2)",
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
          category: "Öffentlich",
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
            "DB InfraGo plant zusätzliches Gleis nördlich des Grundstücks. 5m Wartungsweg am nördlichen Grundstücksrand eingeplant. Erhöhtes Zugaufkommen möglich.",
          mitigation:
            "Schallschutz nach DIN 4109-1:2018-01 (Mindestanforderungen). Mieter müssen über Immissionen schriftlich aufgeklärt werden (Kaufvertrag).",
        },
      ],
    },
  },

  mabvSchedule: [
    { nr: 1, abschnitt: "Beginn Erdarbeiten", monat: 0, prozent: 30 },
    { nr: 2, abschnitt: "Rohbau inkl. Zimmererarbeiten", monat: 5, prozent: 28 },
    { nr: 3, abschnitt: "Dachflächen und Dachrinnen", monat: 6, prozent: 5.6 },
    { nr: 4, abschnitt: "Rohinstallation Heizung", monat: 7, prozent: 2.1 },
    { nr: 5, abschnitt: "Rohinstallation Sanitaer", monat: 7, prozent: 2.1 },
    { nr: 6, abschnitt: "Rohinstallation Elektro", monat: 7, prozent: 2.1 },
    { nr: 7, abschnitt: "Fenstereinbau inkl. Verglasung", monat: 8, prozent: 7.0 },
    { nr: 8, abschnitt: "Innenputz", monat: 10, prozent: 4.2 },
    { nr: 9, abschnitt: "Estrich", monat: 11, prozent: 2.1 },
    { nr: 10, abschnitt: "Fliesenarbeiten", monat: 13, prozent: 2.8 },
    { nr: 11, abschnitt: "Bezugsfertigkeit / Übergabe", monat: 16, prozent: 8.4 },
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
