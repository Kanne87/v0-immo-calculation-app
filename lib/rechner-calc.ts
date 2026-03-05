import type { ProjectData, CalcResult, YearResult } from "./rechner-types"
import { MABV_STUFEN } from "./rechner-types"

// ─── Helpers ────────────────────────────────────────────────────────────
export const fmt = (v: number, d = 0): string => {
  const n = Number(v) || 0
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}
export const eur = (v: number, d = 0): string => `${fmt(v, d)} €`
export const pct = (v: number): string => `${fmt(v, 2)} %`

// ─── IRR via Newton-Raphson ──────────
function calcIRR(cashflows: number[], guess = 0.1, maxIter = 200, tol = 1e-7): number | null {
  const hasNeg = cashflows.some(cf => cf < 0)
  const hasPos = cashflows.some(cf => cf > 0)
  if (!hasNeg || !hasPos) return null

  let rate = guess
  for (let i = 0; i < maxIter; i++) {
    let npv = 0
    let dnpv = 0
    for (let t = 0; t < cashflows.length; t++) {
      const discountFactor = Math.pow(1 + rate, t)
      if (discountFactor === 0) return null
      npv += cashflows[t] / discountFactor
      if (t > 0) dnpv -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1)
    }
    if (Math.abs(dnpv) < 1e-14) return calcIRRBisection(cashflows)
    const newRate = rate - npv / dnpv
    if (Math.abs(newRate - rate) < tol) return newRate * 100
    rate = newRate
    if (rate < -0.99 || rate > 100 || !isFinite(rate)) return calcIRRBisection(cashflows)
  }
  return calcIRRBisection(cashflows)
}

function calcIRRBisection(cashflows: number[]): number | null {
  let lo = -0.5
  let hi = 5.0
  const maxIter = 300
  const tol = 1e-7
  const npvAt = (r: number) => cashflows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + r, t), 0)
  if (npvAt(lo) * npvAt(hi) > 0) {
    hi = 20.0
    if (npvAt(lo) * npvAt(hi) > 0) return null
  }
  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2
    const npvMid = npvAt(mid)
    if (Math.abs(npvMid) < tol || (hi - lo) / 2 < tol) return mid * 100
    if (npvAt(lo) * npvMid < 0) hi = mid
    else lo = mid
  }
  return null
}

// ─── Tax ─────────────────────────────────────────────────────
function calcTax(income: number, married: number, kirchePct: number) {
  const z = married === 2 ? income / 2 : income
  let tax: number
  if (z <= 11784) tax = 0
  else if (z <= 17005) { const y = (z - 11784) / 10000; tax = (922.98 * y + 1400) * y }
  else if (z <= 66760) { const y = (z - 17005) / 10000; tax = (181.19 * y + 2397) * y + 1025.38 }
  else if (z <= 277825) tax = 0.42 * z - 10602.13
  else tax = 0.45 * z - 18936.88
  if (married === 2) tax *= 2
  const soli = tax > 18130 ? tax * 0.055 : tax > 16956 ? (tax - 16956) * 0.119 : 0
  const kirche = tax * (kirchePct / 100)
  return { tax, soli, kirche, total: tax + soli + kirche }
}

export function calcMarginalRate(income: number, married: number, kirchePct: number): number {
  const t1 = calcTax(income, married, kirchePct).total
  const t2 = calcTax(income + 1000, married, kirchePct).total
  return ((t2 - t1) / 1000) * 100
}

