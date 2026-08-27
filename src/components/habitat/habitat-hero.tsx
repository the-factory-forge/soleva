"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Image } from "@/components/ui/image";
import type { HabitatContent } from "@/lib/data/habitat";

export function HabitatHero({
  breadcrumb,
  hero,
  image,
  supportHref,
  discoverHref,
}: {
  breadcrumb: ReactNode;
  hero: HabitatContent["hero"];
  image?: string;
  supportHref: string;
  discoverHref: string;
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

      <div className="container-premium pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="max-w-3xl">
          <p className="hero-enter mb-4 text-sm font-semibold tracking-[0.18em] text-secondary uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="hero-enter font-heading text-4xl leading-[1.07] font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p
            className="hero-enter mt-6 max-w-2xl text-lg leading-relaxed text-dark-foreground/85"
            style={{ animationDelay: "80ms" }}
          >
            {hero.subtitle}
          </p>
          <div
            className="hero-enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "120ms" }}
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
          </div>
        </div>
      </div>
    </section>
  );
}
