import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n"
import { withLocale } from "@/lib/navigation"
import { CONTACT, SOCIALS, SITE_NAME, THE_CORNER } from "@/lib/constants"
import { ManageCookiesButton } from "@/components/layout/cookie-banner"
import { InstagramIcon, FacebookIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/social-icons"

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear()

  const exploreLinks = [
    { label: dict.footer.van, href: "/le-van" },
    { label: dict.nav.impact, href: "/impact" },
    { label: dict.nav.voyage, href: "/voyage" },
    { label: dict.nav.support, href: "/soutenir" },
  ]
  const projectLinks = [
    { label: dict.nav.about, href: "/a-propos" },
    { label: dict.nav.faq, href: "/faq" },
    { label: dict.nav.contact, href: "/contact" },
  ]
  const legalLinks = [
    { label: dict.breadcrumb.legal, href: "/mentions-legales" },
    { label: dict.breadcrumb.privacy, href: "/confidentialite" },
  ]

  const socials = [
    { Icon: InstagramIcon, href: SOCIALS.instagram, label: "Instagram" },
    { Icon: FacebookIcon, href: SOCIALS.facebook, label: "Facebook" },
    { Icon: LinkedinIcon, href: SOCIALS.linkedin, label: "LinkedIn" },
    { Icon: YoutubeIcon, href: SOCIALS.youtube, label: "YouTube" },
  ]

  return (
    <footer className="bg-dark text-dark-foreground">
      <div className="container-premium py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href={withLocale(locale, "/")} className="inline-flex items-center" aria-label="Soleva">
              <Image
                src="/images/soleva-logo.webp"
                alt="Soleva — The Solar Electric Van"
                width={651}
                height={281}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-dark-foreground/70">{dict.footer.description}</p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-dark-foreground/70">
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-secondary">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACT.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {CONTACT.address.street}, {CONTACT.address.zip} {CONTACT.address.city}
              </span>
              {CONTACT.phone && (
                <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 hover:text-secondary">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              )}
            </div>
          </div>

          <FooterColumn title={dict.footer.explore} links={exploreLinks} locale={locale} />
          <FooterColumn title={dict.footer.project} links={projectLinks} locale={locale} />

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-dark-foreground/90">
              {dict.footer.follow}
            </h3>
            <div className="mt-4 flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-foreground/10 text-dark-foreground/80 transition-colors hover:bg-secondary hover:text-secondary-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wider text-dark-foreground/90">
              {dict.footer.legal_links}
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={withLocale(locale, link.href)} className="text-dark-foreground/70 hover:text-secondary">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <ManageCookiesButton label={dict.footer.manage_cookies} />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-dark-foreground/10 pt-8 text-sm text-dark-foreground/60 md:flex-row md:items-center">
          <p>
            © {year} {SITE_NAME}. {dict.footer.rights}
          </p>
          <a
            href={THE_CORNER.factoriesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-secondary"
          >
            <img
              src={THE_CORNER.logoUrl}
              alt=""
              className="h-4 w-4"
              aria-hidden="true"
            />
            {dict.footer.produced_by}
          </a>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
  locale,
}: {
  title: string
  links: { label: string; href: string }[]
  locale: Locale
}) {
  return (
    <div>
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-dark-foreground/90">{title}</h3>
      <ul className="mt-4 flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={withLocale(locale, link.href)} className="text-dark-foreground/70 hover:text-secondary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