// ─── Bauzeitzinsen nach MaBV ─────────────────────────────────
export function calcBauzeitZinsen(
  darlehenGesamt: number, darlehen1: number, zins1: number,
  darlehen2: number, zins2: number, baubeginn: string, fertigstellung: string
): { zinsen: number; monate: number } {
  const start = new Date(baubeginn)
  const fertig = new Date(fertigstellung)
  const diffMs = fertig.getTime() - start.getTime()
  const monate = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44)))
  const gewZins = darlehenGesamt > 0 ? (darlehen1 * zins1 + darlehen2 * zins2) / darlehenGesamt / 100 : 0
  const anzahlStufen = MABV_STUFEN.length
  const intervall = monate / anzahlStufen
  let zinsenGesamt = 0
  for (let i = 0; i < anzahlStufen; i++) {
    const auszahlungsBetrag = darlehenGesamt * MABV_STUFEN[i].pct
    const restMonate = monate - (i + 1) * intervall
    if (restMonate > 0) zinsenGesamt += auszahlungsBetrag * gewZins * (restMonate / 12)
  }
  return { zinsen: Math.round(zinsenGesamt), monate }
}

// ─── Main calculation ────────────────────────────────────────────
export function calculate(data: ProjectData): CalcResult {
  const {
    wfl, bgf, kaufpreis, grundstueck, stellplatz, gestPct, notarPct, grundschuldPct,
    baubeginn, fertigstellung, mieteQm, mieteStellplatz, inflation,
    eigenkapital, darlehen1, zins1, tilgung1, tilgungsfrei1,
    darlehen2, zins2, tilgung2, married, einkommen, kirche, verwaltung,
  } = data

  const gesamtKP = kaufpreis + stellplatz
  const gestBetrag = (gesamtKP * gestPct) / 100
  const notarBetrag = (gesamtKP * notarPct) / 100
  const grundschuldBetrag = (gesamtKP * grundschuldPct) / 100
  const darlehenGesamt = darlehen1 + darlehen2
  const bz = calcBauzeitZinsen(darlehenGesamt, darlehen1, zins1, darlehen2, zins2, baubeginn, fertigstellung)
  const bauzeitZinsen = bz.zinsen
  const bauzeitMonate = bz.monate
  const nebenkosten = gestBetrag + notarBetrag + grundschuldBetrag
  const nkGesamt = nebenkosten + bauzeitZinsen
  const gesamtInvest = gesamtKP + nkGesamt
  const anschaffungsNK = gestBetrag + notarBetrag + bauzeitZinsen
  const gebaeudeWert = kaufpreis - grundstueck + stellplatz + anschaffungsNK
  const einmaligeWK = grundschuldBetrag
  const mieteJahr = (wfl * mieteQm + mieteStellplatz) * 12
  const kirchePct = kirche === 0 ? 0 : kirche === 1 ? 8 : 9
  const marginalRate = calcMarginalRate(einkommen, married, kirchePct)
  const gebaeudeKostenProQmBGF = bgf > 0 ? (kaufpreis - grundstueck) / bgf : 0
  const sonder7bBerechtigt = gebaeudeKostenProQmBGF <= 5200
  const sonderAfaBasis = sonder7bBerechtigt ? Math.min(4000, (kaufpreis - grundstueck) / wfl) * wfl : 0

  let restschuld1 = darlehen1
  let restschuld2 = darlehen2
  let restwertDegr = gebaeudeWert
  const jahre: YearResult[] = []
  let kumSteuer = 0
  let kumTilgung = 0

  for (let j = 1; j <= 10; j++) {
    const mieteFaktor = j <= 3 ? 1 : Math.pow(1 + inflation / 100, j - 3)
    const mieteJ = mieteJahr * mieteFaktor
    const zinsJ1 = (restschuld1 * zins1) / 100
    const tilgJ1 = j <= tilgungsfrei1 ? 0 : (restschuld1 * tilgung1) / 100
    const zinsJ2 = (restschuld2 * zins2) / 100
    const tilgJ2 = (restschuld2 * tilgung2) / 100
    const zinsenGesamt = zinsJ1 + zinsJ2
    const tilgungGesamt = tilgJ1 + tilgJ2
    const afaDegr = restwertDegr * 0.05
    restwertDegr -= afaDegr
    const afaSonder = j <= 4 ? sonderAfaBasis * 0.05 : 0
    const einmalig = j === 1 ? einmaligeWK : 0
    const instandhaltung = gebaeudeWert * 0.00036 * 12
    const steuerErgebnis = mieteJ - zinsenGesamt - verwaltung - einmalig - afaDegr - afaSonder
    const steuerWirkung = (steuerErgebnis * marginalRate) / 100
    const ueberschuss = mieteJ - steuerWirkung - (zinsJ1 + tilgJ1 + zinsJ2 + tilgJ2 + verwaltung + instandhaltung)
    restschuld1 -= tilgJ1
    restschuld2 -= tilgJ2
    kumSteuer += Math.abs(steuerWirkung)
    kumTilgung += tilgungGesamt
    jahre.push({
      j, miete: mieteJ, zinsen: zinsenGesamt, tilgung: tilgungGesamt,
      rate1: zinsJ1 + tilgJ1, rate2: zinsJ2 + tilgJ2,
      restschuld1, restschuld2, restschuldGesamt: restschuld1 + restschuld2,
      afaDegr, afaSonder, einmalig, steuerErgebnis, steuerWirkung,
      verwaltung, instandhaltung, ueberschuss,
    })
  }

  const j1 = jahre[0]
  const aufwandJ1 = j1.miete - j1.steuerWirkung - (j1.rate1 + j1.rate2 + j1.verwaltung + j1.instandhaltung)
  const aufwandMonat = aufwandJ1 / 12
  const restschuldEnde = jahre[9].restschuldGesamt
  const wertsteigerung = gesamtKP * Math.pow(1 + inflation / 100, 10)
  const vermoegenEnde = wertsteigerung - restschuldEnde
  const gewinn = vermoegenEnde

  // IRR-Cashflows
  const irrCashflows: number[] = [-eigenkapital]
  for (let i = 0; i < 10; i++) {
    const cf = jahre[i].ueberschuss
    irrCashflows.push(i === 9 ? cf + vermoegenEnde : cf)
  }

  let rendite = 0
  if (eigenkapital > 0) {
    const irrResult = calcIRR(irrCashflows)
    if (irrResult !== null) {
      rendite = irrResult
    } else if (vermoegenEnde > 0) {
      rendite = (Math.pow(vermoegenEnde / eigenkapital, 1 / 10) - 1) * 100
    }
  }

  // renditeGesamt: kompoundierter IRR über 10 Jahre — konsistent mit rendite p.a.
  const renditeGesamt = (Math.pow(1 + rendite / 100, 10) - 1) * 100

  // Durchschnittlicher monatlicher Überschuss (inkl. Instandhaltung)
  const avgMonat = jahre.reduce((sum, jj) => sum + jj.ueberschuss, 0) / 120

  return {
    gesamtKP, nebenkosten, nkGesamt, gesamtInvest, gebaeudeWert, mieteJahr,
    marginalRate, einmaligeWK, sonderAfaBasis, sonder7bBerechtigt, gebaeudeKostenProQmBGF,
    gestBetrag, notarBetrag, grundschuldBetrag, bauzeitZinsen, bauzeitMonate,
    jahre, j1, aufwandJ1, aufwandMonat, restschuldEnde, wertsteigerung,
    vermoegenEnde, gewinn, rendite, renditeGesamt, kumSteuer, kumTilgung, avgMonat,
  }
}

export function encodeProjectToParams(data: ProjectData): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(data)) params.set(key, String(value))
  return params.toString()
}

export function decodeParamsToProject(params: URLSearchParams): Partial<ProjectData> {
  const result: Record<string, unknown> = {}
  const stringKeys = ["projektName", "darlehen1Label", "darlehen2Label", "baubeginn", "fertigstellung"]
  params.forEach((value, key) => {
    if (stringKeys.includes(key)) { result[key] = value }
    else { const num = Number(value); if (!isNaN(num)) result[key] = num; else result[key] = value }
  })
  return result as Partial<ProjectData>
}
