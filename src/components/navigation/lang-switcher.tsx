"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import type { Dictionary } from "@/lib/i18n";
import { locales, localeNames, localeShort, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface LangSwitcherProps {
  locale: Locale;
  pathWithoutLocale: string;
  onLight: boolean;
  dict: Dictionary;
}

export function LangSwitcher({ locale, pathWithoutLocale, onLight, dict }: LangSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
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
          />
        }
      >
        {localeShort[locale]}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            render={
              <Link
                href={`/${l}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
                className={cn("cursor-pointer", l === locale && "font-semibold text-primary")}
              />
            }
          >
            {localeNames[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
