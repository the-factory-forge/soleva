"use client";

import { Menu, ChevronDown } from "lucide-react";
import { lazy, Suspense, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { usePathname } from "@/components/ui/use-location";
import type { Dictionary } from "@/lib/i18n";
import { type Locale, locales, localeShort } from "@/lib/i18n/config";
import { mainNav, withLocale } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const LangSwitcher = lazy(() =>
  import("./lang-switcher").then((m) => ({ default: m.LangSwitcher })),
);
const MobileNav = lazy(() =>
  import("./mobile-nav").then((m) => ({ default: m.MobileNav })),
);

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Strip the current locale prefix to build switcher links that preserve the path.
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "") || "/";

  const isActive = (href: string) => {
    const full = withLocale(locale, href);
    if (href === "/") return pathname === full;
    return pathname === full || pathname.startsWith(full + "/");
  };

  const navLabel = (key: string) => (dict.nav as Record<string, string>)[key] ?? key;

  // Over the dark hero the bar is transparent → use light text; once scrolled onto
  // the white background → use dark text.
  const onLight = scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          : "bg-transparent",
      )}
    >
      <nav className="container-premium flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href={withLocale(locale, "/")} className="flex items-center" aria-label="Soleva">
          <Image
            src="/images/soleva-logo.webp"
            alt=""
            width={300}
            height={123}
            priority
            className="h-11 w-auto md:h-14"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const parentActive =
              isActive(item.href) || item.children?.some((c) => isActive(c.href));

            if (item.children) {
              return (
                <li key={item.key} className="group relative">
                  <Link
                    href={withLocale(locale, item.href)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      parentActive
                        ? "text-primary"
                        : onLight
                          ? "text-foreground/80 hover:text-primary"
                          : "text-white/85 hover:text-white",
                    )}
                  >
                    {navLabel(item.key)}
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden="true"
                    />
                  </Link>
                  <div className="invisible absolute top-full left-0 z-50 min-w-60 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="flex flex-col gap-0.5 rounded-xl border border-border bg-background p-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={withLocale(locale, child.href)}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              isActive(child.href)
                                ? "bg-muted text-primary"
                                : "text-foreground/80 hover:bg-muted hover:text-primary",
                            )}
                          >
                            {navLabel(child.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.key}>
                <Link
                  href={withLocale(locale, item.href)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    parentActive
                      ? onLight
                        ? "text-primary"
                        : "text-primary-soft"
                      : onLight
                        ? "text-foreground/80 hover:text-primary"
                        : "text-white/85 hover:text-white",
                  )}
                >
                  {navLabel(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* Language switcher (lazy: Base UI dropdown chunk off the critical path) */}
          <Suspense
            fallback={
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1 px-2",
                  onLight
                    ? "text-foreground hover:text-primary"
                    : "text-white hover:bg-white/10 hover:text-white",
                )}
                aria-label={dict.nav.language}
                onClick={() => setLangOpen(true)}
              >
                {localeShort[locale]}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          >
            {langOpen && (
              <LangSwitcher
                locale={locale}
                pathWithoutLocale={pathWithoutLocale}
                onLight={onLight}
                dict={dict}
                defaultOpen
              />
            )}
          </Suspense>

          <Button
            size="sm"
            className="hidden bg-primary text-primary-foreground hover:bg-primary/90 sm:inline-flex"
            render={<Link href={withLocale(locale, "/contact")} />}
          >
            {dict.common.contact_us}
          </Button>

          {/* Mobile menu (lazy: Base UI sheet chunk off the critical path) */}
          <Suspense
            fallback={
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden",
                  onLight ? "text-foreground" : "text-white hover:bg-white/10 hover:text-white",
                )}
                aria-label={dict.nav.menu}
                onClick={() => setOpen(true)}
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            }
          >
            {open && <MobileNav
              locale={locale}
              dict={dict}
              open={open}
              onOpenChange={setOpen}
              isActive={isActive}
              navLabel={navLabel}
              mainNav={mainNav}
              onLight={onLight}
            />}
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
