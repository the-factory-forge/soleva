import { ChevronRightIcon } from "lucide-react";
import type { ComponentType } from "react";

import { Link, type LinkProps } from "#/components/ui/link";
import { cn } from "#/lib/utils";

export interface Crumb {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  homeLabel: string;
  homeHref?: string;
  label?: string;
  linkComponent?: ComponentType<LinkProps>;
  items: Crumb[];
  className?: string;
}

export function Breadcrumb({
  homeLabel,
  homeHref = "/",
  label = "Breadcrumb",
  linkComponent: LinkComponent = Link,
  items,
  className,
}: BreadcrumbProps) {
  const all: Crumb[] = [{ label: homeLabel, href: homeHref }, ...items];

  return (
    <nav aria-label={label} className={cn("container-premium pt-24 md:pt-28", className)}>
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
                  <LinkComponent
                    href={crumb.href}
                    className="rounded-sm transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {crumb.label}
                  </LinkComponent>
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
