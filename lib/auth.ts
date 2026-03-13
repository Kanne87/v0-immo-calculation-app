import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      isAdmin: boolean
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "authentik",
      name: "Authentik",
      type: "oidc",
      issuer: "https://auth.kailohmann.de/application/o/immo-app/",
      clientId: process.env.AUTHENTIK_CLIENT_ID!,
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET!,
    },
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.authentikSub = profile.sub as string
        token.email = profile.email as string
        token.name = profile.name as string
        // Authentik liefert groups im OIDC-Profil mit
        token.groups = (profile as Record<string, unknown>).groups as string[] || []
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.authentikSub as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.isAdmin = ((token.groups as string[]) || []).includes("immo-admin")
      }
      return session
    },
    authorized({ auth }) {
      return !!auth?.user
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
})
