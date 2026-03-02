"use client"

import { useState, useCallback } from "react"
import type { AdvisorProfile } from "@/lib/advisor"

interface Props {
  email?: string
  name?: string
  onComplete: (profile: Omit<AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">) => void
}

export function Onboarding({ email, name, onComplete }: Props) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Pre-fill from Authentik session
  const nameParts = (name || "").split(" ")
  const [firstName, setFirstName] = useState(nameParts[0] || "")
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "")
  const [emailField, setEmailField] = useState(email || "")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [zip, setZip] = useState("")
  const [city, setCity] = useState("")

  const canProceed1 = firstName.trim() && lastName.trim() && emailField.trim()
  const canProceed2 = phone.trim() && street.trim() && zip.trim() && city.trim()

  const handleSubmit = useCallback(async () => {
    setSaving(true)
    await onComplete({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailField.trim(),
      phone: phone.trim(),
      street: street.trim(),
      zip: zip.trim(),
      city: city.trim(),
    })
    setSaving(false)
  }, [firstName, lastName, emailField, phone, street, zip, city, onComplete])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-lg px-6">
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
              Willkommen beim Kapitalanlage-Rechner
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "Bitte vervollst\u00E4ndige dein Beraterprofil. Diese Daten erscheinen auf deinen PDF-Berechnungen."
                : "Noch deine Kontaktadresse \u2013 dann kann es losgehen."}
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1 font-mono">Vorname</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                    className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1 font-mono">Nachname</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1 font-mono">E-Mail</label>
                <input
                  type="email"
                  value={emailField}
                  onChange={(e) => setEmailField(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1 font-mono">Telefon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 ..."
                  className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed1}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Weiter
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1 font-mono">{`Stra\u00DFe + Hausnummer`}</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  autoFocus
                  className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1 font-mono">PLZ</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    maxLength={5}
                    className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground mb-1 font-mono">Ort</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="h-11 px-6 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {`Zur\u00FCck`}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed2 || saving}
                  className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? "Wird gespeichert..." : "Profil speichern & starten"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          Diese Daten werden f\u00FCr den PDF-Export und dein Beraterprofil gespeichert.
        </p>
      </div>
    </div>
  )
}
