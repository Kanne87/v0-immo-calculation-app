import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: 'Kapitalanlage-Rechner Pro',
  description: 'Professionelles Beratungstool für Immobilien-Kapitalanlagen mit KfW, Sonder-AfA und Vermögensaufbau',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a14',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${geistMono.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="kapitalanlage-theme"
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
