import type { FooterProps } from "@/components/navigation/footer"

export interface FooterOptions {
  /** Brand name shown in the footer and copyright line. */
  siteName: string
  /** Brand description (localized). */
  description: string
  /** Optional brand logo URL. */
  logo?: string
  /** Optional initial used as monogram fallback when no logo. */
  initial?: string
  /** Navigation columns. */
  columns: FooterProps["columns"]
  contact: {
    title?: string
    address?: string
    phone?: string
    email?: string
    mapsUrl?: string
    hours?: string
    hoursLabel?: string
  }
  socials?: FooterProps["socials"]
  /** Copyright text — {year}, {name}, {rights} placeholders are replaced. */
  copyright: string
  /** Localized "All rights reserved" text. */
  rights: string
  /** Legal links (mentions, privacy, terms). */
  legalLinks: { label: string; href: string }[]
  /** Default: The Corner Factory attribution. Pass null to hide. */
  attribution?: FooterProps["attribution"] | null
  newsletter?: FooterProps["newsletter"]
  manageCookiesEvent?: string
  variant?: "default" | "dark"
  accentColor?: "accent" | "primary" | "secondary"
  className?: string
}

const CORNER_ATTRIBUTION = {
  text: "Made by The Corner Factory",
  href: "https://the-corner.io/",
  logo: "https://assets.the-corner.io/logos/the_corner-icon.png",
}

/**
 * Builds Footer props from site data.
 * Handles copyright placeholders ({year}, {name}, {rights}) and the
 * default The Corner Factory attribution.
 */
export function getFooterProps(options: FooterOptions): FooterProps {
  const year = new Date().getFullYear()
  const {
    siteName,
    description,
    logo,
    initial,
    columns,
    contact,
    socials,
    copyright,
    rights,
    legalLinks,
    attribution = CORNER_ATTRIBUTION,
    newsletter,
    manageCookiesEvent = "manage-cookies",
    variant = "default",
    accentColor,
    className,
  } = options

  return {
    brand: { name: siteName, description, logo, initial },
    columns,
    contact,
    socials,
    legal: {
      copyright: copyright
        .replace("{year}", String(year))
        .replace("{name}", siteName)
        .replace("{rights}", rights),
      links: legalLinks,
    },
    attribution: attribution ?? undefined,
    newsletter,
    manageCookiesEvent,
    variant,
    accentColor,
    className,
  }
}
