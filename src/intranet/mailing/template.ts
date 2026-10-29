import { renderEmail } from "#/intranet/components/forge/plugins/mailing";
import de from "#/intranet/i18n/de.json" with { type: "json" };
import en from "#/intranet/i18n/en.json" with { type: "json" };
import fr from "#/intranet/i18n/fr.json" with { type: "json" };
import it from "#/intranet/i18n/it.json" with { type: "json" };
import type { Locale } from "#/lib/i18n/config";
import { SITE_NAME } from "#/lib/site/constants";

export const authEmailKinds = ["verification", "reset-password", "invitation"] as const;
export type AuthEmailKind = (typeof authEmailKinds)[number];

export async function renderAuthEmail({
  kind,
  locale,
  url,
  baseUrl,
}: {
  kind: AuthEmailKind;
  locale: Locale;
  url: string;
  baseUrl: string;
}) {
  const dict = { fr, en, de, it }[locale];
  const messages = {
    verification: [dict.employees.verificationSubject, dict.employees.verificationBody],
    "reset-password": [dict.auth.resetEmailSubject, dict.auth.resetEmailBody],
    invitation: [dict.employees.invitationSubject, dict.employees.invitationBody],
  };
  const [subject, body] = messages[kind];
  return {
    subject,
    ...(await renderEmail({
      brand: {
        name: SITE_NAME,
        logoUrl: new URL("/images/soleva-icon.png", baseUrl).href,
        // Concrete light-palette values keep emails independent of website stylesheets.
        theme: {
          background: "#ffffff",
          foreground: "#1f2a2a",
          card: "#ffffff",
          cardForeground: "#1f2a2a",
          primary: "#ff803e",
          primaryForeground: "#1f2a2a",
          muted: "#eef4f3",
          mutedForeground: "#5a6b6a",
          border: "#e2e8f0",
          fontSans: "Montserrat, Arial, Helvetica, sans-serif",
          fontSerif: "Montserrat, Arial, Helvetica, sans-serif",
        },
      },
      locale,
      preview: subject,
      heading: subject,
      paragraphs: [body],
      action: { label: subject, url },
    })),
  };
}
