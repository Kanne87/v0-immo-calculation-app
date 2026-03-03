import type { Metadata } from "next"
import { Playfair_Display, JetBrains_Mono, Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Kapitalanlage-Rechner Pro",
  description:
    "Steueroptimierte Immobilienanalyse mit KfW-Förderung, Sonder-AfA und 10-Jahres-Cashflow",
}

const themeScript = '(function(){try{var t=localStorage.getItem("immo-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})();'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      data-theme="dark"
      className={[playfair.variable, jetbrains.variable, inter.variable].join(" ")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
