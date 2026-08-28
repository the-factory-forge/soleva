"use client";

import { useSyncExternalStore } from "react";

import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n";

// Module-level dict cache: the route loaders pre-fill it server-side (SSR)
// and client-side (before render), so components read the dict synchronously
// without it being serialized into the RSC stream.
//
// INVARIANT (depends on a TanStack internal): loaders are NOT re-run during
// hydration, but route `head` functions ARE awaited client-side before the
// first render (router-core load-client.ts hydrate()). Every route that
// renders dict content MUST therefore either await ensureDictionary() in its
// head (or a parent layout head) so the cache is seeded before hydration.
const dictCache = new Map<Locale, Dictionary>();
const listeners = new Set<() => void>();
const EMPTY: Dictionary = {};

export async function ensureDictionary(locale: Locale): Promise<Dictionary> {
  const hit = dictCache.get(locale);
  if (hit) return hit;
  const dict = await getDictionary(locale);
  dictCache.set(locale, dict);
  listeners.forEach((l) => l());
  return dict;
}

export function useDictionary(locale: Locale): Dictionary {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => dictCache.get(locale) ?? EMPTY,
    () => dictCache.get(locale) ?? EMPTY,
  );
}
