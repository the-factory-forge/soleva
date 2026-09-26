import type { ReactNode } from "react";

import { Navbar } from "#/components/navigation/navbar";
import { useDictionary } from "#/lib/i18n";
import type { Locale } from "#/lib/i18n/config";
export function PublicShell({
  locale,
  children,
}: {
  locale: Locale;
  controls?: ReactNode;
  children: ReactNode;
}) {
  const dict = useDictionary(locale);
  return (
    <>
      <Navbar locale={locale} dict={dict} />
      {children}
    </>
  );
}
