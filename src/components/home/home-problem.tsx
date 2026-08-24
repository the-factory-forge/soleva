import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Reveal } from "@/components/ui/reveal";
import { IMAGES } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";

export function HomeProblem({ dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
      <div className="container-premium section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Lightbox src={IMAGES.journey || "/placeholder.svg"} alt="">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src={IMAGES.journey || "/placeholder.svg"}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Lightbox>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                {dict.home.problem.eyebrow}
              </p>
              <h2 className="font-heading text-3xl leading-tight font-extrabold text-pretty sm:text-4xl">
                {dict.home.problem.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {dict.home.problem.body}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
