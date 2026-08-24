import { createFileRoute } from "@tanstack/react-router";
import { Eye, Sparkles, Target } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import { Reveal } from "@/components/ui/reveal";
import {
  IMAGES,
  MENTOR_PHOTOS,
  PRESS_LOGOS,
  SITE_NAME,
  SITE_URL,
  srcSetFor,
  TEAM_PHOTOS,
} from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { withLocale } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

const TEAM_MEMBERS = [
  {
    name: "Curdin Wüthrich",
    role: "CEO et co-fondateur",
    email: "curdin.wuethrich@soleva.org",
    photo: TEAM_PHOTOS["Curdin Wüthrich"],
  },
  {
    name: "Matthieu Bourgois",
    role: "CTO, co-fondateur, intégration mécanique",
    email: "matthieu.bourgois@soleva.org",
    photo: TEAM_PHOTOS["Matthieu Bourgois"],
  },
  {
    name: "Max Chevron",
    role: "Trésorier, gestion batteries",
    email: "max.chevron@soleva.org",
    photo: TEAM_PHOTOS["Max Chevron"],
  },
  {
    name: "Tobia Wyss",
    role: "Co-fondateur, intégration solaire",
    email: "tobia.wyss@soleva.org",
    photo: TEAM_PHOTOS["Tobia Wyss"],
  },
  {
    name: "Sara Bossuyt",
    role: "Co-fondatrice, communication et habitat",
    email: "sara.bossuyt@soleva.org",
    photo: TEAM_PHOTOS["Sara Bossuyt"],
  },
  {
    name: "Sévane Bercher",
    role: "Co-fondatrice, juridique",
    email: "sevane.bercher@soleva.org",
    photo: TEAM_PHOTOS["Sévane Bercher"],
  },
  {
    name: "Lucanaël Kopf",
    role: "Chef de projet intégration mécanique",
    photo: TEAM_PHOTOS["Lucanaël Kopf"],
  },
  {
    name: "Roman Schmitz",
    role: "Chef de projet électrification",
    email: "roman.schmitz@soleva.org",
    photo: TEAM_PHOTOS["Roman Schmitz"],
  },
  {
    name: "Nicola Offeddu",
    role: "Construction habitat durable",
    photo: TEAM_PHOTOS["Nicola Offeddu"],
  },
];

const MENTORS = [
  {
    name: "Marc Müller",
    role: "Fondateur ICARE, Président Impact Living",
    photo: MENTOR_PHOTOS["Marc Müller"],
  },
  {
    name: "André Hodder",
    role: "Enseignant-chercheur EPFL, moteurs électriques",
    photo: MENTOR_PHOTOS["André Hodder"],
  },
  {
    name: "Louis Palmer",
    role: "Fondateur SolarTaxi, SolarButterfly, WAVE",
    photo: MENTOR_PHOTOS["Louis Palmer"],
  },
  {
    name: "Prof. Dr. Werner Stednitz",
    role: "HTW Berlin, Advanced Automotive Concepts",
    photo: MENTOR_PHOTOS["Prof. Dr. Werner Stednitz"],
  },
];

