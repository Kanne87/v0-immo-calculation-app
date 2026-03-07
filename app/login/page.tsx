"use client"

import { useState } from "react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/csrf")
      const { csrfToken } = await res.json()

      const popup = window.open("about:blank", "auth-popup", "width=500,height=700,scrollbars=yes,resizable=yes")
      if (!popup) {
        window.location.href = "/api/auth/signin/authentik"
        return
      }

      const form = popup.document.createElement("form")
      form.method = "POST"
      form.action = "/api/auth/signin/authentik"

      const csrf = popup.document.createElement("input")
      csrf.type = "hidden"
      csrf.name = "csrfToken"
      csrf.value = csrfToken
      form.appendChild(csrf)

      const cb = popup.document.createElement("input")
      cb.type = "hidden"
      cb.name = "callbackUrl"
      cb.value = window.location.origin + "/auth/success"
      form.appendChild(cb)

      popup.document.body.appendChild(form)
      form.submit()

      const onMessage = (e: MessageEvent) => {
        if (e.origin === window.location.origin && e.data?.type === "auth-success") {
          window.removeEventListener("message", onMessage)
          popup.close()
          window.location.href = "/"
        }
      }
      window.addEventListener("message", onMessage)

      const check = setInterval(() => {
        if (popup.closed) {
          clearInterval(check)
          window.removeEventListener("message", onMessage)
          setLoading(false)
        }
      }, 500)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6">
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 shadow-lg">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 22h20M3 22V6l9-4 9 4v16M9 22V12h6v10" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-primary tracking-[0.2em] uppercase font-medium">Konzeptvorsorge</div>
              <h1 className="text-2xl font-bold text-foreground mt-1" style={{ fontFamily: "var(--font-playfair, 'Playfair Display'), serif" }}>
                Kapitalanlage-Rechner
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">Bitte anmelden um fortzufahren</p>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Wird geladen..." : "Login"}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">Sichere Anmeldung über Authentik</p>
        </div>
      </div>
    </div>
  )
}
