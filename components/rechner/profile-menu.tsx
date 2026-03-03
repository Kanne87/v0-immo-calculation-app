"use client"

import { useState, useRef, useEffect } from "react"
import { User, X, Save, LogOut, Check } from "lucide-react"
import type { AdvisorProfile } from "@/lib/advisor"
import { signOut } from "next-auth/react"

interface Props {
  profile: AdvisorProfile
  onSave: (updates: Omit<AdvisorProfile, "authentikSub" | "createdAt" | "updatedAt">) => Promise<void>
}

export function ProfileMenu({ profile, onSave }: Props) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [email, setEmail] = useState(profile.email)
  const [phone, setPhone] = useState(profile.phone)
  const [street, setStreet] = useState(profile.street)
  const [zip, setZip] = useState(profile.zip)
  const [city, setCity] = useState(profile.city)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  useEffect(() => {
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setEmail(profile.email)
    setPhone(profile.phone)
    setStreet(profile.street)
    setZip(profile.zip)
    setCity(profile.city)
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    await onSave({ firstName, lastName, email, phone, street, zip, city })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()

  const inputCls = "w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-xs font-mono text-foreground outline-none focus:ring-1 focus:ring-primary"
  const labelCls = "block text-[9px] text-subtle font-mono uppercase tracking-wider mb-0.5"

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-mono bg-secondary text-dimmed border border-border hover:text-foreground hover:border-primary/30 transition-all"
      >
        <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[8px] font-bold">
          {initials || <User className="w-3 h-3" />}
        </div>
        <span className="hidden sm:inline">{profile.firstName}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-2xl z-50">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
            <span className="text-xs font-serif font-semibold text-foreground">Beraterprofil</span>
            <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-secondary text-subtle hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelCls}>Vorname</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nachname</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>E-Mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Straße + Nr.</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={inputCls} />
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <div>
                <label className={labelCls}>PLZ</label>
                <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} maxLength={5} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Ort</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 px-3 py-2.5 border-t border-border">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {saved ? <><Check className="w-3 h-3" />Gespeichert</> : saving ? "Speichere..." : <><Save className="w-3 h-3" />Speichern</>}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono bg-secondary text-subtle border border-border hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
