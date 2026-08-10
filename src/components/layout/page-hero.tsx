import { Image } from "@/components/ui/image"
import { type Locale } from "@/lib/i18n/config"
import { Breadcrumb, type Crumb } from "@/components/layout/breadcrumb"

export function PageHero({
  locale,
  homeLabel,
  crumbs,
  eyebrow,
  title,
  subtitle,
  image,
}: {
  locale: Locale
  homeLabel: string
  crumbs: Crumb[]
  eyebrow?: string
  title: string
  subtitle?: string
  image?: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Image src={image || "/placeholder.svg"} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/80 to-dark/50" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-dark" />
      )}

      <div className="[&_a]:text-dark-foreground/70 [&_a:hover]:text-secondary [&_span]:text-dark-foreground [&_svg]:text-dark-foreground/40">
        <Breadcrumb locale={locale} homeLabel={homeLabel} items={crumbs} />
      </div>

      <div className="container-premium pb-20 pt-10 md:pb-28 md:pt-12">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
          ) : null}
          <h1 className="text-balance font-heading text-4xl font-extrabold leading-[1.08] sm:text-5xl">{title}</h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-dark-foreground/80">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
