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
  className,
}: FooterProps) {
  return (
    <footer className={cn("border-t border-border bg-muted/50", className)}>
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
              <span className="text-lg font-bold text-foreground">{brand.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {brand.description}
            </p>
            {contact.hours && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
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
                      className="text-muted-foreground transition-colors hover:text-primary"
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
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
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
                      className="flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {contact.address}
                    </a>
                  ) : (
                    <span className="flex items-start gap-2 text-sm text-muted-foreground">
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
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
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
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
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
      <div className="border-t border-border">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>{legal.copyright}</span>
          {attribution && (
            <a
              href={attribution.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              {attribution.logo && (
                <img src={attribution.logo} alt="" className="h-4 w-4" aria-hidden="true" />
              )}
              {attribution.text}
            </a>
          )}
          <nav className="flex gap-4">
            {legal.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            {manageCookiesLabel && (
              <ManageCookiesButton
                label={manageCookiesLabel}
                manageEvent={manageCookiesEvent}
                className="transition-colors hover:text-primary"
              />
            )}
          </nav>
        </div>
      </div>
    </footer>
  )
}
