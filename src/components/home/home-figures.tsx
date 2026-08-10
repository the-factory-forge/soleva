import { type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n"
import { KEY_FIGURES } from "@/lib/constants"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"

export function HomeFigures({ dict }: { locale: Locale; dict: Dictionary }) {
  const figures = [
    { value: String(KEY_FIGURES.foundedYear), label: dict.home.figures.founded },
    { value: KEY_FIGURES.autonomy, label: dict.home.figures.autonomy },
    { value: KEY_FIGURES.carbonReduction, label: dict.home.figures.carbon },
    { value: KEY_FIGURES.crowdfundingPercent, label: dict.home.figures.crowdfunding },
    { value: KEY_FIGURES.volunteers, label: dict.home.figures.volunteers },
    { value: KEY_FIGURES.communesVisited, label: dict.home.figures.communes },
  ]

  return (
    <section className="bg-muted">
      <div className="container-premium section-padding">
        <SectionHeading
          title={dict.home.figures.title}
          subtitle={dict.home.figures.subtitle}
        />
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {figures.map((figure, i) => (
            <Reveal key={figure.label} delay={i * 0.05}>
              <div className="flex h-full flex-col items-center justify-center bg-card px-6 py-10 text-center">
                <span className="font-heading text-4xl font-extrabold text-primary md:text-5xl">{figure.value}</span>
                <span className="mt-2 text-sm font-medium text-muted-foreground">{figure.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">{dict.home.figures.disclaimer}</p>
      </div>
    </section>
  )
}
