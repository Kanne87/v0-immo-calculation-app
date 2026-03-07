import { signIn, auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/")

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
              <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground mt-1">
                Kapitalanlage-Rechner
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Bitte anmelden um fortzufahren
            </p>
          </div>
          <form
            action={async () => {
              "use server"
              await signIn("authentik", { redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