const PRESS_ITEMS = [
  {
    media: "RTS 19h30",
    type: "TV nationale",
    date: "23.06.2024",
    lang: "FR",
    logo: PRESS_LOGOS["RTS 19h30"],
  },
  {
    media: "SRF Schweiz Aktuell",
    type: "TV nationale",
    date: "29.08.2024",
    lang: "DE",
    logo: PRESS_LOGOS["SRF Schweiz Aktuell"],
  },
  {
    media: "RSI Telegiornale",
    type: "TV nationale",
    date: "13.07.2024",
    lang: "IT",
    logo: PRESS_LOGOS["RSI Telegiornale"],
  },
  {
    media: "24Heures",
    type: "Presse écrite",
    date: "12.06.2024",
    lang: "FR",
    logo: PRESS_LOGOS["24Heures"],
  },
  {
    media: "Télé Vaud-Fribourg",
    type: "TV régionale",
    date: "06.04.2022",
    lang: "FR",
    logo: PRESS_LOGOS["Télé Vaud-Fribourg"],
  },
  {
    media: "RTS Radio Matinale",
    type: "Radio nationale",
    date: "24.06.2022",
    lang: "FR",
    logo: PRESS_LOGOS["RTS Radio Matinale"],
  },
  {
    media: "Rouge FM",
    type: "Radio",
    date: "30.06.2022",
    lang: "FR",
    logo: PRESS_LOGOS["Rouge FM"],
  },
  { media: "LFM", type: "Radio", date: "06.03.2022", lang: "FR", logo: PRESS_LOGOS["LFM"] },
  {
    media: "La Côte",
    type: "Presse écrite",
    date: "01.03.2022",
    lang: "FR",
    logo: PRESS_LOGOS["La Côte"],
  },
];

export const Route = createFileRoute("/_site/$lang/a-propos")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) =>
    metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${loaderData.dict.meta.about.title} | ${SITE_NAME}`,
        description: loaderData.dict.meta.about.description,
        path: "/a-propos",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    ),
  component: AboutPage,
});

function AboutPage() {
  const { locale, dict } = Route.useLoaderData();
  const a = dict.about;

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.about, href: "/a-propos" }]}
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        subtitle={a.hero.subtitle}
        image={IMAGES.team}
      />

      {/* Mission / Vision */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold">{a.mission_title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{a.mission_body}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Eye className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold">{a.vision_title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{a.vision_body}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Lightbox src={IMAGES.workshop || "/placeholder.svg"} alt="">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={IMAGES.workshop || "/placeholder.svg"}
                    alt=""
                    fill
                    srcSet={srcSetFor(IMAGES.workshop)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Lightbox>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">
                  {a.story_title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{a.story_body}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">{a.timeline_title}</h2>
          </Reveal>
          <div className="mt-6 overflow-hidden rounded-2xl">
            <Lightbox src="/images/timeline.webp" alt="Roadmap Soleva">
              <Image
                src="/images/timeline.webp"
                srcSet="/images/timeline-480.webp 480w, /images/timeline-800.webp 800w, /images/timeline.webp 2010w"
                sizes="100vw"
                alt="Roadmap Soleva"
                width={1200}
                height={600}
                className="h-auto w-full"
              />
            </Lightbox>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              {a.team_title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center leading-relaxed text-muted-foreground">
              {a.members_subtitle}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.04}>
                <div className="flex flex-col rounded-2xl border border-border bg-card p-6 text-center">
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src={member.photo || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {member.role}
                  </p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      {member.email}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              {a.mentors_title}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MENTORS.map((mentor, i) => (
              <Reveal key={mentor.name} delay={i * 0.06}>
                <div className="flex flex-col rounded-2xl border border-border bg-card p-6 text-center">
                  <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src={mentor.photo || "/placeholder.svg"}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <h3 className="mt-3 font-heading text-base font-semibold">{mentor.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {mentor.role}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
              {a.press_title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center leading-relaxed text-muted-foreground">
              {a.press_subtitle}
            </p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {PRESS_ITEMS.map((item, i) => (
              <Reveal key={item.media + item.date} delay={i * 0.03}>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
                  <div className="relative h-10 w-20">
                    <Image
                      src={item.logo || "/placeholder.svg"}
                      alt={item.media}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <span className="font-heading text-xs font-bold">{item.media}</span>
                  <span className="text-xs text-muted-foreground">{item.type}</span>
                  <span className="text-xs text-muted-foreground/70">
                    {item.date} · {item.lang}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={dict.home.cta.title}
        body={dict.home.cta.body}
        buttonLabel={dict.common.contact_us}
        href="/contact"
      />
    </>
  );
}
