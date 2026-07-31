import type { ReactNode } from "react"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

// Root layout renders <html> and <body>. The `lang` attribute is set on the
// <html> element via the [locale] layout by passing it through the body
// wrapper — see app/[locale]/layout.tsx for locale handling.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} bg-background`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
