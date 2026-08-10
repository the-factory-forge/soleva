"use client"

import type { ReactNode } from "react"
import { Image } from "@/components/ui/image"
import { motion } from "motion/react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import type { HabitatContent } from "@/lib/data/habitat"

const ease = [0.22, 1, 0.36, 1] as const

export function HabitatHero({
  breadcrumb,
  hero,
  image,
  supportHref,
  discoverHref,
}: {
  breadcrumb: ReactNode
  hero: HabitatContent["hero"]
    image?: string
  supportHref: string
  discoverHref: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/95 via-dark/80 to-dark/45" />
        </div>
      )}

      <div className="[&_a]:text-dark-foreground/70 [&_a:hover]:text-secondary [&_span]:text-dark-foreground [&_svg]:text-dark-foreground/40">
        {breadcrumb}
      </div>

      <div className="container-premium pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-secondary"
          >
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease }}
            className="text-balance font-heading text-4xl font-extrabold leading-[1.07] sm:text-5xl lg:text-6xl"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-dark-foreground/85"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={supportHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={discoverHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-dark-foreground/25 px-7 py-3.5 text-sm font-semibold text-dark-foreground transition-colors hover:border-secondary hover:text-secondary"
            >
              {hero.ctaSecondary}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
