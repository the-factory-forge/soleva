import { createFileRoute } from "@tanstack/react-router";
import { Eye, Sparkles, Target } from "lucide-react";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { Lightbox } from "@/components/ui/lightbox";
import {
  IMAGES,
  MENTOR_PHOTOS,
  PRESS_LOGOS,
  SITE_NAME,
  SITE_URL,
  srcSetFor,
  TEAM_PHOTOS,
} from "@/lib/constants";
import { pressAppearances } from "@/lib/data/press";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

const TEAM_MEMBERS = [
  {
    name: "Curdin Wüthrich",
    roleKey: "curdin",
    email: "curdin.wuethrich@soleva.org",
    photo: TEAM_PHOTOS["Curdin Wüthrich"],
  },
  {
    name: "Matthieu Bourgois",
    roleKey: "matthieu",
    email: "matthieu.bourgois@soleva.org",
    photo: TEAM_PHOTOS["Matthieu Bourgois"],
  },
  {
    name: "Max Chevron",
    roleKey: "max",
    email: "max.chevron@soleva.org",
    photo: TEAM_PHOTOS["Max Chevron"],
  },
  {
    name: "Tobia Wyss",
    roleKey: "tobia",
    email: "tobia.wyss@soleva.org",
    photo: TEAM_PHOTOS["Tobia Wyss"],
  },
  {
    name: "Sara Bossuyt",
    roleKey: "sara",
    email: "sara.bossuyt@soleva.org",
    photo: TEAM_PHOTOS["Sara Bossuyt"],
  },
  {
    name: "Sévane Bercher",
    roleKey: "sevane",
    email: "sevane.bercher@soleva.org",
    photo: TEAM_PHOTOS["Sévane Bercher"],
  },
  {
    name: "Lucanaël Kopf",
    roleKey: "lucanael",
    photo: TEAM_PHOTOS["Lucanaël Kopf"],
  },
  {
    name: "Roman Schmitz",
    roleKey: "roman",
    email: "roman.schmitz@soleva.org",
    photo: TEAM_PHOTOS["Roman Schmitz"],
  },
  {
    name: "Nicola Offeddu",
    roleKey: "nicola",
    photo: TEAM_PHOTOS["Nicola Offeddu"],
  },
];

const MENTORS = [
  {
    name: "Marc Müller",
    roleKey: "marc",
    photo: MENTOR_PHOTOS["Marc Müller"],
  },
  {
    name: "André Hodder",
    roleKey: "andre",
    photo: MENTOR_PHOTOS["André Hodder"],
  },
  {
    name: "Louis Palmer",
    roleKey: "louis",
    photo: MENTOR_PHOTOS["Louis Palmer"],
  },
  {
    name: "Prof. Dr. Werner Stednitz",
    roleKey: "werner",
    photo: MENTOR_PHOTOS["Prof. Dr. Werner Stednitz"],
  },
];

export const Route = createFileRoute("/_site/$lang/a-propos")({
  loader: async ({ location }) => {
    const locale = localeFromPathname(location.pathname);
    const dict = await getDictionary(locale);
    return { locale, dict };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const dict = loaderData.dict;
    return metadataToHead(
      buildMetadata({
        locale: loaderData.locale,
        title: `${dict.meta.about.title} | ${SITE_NAME}`,
        description: dict.meta.about.description,
        path: "/a-propos",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: AboutPage,
});

function AboutPage() {
  const { locale, dict } = Route.useLoaderData();
  const a = dict.about;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={t(dict, "breadcrumb.ariaLabel")}
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
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-secondary">
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
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-secondary">
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

      <section className="bg-muted">
        <div className="container-premium section-padding">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">{a.education_title}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {a.education_body}
          </p>
          <h2 className="mt-12 font-heading text-2xl font-bold sm:text-3xl">{a.today_title}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{a.today_body}</p>
          <div className="mt-6">
            <Lightbox src="/images/soleva-today.webp" alt={a.today_title}>
              <Image
                src="/images/soleva-today.webp"
                alt={a.today_title}
                width={1813}
                height={940}
                className="h-auto w-full rounded-2xl bg-white"
                sizes="100vw"
              />
            </Lightbox>
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
            <Lightbox src="/images/timeline.webp" alt={a.timeline_alt}>
              <Image
                src="/images/timeline.webp"
                srcSet="/images/timeline-480.webp 480w, /images/timeline-800.webp 800w, /images/timeline.webp 2010w"
                sizes="100vw"
                alt={a.timeline_alt}
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
              <Reveal key={`member-${i}`} delay={i * 0.04}>
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
                    {t(dict, `about.teamRoles.${member.roleKey}`)}
                  </p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-2 text-xs text-secondary hover:underline"
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
              <Reveal key={`mentor-${i}`} delay={i * 0.06}>
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
                    {t(dict, `about.mentorRoles.${mentor.roleKey}`)}
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
            {pressAppearances.map((item, i) => (
              <Reveal key={`press-${i}`} delay={i * 0.03}>
                <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
                  <div className="relative h-10 w-20">
                    <Image
                      src={PRESS_LOGOS[item.media] || "/images/soleva-icon.webp"}
                      alt={item.media}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  {item.url && item.linkStatus !== "broken" ? (
                    <a
                      className="font-heading text-xs font-bold text-secondary hover:underline"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.media}
                    </a>
                  ) : (
                    <span className="font-heading text-xs font-bold">{item.media}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {t(dict, `about.pressTypes.${item.type}`)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {[item.date, item.language].filter(Boolean).join(" · ")}
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
