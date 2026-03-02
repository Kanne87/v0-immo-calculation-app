import type { ProjectData, CalcResult } from "./rechner-types"
import type { AdvisorProfile } from "./advisor"
import { fmt, eur, pct } from "./rechner-calc"

export async function generatePdf(
  data: ProjectData,
  calc: CalcResult,
  advisor?: AdvisorProfile
) {
  const { default: jsPDF } = await import("jspdf")

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
  const pw = 210
  const margin = 20
  const cw = pw - 2 * margin
  let y = 0

  const gold: [number, number, number] = [197, 163, 85]
  const dark: [number, number, number] = [10, 10, 20]
  const text: [number, number, number] = [224, 224, 240]
  const dimmed: [number, number, number] = [138, 138, 154]
  const negative: [number, number, number] = [224, 112, 112]
  const cardBg: [number, number, number] = [18, 18, 31]

  function newPage() {
    doc.addPage()
    y = margin
    drawFooter()
  }

  function drawFooter() {
    doc.setFontSize(7)
    doc.setTextColor(...dimmed)
    doc.text(
      "Hinweis: Diese Berechnung dient der Orientierung und stellt keine Steuer- oder Finanzberatung dar.",
      margin,
      280
    )
    doc.text(
      "Steuerliche Auswirkungen sind individuell durch einen Steuerberater zu pruefen. Alle Angaben ohne Gewaehr.",
      margin,
      284
    )

    // Advisor contact in footer
    if (advisor) {
      doc.setFontSize(7)
      doc.setTextColor(...gold)
      const advisorLine = `${advisor.firstName} ${advisor.lastName} | ${advisor.phone} | ${advisor.email}`
      doc.text(advisorLine, pw - margin, 280, { align: "right" })
      const addressLine = `${advisor.street}, ${advisor.zip} ${advisor.city}`
      doc.text(addressLine, pw - margin, 284, { align: "right" })
    }
  }

  function heading(text: string) {
    doc.setFontSize(14)
    doc.setTextColor(...gold)
    doc.text(text, margin, y)
    y += 8
  }

  function subheading(text: string) {
    doc.setFontSize(9)
    doc.setTextColor(...dimmed)
    doc.text(text, margin, y)
    y += 6
  }

  function row(label: string, value: string, opts?: { bold?: boolean; highlight?: boolean; neg?: boolean }) {
    doc.setFontSize(9)
    doc.setTextColor(...(opts?.highlight ? gold : opts?.neg ? negative : opts?.bold ? text : dimmed))
    doc.text(label, margin + 2, y)
    doc.text(value, pw - margin - 2, y, { align: "right" })
    y += 5
  }

  function divider() {
    doc.setDrawColor(42, 42, 62)
    doc.line(margin, y, pw - margin, y)
    y += 3
  }

  function goldDivider() {
    doc.setDrawColor(...gold)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pw - margin, y)
    doc.setLineWidth(0.2)
    y += 4
  }

  // ─── PAGE 1: Cover + Objekt ────────────────────────────────────
  doc.setFillColor(...dark)
  doc.rect(0, 0, pw, 297, "F")
  drawFooter()

  // Header bar
  doc.setFillColor(...cardBg)
  doc.rect(0, 0, pw, 50, "F")
  doc.setFontSize(8)
  doc.setTextColor(...gold)
  doc.text("KAPITALANLAGE-RECHNER PRO", margin, 15)
  doc.setFontSize(18)
  doc.setTextColor(...text)
  doc.text(data.projektName, margin, 28)
  doc.setFontSize(9)
  doc.setTextColor(...dimmed)
  const today = new Date().toLocaleDateString("de-DE")
  doc.text(`Erstellt am ${today}`, margin, 36)

  // Advisor info in header
  if (advisor) {
    doc.setFontSize(9)
    doc.setTextColor(...text)
    doc.text(`${advisor.firstName} ${advisor.lastName}`, pw - margin, 15, { align: "right" })
    doc.setFontSize(8)
    doc.setTextColor(...dimmed)
    doc.text(advisor.phone, pw - margin, 21, { align: "right" })
    doc.text(advisor.email, pw - margin, 26, { align: "right" })
  } else {
    doc.text("Immobilien | KfW | Sonder-AfA", pw - margin, 36, { align: "right" })
  }

  y = 60

  heading("Objektdaten")
  row("Wohnflaeche", `${fmt(data.wfl, 2)} m2`)
  row("BGF", `${fmt(data.bgf, 2)} m2`)
  row("Kaufpreis Wohnung", eur(data.kaufpreis))
  row("davon Grundstueck", eur(data.grundstueck))
  row("Stellplatz", eur(data.stellplatz))
  row("Kaufpreis/m2", `${eur((data.kaufpreis + data.stellplatz) / data.wfl, 0)}/m2`, { bold: true })
  y += 4

  heading("Kaufnebenkosten")
  row("Grunderwerbsteuer", eur(calc.gestBetrag))
  row("Notar + Grundbuch", eur(calc.notarBetrag))
  row("Grundschuldgebuehren", eur(calc.grundschuldBetrag))
  row("Bauzeitzinsen", eur(calc.bauzeitZinsen))
  divider()
  row("Kaufnebenkosten gesamt", eur(calc.nkGesamt), { bold: true })
  row("GESAMTINVESTITION", eur(calc.gesamtInvest), { highlight: true })
  y += 4

  heading("Miete")
  row("Kaltmiete/m2", `${fmt(data.mieteQm, 2)} EUR/m2`)
  row("Stellplatz/Monat", eur(data.mieteStellplatz))
  row("Inflation p.a.", `${fmt(data.inflation, 1)} %`)
  row("Jahreskaltmiete", eur(calc.mieteJahr), { highlight: true })
  y += 4

  heading("Finanzierung")
  row("Eigenkapital", eur(data.eigenkapital), { bold: true })
  y += 2
  subheading(`Darlehen 1: ${data.darlehen1Label}`)
  row("Betrag", eur(data.darlehen1))
  row("Zinssatz", `${fmt(data.zins1, 2)} %`)
  row("Tilgung", `${fmt(data.tilgung1, 2)} %`)
  row("Zinsbindung", `${data.zinsbindung1} Jahre`)
  if (data.tilgungsfrei1 > 0) row("Tilgungsfreie Jahre", `${data.tilgungsfrei1}`)
  y += 2
  subheading(`Darlehen 2: ${data.darlehen2Label}`)
  row("Betrag", eur(data.darlehen2))
  row("Zinssatz", `${fmt(data.zins2, 2)} %`)
  row("Tilgung", `${fmt(data.tilgung2, 2)} %`)
  row("Zinsbindung", `${data.zinsbindung2} Jahre`)
  y += 2
  row("Grenzsteuersatz", pct(calc.marginalRate), { highlight: true })

  // ─── PAGE 2: Ergebnis Jahr 1 ──────────────────────────────────
  newPage()
  doc.setFillColor(...dark)
  doc.rect(0, 0, pw, 297, "F")
  drawFooter()
  y = margin

  const isUeberschuss = calc.aufwandJ1 >= 0
  const steuerErsparnis = Math.abs(calc.j1.steuerWirkung)

  heading("Einkuenfte V+V (Jahr 1)")
  row("Mieteinnahmen", `+ ${eur(calc.j1.miete)}`)
  row("Zinsen", `- ${eur(calc.j1.zinsen)}`, { neg: true })
  row("Verwaltung", `- ${eur(calc.j1.verwaltung)}`, { neg: true })
  row("Einmalige Werbungskosten", `- ${eur(calc.j1.einmalig)}`, { neg: true })
  row("AfA degressiv (5%)", `- ${eur(calc.j1.afaDegr)}`, { neg: true })
  if (calc.sonder7bBerechtigt) {
    row("Sonder-AfA 7b (5%)", `- ${eur(calc.j1.afaSonder)}`, { neg: true })
  } else {
    row("Sonder-AfA 7b", "entfaellt (Baukostenobergrenze)")
  }
  divider()
  row("Steuerliches Ergebnis", eur(calc.j1.steuerErgebnis), { bold: true })
  row(
    calc.j1.steuerWirkung < 0 ? "Steuererstattung" : "Steuerlast",
    eur(steuerErsparnis),
    { highlight: true }
  )
  y += 8

  heading("Cashflow (Jahr 1)")
  subheading("EINNAHMEN")
  row("Kaltmiete", `+ ${eur(calc.mieteJahr)}`)
  row("Steuererstattung", `+ ${eur(steuerErsparnis)}`)
  divider()
  subheading("AUSGABEN")
  row("Rate Darlehen 1", `- ${eur(calc.j1.rate1)}`)
  row("Rate Darlehen 2", `- ${eur(calc.j1.rate2)}`)
  row("Verwaltung", `- ${eur(calc.j1.verwaltung)}`)
  row("Instandhaltung", `- ${eur(calc.gebaeudeWert * 0.00036 * 12)}`)
  goldDivider()
  row("Cashflow p.a.", `${isUeberschuss ? "+ " : ""}${eur(calc.aufwandJ1)}`, { bold: true })
  row(
    isUeberschuss ? "UEBERSCHUSS PRO MONAT" : "ZUSCHUSS PRO MONAT",
    `${isUeberschuss ? "+ " : ""}${eur(calc.aufwandMonat, 2)}`,
    { highlight: true }
  )

  // ─── PAGE 3: 10-Jahres-Verlauf ────────────────────────────────
  newPage()
  doc.setFillColor(...dark)
  doc.rect(0, 0, pw, 297, "F")
  drawFooter()
  y = margin

  heading("10-Jahres-Verlauf")
  y += 2

  const cols = ["Jahr", "Miete", "AfA ges.", "Steuerl.", "Steuerwirk.", "Restschuld"]
  const colW = [15, 28, 28, 28, 28, 35]
  let cx = margin

  doc.setFillColor(26, 26, 46)
  doc.rect(margin, y - 4, cw, 7, "F")
  doc.setFontSize(7)
  doc.setTextColor(...gold)
  cols.forEach((c, i) => {
    doc.text(c, cx + (i === 0 ? 2 : colW[i] - 2), y, {
      align: i === 0 ? "left" : "right",
    })
    cx += colW[i]
  })
  y += 6

  calc.jahre.forEach((j, idx) => {
    cx = margin
    doc.setFontSize(8)

    if (idx % 2 === 1) {
      doc.setFillColor(14, 14, 26)
      doc.rect(margin, y - 3.5, cw, 5.5, "F")
    }

    const vals = [
      String(j.j),
      fmt(j.miete),
      fmt(j.afaDegr + j.afaSonder),
      fmt(j.steuerErgebnis),
      fmt(j.steuerWirkung),
      fmt(j.restschuldGesamt),
    ]

    vals.forEach((v, i) => {
      if (i === 3) {
        doc.setTextColor(...(j.steuerErgebnis < 0 ? negative : [112, 224, 112] as [number, number, number]))
      } else if (i === 4) {
        doc.setTextColor(...(j.steuerWirkung < 0 ? gold : dimmed))
      } else if (i === 5) {
        doc.setTextColor(...text)
      } else {
        doc.setTextColor(...dimmed)
      }
      doc.text(v, cx + (i === 0 ? 2 : colW[i] - 2), y, {
        align: i === 0 ? "left" : "right",
      })
      cx += colW[i]
    })
    y += 5.5
  })

  y += 6
  row("Kum. Steuerersparnis (10 J.)", eur(calc.kumSteuer), { highlight: true })
  row("Kum. Tilgung (10 J.)", eur(calc.kumTilgung), { bold: true })
  row("Restschuld nach 10 Jahren", eur(calc.restschuldEnde), { bold: true })

  // ─── PAGE 4: Vermoegensbildung ────────────────────────────────
  newPage()
  doc.setFillColor(...dark)
  doc.rect(0, 0, pw, 297, "F")
  drawFooter()
  y = margin

  const isAvgUeberschuss = calc.avgMonat >= 0

  heading("Vermoegensbildung (10 Jahre)")
  y += 6

  row("Eingesetztes Eigenkapital", eur(data.eigenkapital), { bold: true })
  row(
    isAvgUeberschuss ? "Durchschn. mtl. Ueberschuss" : "Durchschn. mtl. Zuschuss",
    `${isAvgUeberschuss ? "+ " : ""}${eur(calc.avgMonat, 2)}`,
    { bold: true }
  )
  divider()
  row("Immobilienwert (10 J.)", eur(calc.wertsteigerung))
  row("Restschuld (10 J.)", `- ${eur(calc.restschuldEnde)}`, { neg: true })
  divider()
  row("Moeglicher steuerfreier Gewinn", eur(calc.vermoegenEnde), { highlight: true })
  row("davon Steuerersparnis", eur(calc.kumSteuer))
  goldDivider()
  row("RENDITE NACH STEUER", pct(calc.rendite), { highlight: true })

  // Bar visualization
  y += 12
  subheading("Vergleich: Heute vs. In 10 Jahren")
  y += 6

  const barMaxVal = Math.max(calc.gesamtKP, calc.wertsteigerung, data.darlehen1 + data.darlehen2)
  const barWidth = 60

  function drawBar(label: string, value: number, color: [number, number, number]) {
    doc.setFontSize(8)
    doc.setTextColor(...dimmed)
    doc.text(label, margin, y)
    const w = Math.max(2, (value / barMaxVal) * barWidth)
    doc.setFillColor(...color)
    doc.roundedRect(margin + 55, y - 3, w, 4, 1, 1, "F")
    doc.setTextColor(...text)
    doc.text(eur(value), margin + 55 + w + 3, y)
    y += 7
  }

  subheading("Heute")
  y += 2
  drawBar("Immobilienwert", calc.gesamtKP, [42, 74, 138])
  drawBar("Restschuld", data.darlehen1 + data.darlehen2, [138, 42, 42])
  y += 4
  subheading("In 10 Jahren")
  y += 2
  drawBar("Immobilienwert", calc.wertsteigerung, [58, 90, 170])
  drawBar("Restschuld", calc.restschuldEnde, [170, 58, 58])
  drawBar("Vermoegen", calc.vermoegenEnde, [74, 138, 74])

  doc.save(`${data.projektName.replace(/\s+/g, "-")}-Analyse.pdf`)
}
