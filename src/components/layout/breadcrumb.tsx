import { ChevronRight } from "lucide-react";

import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Link } from "@/components/ui/link";
import { SITE_URL } from "@/lib/constants";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";

export type Crumb = { label: string; href: string };

export function Breadcrumb({
  locale,
  homeLabel,
  items,
  ariaLabel = "Breadcrumb",
}: {
  locale: Locale;
  homeLabel: string;
  items: Crumb[];
  ariaLabel?: string;
}) {
  const all: Crumb[] = [{ label: homeLabel, href: "/" }, ...items];

  const jsonLdItems = all.map((c) => ({
    name: c.label,
    url: `${SITE_URL}${withLocale(locale, c.href)}`,
  }));

  return (
    <nav aria-label={ariaLabel} className="container-premium pt-24 md:pt-28">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {all.map((crumb, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={withLocale(locale, crumb.href)}
                    className="transition-colors hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <BreadcrumbJsonLd items={jsonLdItems} />
    </nav>
  );
}
