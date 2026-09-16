import { ArrowRight, type LucideIcon } from "lucide-react";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { Link } from "@/components/ui/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";

export interface PillarSuggestion {
  /** Locale-agnostic path, e.g. "/le-van/conversion-electrique" */
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Suggestion cards to the other van pillars - used on the service pages,
 * /habitat and /impact so visitors can jump between the van sub-pages.
 */
export function PillarSuggestions({
  locale,
  dict,
  items,
}: {
  locale: Locale;
  dict: Dictionary;
  items: PillarSuggestion[];
}) {
  return (
    <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
      <div className="container-premium section-padding">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            {dict.service_detail.related_title}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={withLocale(locale, item.href)}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-secondary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                {dict.van.explore}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
