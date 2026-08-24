import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";

export function CtaBand({
  locale,
  title,
  body,
  buttonLabel,
  href = "/contact",
}: {
  locale: Locale;
  title: string;
  body: string;
  buttonLabel: string;
  href?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-premium section-padding">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="font-heading text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">{body}</p>
          <Button
            size="lg"
            className="mt-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            render={
              <Link
                href={href.startsWith("/") ? withLocale(locale, href) : href}
                className="inline-flex items-center gap-2"
              />
            }
          >
            {buttonLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
