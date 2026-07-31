import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { Montserrat } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import { locales, type Locale, isLocale } from "@/lib/i18n/config"
import { getDictionary, ogLocales } from "@/lib/i18n"
import { SITE_URL, SITE_NAME, SITE } from "@/lib/constants"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { getFooterProps } from "@/lib/data/footer"
import { CookieBanner } from "@/components/layout/cookie-banner"
import { ConsentInit } from "@/components/layout/consent-init"
import { OrganizationJsonLd } from "@/components/seo/json-ld"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#ff803e",
  width: "device-width",
  initialScale: 1,
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)

  const languages: Record<string, string> = {}
  for (const l of locales) languages[l] = `${SITE_URL}/${l}`

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.home.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.meta.home.description,
    applicationName: SITE_NAME,
    icons: {
      icon: SITE.faviconUrl,
      apple: SITE.faviconUrl,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: ogLocales[locale],
      url: `${SITE_URL}/${locale}`,
      title: dict.meta.home.title,
      description: dict.meta.home.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.home.title,
      description: dict.meta.home.description,
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale as Locale)

  return (
    <html lang={locale} className={`${montserrat.variable} bg-background`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          {dict.a11y.skipToContent}
        </a>
        <Navbar locale={locale as Locale} dict={dict} />
        <main id="main-content">{children}</main>
        <Footer
          {...getFooterProps(locale as Locale, dict)}
          manageCookiesLabel={dict.footer.manage_cookies}
        />
        <CookieBanner locale={locale as Locale} dict={dict} showMarketing={true} />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <ConsentInit />}
        <OrganizationJsonLd locale={locale as Locale} />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        ) : null}
      </body>
    </html>
  )
}
