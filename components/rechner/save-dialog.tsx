"use client"

import { useState, useRef, useEffect } from "react"
import { X, Save } from "lucide-react"

interface SaveDialogProps {
  sourceUnitId: string
  onSave: (description: string) => void
  onCancel: () => void
}

export function SaveDialog({ sourceUnitId, onSave, onCancel }: SaveDialogProps) {
  const [description, setDescription] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = () => {
    const trimmed = description.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
    if (e.key === "Escape") onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-lg shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-serif font-semibold text-foreground">Berechnung speichern</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-secondary transition-colors text-subtle hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-4">
          <div className="mb-3 text-[11px] text-subtle font-mono">Basierend auf {sourceUnitId}</div>
          <label className="block text-[11px] text-dimmed mb-1.5 font-mono tracking-wide">Beschreibung</label>
          <input
            ref={inputRef} type="text" value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z.B. Herr Müller – 100% Finanzierung"
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm font-serif text-foreground placeholder:text-subtle/50 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <p className="mt-1.5 text-[10px] text-subtle font-mono">Name, Kunde, oder Szenario zur Unterscheidung</p>
        </div>
        <div className="flex gap-2 px-4 py-3 border-t border-border">
          <button onClick={onCancel} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all">Abbrechen</button>
          <button onClick={handleSubmit} disabled={!description.trim()} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-mono bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <Save className="w-3.5 h-3.5" />Speichern
          </button>
        </div>
      </div>
    </div>
  )
}

interface UnsavedWarningProps {
  onSave: () => void
  onDiscard: () => void
  onCancel: () => void
}

export function UnsavedWarning({ onSave, onDiscard, onCancel }: UnsavedWarningProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-card border border-border rounded-lg shadow-xl">
        <div className="px-4 py-4">
          <h3 className="text-sm font-serif font-semibold text-foreground mb-2">Ungespeicherte Änderungen</h3>
          <p className="text-xs text-dimmed font-mono">Du hast die Finanzierungsdaten geändert. Möchtest du die Berechnung speichern?</p>
        </div>
        <div className="flex gap-2 px-4 py-3 border-t border-border">
          <button onClick={onDiscard} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-secondary text-dimmed border border-border hover:text-destructive transition-all">Verwerfen</button>
          <button onClick={onCancel} className="flex-1 py-2 px-3 rounded-md text-xs font-mono bg-secondary text-dimmed border border-border hover:text-foreground transition-all">Zurück</button>
          <button onClick={onSave} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-mono bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all">
            <Save className="w-3.5 h-3.5" />Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
