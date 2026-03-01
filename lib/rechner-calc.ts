import type { ProjectData, CalcResult, YearResult } from "./rechner-types"

// ─── Helpers ──────────────────────────────────────────────────────
export const fmt = (v: number, d = 0): string => {
  const n = Number(v) || 0
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}
export const eur = (v: number, d = 0): string => `${fmt(v, d)} \u20AC`
export const pct = (v: number): string => `${fmt(v, 2)} %`

// ─── Tax calculation (simplified German income tax 2025) ─────────
function calcTax(
  income: number,
  married: number,
  kirchePct: number
): { tax: number; soli: number; kirche: number; total: number } {
  const z = married === 2 ? income / 2 : income
  let tax: number
  if (z <= 11784) tax = 0
  else if (z <= 17005) {
    const y = (z - 11784) / 10000
    tax = (922.98 * y + 1400) * y
  } else if (z <= 66760) {
    const y = (z - 17005) / 10000
    tax = (181.19 * y + 2397) * y + 1025.38
  } else if (z <= 277825) tax = 0.42 * z - 10602.13
  else tax = 0.45 * z - 18936.88
  if (married === 2) tax *= 2
  const soli =
    tax > 18130
      ? tax * 0.055
      : tax > 16956
        ? (tax - 16956) * 0.119
        : 0
  const kirche = tax * (kirchePct / 100)
  return { tax, soli, kirche, total: tax + soli + kirche }
}

export function calcMarginalRate(
  income: number,
  married: number,
  kirchePct: number
): number {
  const t1 = calcTax(income, married, kirchePct).total
  const t2 = calcTax(income + 1000, married, kirchePct).total
  return ((t2 - t1) / 1000) * 100
}

