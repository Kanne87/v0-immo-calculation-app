import { signIn, auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Wenn bereits eingeloggt, direkt weiter
  const session = await auth()
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
              Kapitalanlage-Rechner
            </h1>
            <p className="text-muted-foreground">
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
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Mit Authentik anmelden
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
