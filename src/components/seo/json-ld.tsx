import { SITE_URL, SITE_NAME, CONTACT, SOCIALS } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

export function OrganizationJsonLd({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/images/soleva-logo.webp`,
    description: dict.meta.home.description,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      postalCode: CONTACT.address.zip,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.canton,
      addressCountry: "CH",
    },
    telephone: `+41${CONTACT.phone.replace(/[^\d]/g, "")}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.geo.latitude,
      longitude: CONTACT.geo.longitude,
    },
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.address.city,
        addressRegion: CONTACT.address.canton,
        addressCountry: "CH",
      },
    },
    sameAs: [SOCIALS.instagram, SOCIALS.facebook, SOCIALS.youtube],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
