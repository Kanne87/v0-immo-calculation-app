// ─── Freie Berechnung: Sinnvolle Vorbelegung ────────────────────
// Typische Werte für eine Neubau-Kapitalanlage in Deutschland.
// Der Berater ändert dann individuell.

import type { ProjectData } from "./rechner-types"

export function createFreeCalculationData(): ProjectData {
  return {
    projektName: "Freie Berechnung",
    wfl: 55.0,
    bgf: 72.0,
    kaufpreis: 275000,
    grundstueck: 27500,     // ca. 10% Grundstücksanteil
    stellplatz: 20000,
    gestPct: 6.0,            // Berlin/Brandenburg-typisch
    notarPct: 2.0,
    grundschuldPct: 0.5,
    baubeginn: "2026-06-01",
    fertigstellung: "2028-06-01",
    mieteQm: 14.0,           // konservativ, bundesweit realistisch
    mieteStellplatz: 60,
    inflation: 2.0,
    eigenkapital: 0,         // wird automatisch berechnet
    darlehen1Label: "KfW",
    darlehen1: 150000,
    zins1: 2.80,
    tilgung1: 1.75,
    zinsbindung1: 10,
    tilgungsfrei1: 0,
    darlehen2Label: "Hausbank",
    darlehen2: 150000,
    zins2: 3.80,
    tilgung2: 1.50,
    zinsbindung2: 10,
    married: 1,
    einkommen: 55000,
    kirche: 0,
    verwaltung: 720,          // ca. 30€/mtl. WEG + 30€/mtl. SE
  }
}