// ─── Main calculation ────────────────────────────────────────────
export function calculate(data: ProjectData): CalcResult {
  const {
    wfl,
    kaufpreis,
    grundstueck,
    stellplatz,
    gestPct,
    notarPct,
    grundschuldPct,
    bauzeitZinsPct,
    mieteQm,
    mieteStellplatz,
    inflation,
    eigenkapital,
    darlehen1,
    zins1,
    tilgung1,
    tilgungsfrei1,
    darlehen2,
    zins2,
    tilgung2,
    married,
    einkommen,
    kirche,
    verwaltung,
  } = data

  const gesamtKP = kaufpreis + stellplatz
  const gestBetrag = (gesamtKP * gestPct) / 100
  const notarBetrag = (gesamtKP * notarPct) / 100
  const grundschuldBetrag = (gesamtKP * grundschuldPct) / 100
  const bauzeitZinsen = (gesamtKP * bauzeitZinsPct) / 100
  const nebenkosten = gestBetrag + notarBetrag + grundschuldBetrag
  const nkGesamt = nebenkosten + bauzeitZinsen
  const gesamtInvest = gesamtKP + nkGesamt

  // Gebaeudewert fuer AfA
  const gebaeudeWert = kaufpreis - grundstueck + stellplatz

  // Miete Jahr 1
  const mieteJahr = (wfl * mieteQm + mieteStellplatz) * 12

  // Marginalsteuersatz
  const kirchePct = kirche === 0 ? 0 : kirche === 1 ? 8 : 9
  const marginalRate = calcMarginalRate(einkommen, married, kirchePct)

  // Einmalige Werbungskosten
  const einmaligeWK = nkGesamt

  // Sonder-AfA
  const sonderAfaBasis =
    Math.min(4000, (kaufpreis - grundstueck) / wfl) * wfl

  // 10-Jahres-Verlauf
  let restschuld1 = darlehen1
  let restschuld2 = darlehen2
  let restwertDegr = gebaeudeWert
  const jahre: YearResult[] = []
  let kumSteuer = 0
  let kumTilgung = 0

  for (let j = 1; j <= 10; j++) {
    const mieteFaktor =
      j <= 3 ? 1 : Math.pow(1 + inflation / 100, j - 3)
    const mieteJ = mieteJahr * mieteFaktor

    const zinsJ1 = (restschuld1 * zins1) / 100
    const tilgJ1 =
      j <= tilgungsfrei1 ? 0 : (restschuld1 * tilgung1) / 100

    const zinsJ2 = (restschuld2 * zins2) / 100
    const tilgJ2 = (restschuld2 * tilgung2) / 100

    const zinsenGesamt = zinsJ1 + zinsJ2
    const tilgungGesamt = tilgJ1 + tilgJ2

    // AfA degressiv (5% vom Restwert)
    const afaDegr = restwertDegr * 0.05
    restwertDegr -= afaDegr

    // Sonder-AfA §7b (4 Jahre)
    const afaSonder = j <= 4 ? sonderAfaBasis * 0.05 : 0

    // Einmalige WK nur Jahr 1
    const einmalig = j === 1 ? einmaligeWK : 0

    const instandhaltung = gebaeudeWert * 0.00036 * 12

    // Steuerliches Ergebnis
    const steuerErgebnis =
      mieteJ -
      zinsenGesamt -
      verwaltung -
      einmalig -
      afaDegr -
      afaSonder
    const steuerWirkung = (steuerErgebnis * marginalRate) / 100

    // Cashflow
    const ueberschuss =
      mieteJ +
      steuerWirkung -
      (zinsJ1 +
        tilgJ1 +
        zinsJ2 +
        tilgJ2 +
        verwaltung +
        instandhaltung)

    restschuld1 -= tilgJ1
    restschuld2 -= tilgJ2
    kumSteuer += Math.abs(steuerWirkung)
    kumTilgung += tilgungGesamt

    jahre.push({
      j,
      miete: mieteJ,
      zinsen: zinsenGesamt,
      tilgung: tilgungGesamt,
      rate1: zinsJ1 + tilgJ1,
      rate2: zinsJ2 + tilgJ2,
      restschuld1,
      restschuld2,
      restschuldGesamt: restschuld1 + restschuld2,
      afaDegr,
      afaSonder,
      einmalig,
      steuerErgebnis,
      steuerWirkung,
      verwaltung,
      instandhaltung,
      ueberschuss,
    })
  }

  // Ergebnis Jahr 1
  const j1 = jahre[0]
  const aufwandJ1 =
    j1.miete +
    j1.steuerWirkung -
    (j1.rate1 + j1.rate2 + j1.verwaltung + j1.instandhaltung)
  const aufwandMonat = aufwandJ1 / 12

  // Renditeberechnung
  const restschuldEnde = jahre[9].restschuldGesamt
  const wertsteigerung =
    gesamtKP * Math.pow(1 + inflation / 100, 10)
  const vermoegenEnde = wertsteigerung - restschuldEnde
  const gewinn = vermoegenEnde
  const rendite = eigenkapital > 0 ? (gewinn / eigenkapital) * 100 : 0

  // Durchschnittlicher monatlicher Aufwand ueber 10 Jahre
  let totalCashflow = 0
  for (const jj of jahre) {
    totalCashflow +=
      jj.miete + jj.steuerWirkung - (jj.rate1 + jj.rate2 + jj.verwaltung)
  }
  const avgMonat = totalCashflow / 120

  return {
    gesamtKP,
    nebenkosten,
    nkGesamt,
    gesamtInvest,
    gebaeudeWert,
    mieteJahr,
    marginalRate,
    einmaligeWK,
    sonderAfaBasis,
    gestBetrag,
    notarBetrag,
    grundschuldBetrag,
    bauzeitZinsen,
    jahre,
    j1,
    aufwandJ1,
    aufwandMonat,
    restschuldEnde,
    wertsteigerung,
    vermoegenEnde,
    gewinn,
    rendite,
    kumSteuer,
    kumTilgung,
    avgMonat,
  }
}

// ─── Sharing: encode/decode params to URL ────────────────────────
export function encodeProjectToParams(data: ProjectData): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(data)) {
    params.set(key, String(value))
  }
  return params.toString()
}

export function decodeParamsToProject(
  params: URLSearchParams
): Partial<ProjectData> {
  const result: Record<string, unknown> = {}
  const stringKeys = ["projektName", "darlehen1Label", "darlehen2Label"]
  params.forEach((value, key) => {
    if (stringKeys.includes(key)) {
      result[key] = value
    } else {
      const num = Number(value)
      if (!isNaN(num)) {
        result[key] = num
      } else {
        result[key] = value
      }
    }
  })
  return result as Partial<ProjectData>
}
