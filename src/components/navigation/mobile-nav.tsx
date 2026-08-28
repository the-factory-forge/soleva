"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import type { Dictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  locale: Locale;
  dict: Dictionary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: (href: string) => boolean;
  navLabel: (key: string) => string;
  mainNav: { key: string; href: string; children?: { key: string; href: string }[] }[];
  onLight: boolean;
}

export function MobileNav({
  locale,
  dict,
  open,
  onOpenChange,
  isActive,
  navLabel,
  mainNav,
  onLight,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] p-0">
        <SheetTitle className="sr-only">{dict.nav.menu}</SheetTitle>
        <div className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto px-4 pt-16">
          {mainNav.map((item) => (
            <div key={item.key} className="flex flex-col">
              <SheetClose
                render={
                  <Link
                    href={withLocale(locale, item.href)}
                    className={cn(
                      "rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted",
                      isActive(item.href) ? "text-primary" : "text-foreground",
                    )}
                  />
                }
              >
                {navLabel(item.key)}
              </SheetClose>
              {item.children && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                  {item.children.map((child) => (
                    <SheetClose
                      key={child.key}
                      render={
                        <Link
                          href={withLocale(locale, child.href)}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            isActive(child.href) ? "text-primary" : "text-foreground/80",
                          )}
                        />
                      }
                    >
                      {navLabel(child.key)}
                    </SheetClose>
                  ))}
                </div>
              )}
            </div>
          ))}
          <SheetClose
            render={
              <Button
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                render={<Link href={withLocale(locale, "/soutenir")} />}
              />
            }
          >
            {dict.common.support_project}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
