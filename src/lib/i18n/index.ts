// TanStack: no server-only marker - modules run in both environments

import { defaultLocale, type Locale } from "./config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  fr: () => import("./fr.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  de: () => import("./de.json").then((m) => m.default),
  it: () => import("./it.json").then((m) => m.default),
};

const loadedDictionaries: Partial<Record<Locale, Dictionary>> = {};
const intranetDictionaries = import.meta.glob<Dictionary>("/src/intranet/i18n/*.json", {
  import: "default",
});

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (loadedDictionaries[locale]) return loadedDictionaries[locale];
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale];
  const [publicDictionary, intranetDictionary] = await Promise.all([
    loader(),
    intranetDictionaries[`/src/intranet/i18n/${locale}.json`]?.(),
  ]);
  const dictionary = { ...publicDictionary, ...intranetDictionary };
  loadedDictionaries[locale] = dictionary;
  return dictionary;
}

export const ensureDictionary = getDictionary;

/** Route heads seed this cache before server rendering and client hydration. */
export function useDictionary(locale: Locale): Dictionary {
  const dictionary = loadedDictionaries[locale];
  if (!dictionary) throw new Error(`Dictionary not loaded for ${locale}`);
  return dictionary;
}

export function t(dictionary: Dictionary, key: string): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary);

  return typeof value === "string" ? value : key;
}

export function tList(dictionary: Dictionary, key: string): string[] {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary);

  return Array.isArray(value) ? (value as string[]) : [];
}

export function tNode<T = unknown>(dictionary: Dictionary, key: string): T | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary);

  return value as T | undefined;
}

export {
  type Locale,
  locales,
  defaultLocale,
  localeNames,
  localeShort,
  ogLocales,
  isLocale,
} from "./config";
