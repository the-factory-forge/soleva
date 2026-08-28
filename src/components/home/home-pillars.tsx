import { Zap, Sun, Home, ArrowRight } from "lucide-react";

import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { FadeUp as Reveal } from "@/components/animations-lazy";
import { SectionHeading } from "@/components/ui/section-heading";
import { IMAGES, srcSetFor } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";

export function HomePillars({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pillars = [
    {
      Icon: Zap,
      title: dict.home.pillars.conversion_title,
      desc: dict.home.pillars.conversion_desc,
      href: "/le-van/conversion-electrique",
      image: IMAGES.conversion,
    },
    {
      Icon: Sun,
      title: dict.home.pillars.solar_title,
      desc: dict.home.pillars.solar_desc,
      href: "/le-van/systeme-solaire",
      image: IMAGES.solarPanels,
    },
    {
      Icon: Home,
      title: dict.home.pillars.habitat_title,
      desc: dict.home.pillars.habitat_desc,
      href: "/habitat",
      image: IMAGES.habitat,
    },
  ];

  return (
    <section className="bg-accent [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
      <div className="container-premium section-padding">
        <SectionHeading title={dict.home.pillars.title} subtitle={dict.home.pillars.subtitle} />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={`pillar-${i}`} delay={i * 0.08}>
              <Link
                href={withLocale(locale, pillar.href)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={pillar.image || "/placeholder.svg"}
                    alt=""
                    fill
                    srcSet={srcSetFor(pillar.image)}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <pillar.Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-bold">{pillar.title}</h3>
                  <p className="mt-3 flex-1 text-muted-foreground">{pillar.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {dict.common.learn_more}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
