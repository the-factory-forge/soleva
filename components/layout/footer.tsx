import Link from "next/link"
import { Mail, MapPin, Phone, Clock } from "lucide-react"
import { type SocialPlatform, socialIconMap } from "@/components/ui/social-icons"
import { ManageCookiesButton } from "@/components/navigation/manage-cookies-button"
import { cn } from "@/lib/utils"

export interface SocialLink {
  platform: SocialPlatform
  url: string
}

export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export interface FooterProps {
  brand: { name: string; description: string; logo?: string; initial?: string }
  columns: FooterColumn[]
  contact: {
    title?: string
    address?: string
    phone?: string
    email?: string
    mapsUrl?: string
    hours?: string
  }
  socials?: SocialLink[]
  legal: {
    links: { label: string; href: string }[]
    copyright: string
  }
  attribution?: { text: string; href: string; logo?: string }
  manageCookiesLabel?: string
  manageCookiesEvent?: string
  variant?: "default" | "dark"
  className?: string
}

export function Footer({
  brand,
  columns,
  contact,
  socials,
  legal,
  attribution,
  manageCookiesLabel,
  manageCookiesEvent = "manage-cookies",
  variant = "default",
  className,
}: FooterProps) {
  const dark = variant === "dark"

  const root = dark
    ? "bg-dark text-dark-foreground"
    : "border-t border-border bg-muted/50"

  const brandName = dark ? "text-dark-foreground" : "text-foreground"
  const description = dark ? "text-dark-foreground/70" : "text-muted-foreground"
  const heading = dark ? "text-dark-foreground/90" : "text-foreground"
  const link = dark
    ? "text-dark-foreground/70 transition-colors hover:text-secondary"
    : "text-muted-foreground transition-colors hover:text-primary"
  const socialIcon = dark
    ? "text-dark-foreground/80 transition-colors hover:text-secondary"
    : "text-muted-foreground transition-colors hover:text-primary"
  const bottomBorder = dark ? "border-dark-foreground/10" : "border-border"
  const bottomText = dark ? "text-dark-foreground/60" : "text-muted-foreground"
  const bottomLink = dark
    ? "transition-colors hover:text-secondary"
    : "transition-colors hover:text-primary"

  return (
    <footer className={cn(root, className)}>
      <div className="container-premium py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-8 w-auto" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {brand.initial ?? brand.name.charAt(0)}
                </span>
              )}
              <span className={cn("text-lg font-bold", brandName)}>{brand.name}</span>
            </div>
            <p className={cn("text-sm leading-relaxed", description)}>
              {brand.description}
            </p>
            {contact.hours && (
              <div className={cn("flex items-start gap-2 text-sm", description)}>
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{contact.hours}</span>
              </div>
            )}
            {socials && socials.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socials.map((social) => {
                  const Icon = socialIconMap[social.platform]
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(socialIcon, dark && "flex h-9 w-9 items-center justify-center rounded-full bg-dark-foreground/10")}
                      aria-label={social.platform}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Navigation columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wide", heading)}>
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((linkItem) => (
                  <li key={linkItem.href}>
                    <Link href={linkItem.href} className={cn("text-sm", link)}>
                      {linkItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-wide", heading)}>
              {contact.title}
            </h3>
            <ul className="space-y-3">
              {contact.address && (
                <li>
                  {contact.mapsUrl ? (
                    <a
                      href={contact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn("flex items-start gap-2 text-sm", link)}
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {contact.address}
                    </a>
                  ) : (
                    <span className={cn("flex items-start gap-2 text-sm", description)}>
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {contact.address}
                    </span>
                  )}
                </li>
              )}
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className={cn("flex items-center gap-2 text-sm", link)}
                  >
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className={cn("flex items-center gap-2 text-sm", link)}
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={cn("border-t", bottomBorder)}>
        <div className={cn("container-premium flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row", bottomText)}>
          <span>{legal.copyright}</span>
          {attribution && (
            <a
              href={attribution.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={cn("inline-flex items-center gap-1.5", bottomLink)}
            >
              {attribution.logo && (
                <img src={attribution.logo} alt="" className="h-4 w-4" aria-hidden="true" />
              )}
              {attribution.text}
            </a>
          )}
          <nav className="flex gap-4">
            {legal.links.map((linkItem) => (
              <Link
                key={linkItem.href}
                href={linkItem.href}
                className={cn(bottomLink, dark && "text-dark-foreground/70 hover:text-secondary")}
              >
                {linkItem.label}
              </Link>
            ))}
            {manageCookiesLabel && (
              <ManageCookiesButton
                label={manageCookiesLabel}
                manageEvent={manageCookiesEvent}
                className={cn(
                  "text-xs",
                  bottomLink,
                  dark && "text-dark-foreground/70 hover:text-secondary",
                )}
              />
            )}
          </nav>
        </div>
      </div>
    </footer>
  )
}
