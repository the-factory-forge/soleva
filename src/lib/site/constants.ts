// TODO: Replace all values with client-specific data

import { env as clientEnv } from "@/env/client";

export const SITE_NAME = "Soleva";
// Site URL is derived from VITE_BASE_URL (build arg + runtime env, one source of truth).
export const SITE_URL = clientEnv.VITE_BASE_URL.replace(/\/+$/, "");
export const SITE_DESCRIPTION =
  "Soleva transforme un ancien van en camper électrique alimenté par le soleil. Un démonstrateur suisse de mobilité durable, retrofit et énergie solaire.";

export const CONTACT = {
  businessName: "Soleva",
  fullName: "ASSOCIATION SOLEVA",
  phone: "+41 77 420 74 40",
  email: "info@soleva.org",
  address: "Avenue de Cour 19, 1007 Lausanne, Suisse",
  mapsUrl: "https://maps.google.com/?q=Avenue+de+Cour+19,+1007+Lausanne",
  mapsEmbed: "",
};

export const SOCIALS = {
  instagram: "https://instagram.com/soleva_solar_van",
  facebook: "https://facebook.com/solevavan",
  youtube: "https://youtube.com/channel/UCmw0pPduN1XgIyguDNtcv0w",
} as const;
