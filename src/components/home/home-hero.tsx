import { ArrowRight, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { IMAGES } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";

export function HomeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={IMAGES.hero}
          className="h-full w-full object-cover"
        >
          <source src={IMAGES.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/30" />
      </div>

      <div className="container-premium flex min-h-[92vh] flex-col justify-center py-32">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            <Sun className="h-4 w-4" aria-hidden="true" />
            {dict.home.hero.eyebrow}
          </p>
          <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {dict.home.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dark-foreground/80">
            {dict.home.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              render={
                <Link
                  href={withLocale(locale, "/contact")}
                  className="inline-flex items-center gap-2"
                />
              }
            >
              {dict.home.hero.primary_cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-dark-foreground/30 bg-transparent text-dark-foreground hover:bg-dark-foreground/10 hover:text-dark-foreground"
              render={<Link href={withLocale(locale, "/le-van")} />}
            >
              {dict.home.hero.secondary_cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
