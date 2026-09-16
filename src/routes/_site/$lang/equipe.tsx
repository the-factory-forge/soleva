import { createFileRoute } from "@tanstack/react-router";
import type { SVGProps } from "react";

import { FadeUp as Reveal } from "@/components/animations-lazy";
import { PageHero } from "@/components/layout/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Image } from "@/components/ui/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { IMAGES, MENTOR_PHOTOS, SITE_NAME, SITE_URL, TEAM_PHOTOS } from "@/lib/constants";
import { mentors, teamMembers } from "@/lib/data/team";
import { getDictionary, t } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/i18n/pathname";
import { buildMetadata } from "@/lib/seo/build-metadata";
import { metadataToHead } from "@/lib/seo/head";

// Brand icons were dropped from this lucide-react version, so the LinkedIn mark
// is inlined (official simple-icons path).
function LinkedinIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const Route = createFileRoute("/_site/$lang/equipe")({
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
        title: `${dict.meta.equipe.title} | ${SITE_NAME}`,
        description: dict.meta.equipe.description,
        path: "/equipe",
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
      }),
    );
  },
  component: TeamPage,
});

function TeamPage() {
  const { locale, dict } = Route.useLoaderData();
  const tEquipe = dict.equipe;

  return (
    <>
      <PageHero
        locale={locale}
        breadcrumbAriaLabel={dict.breadcrumb.ariaLabel}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.breadcrumb.equipe, href: "/equipe" }]}
        eyebrow={tEquipe.hero.eyebrow}
        title={tEquipe.hero.title}
        subtitle={tEquipe.hero.subtitle}
        image={IMAGES.team}
      />

      {/* L'équipe */}
      <section className="bg-background [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <SectionHeading title={tEquipe.team_title} />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, i) => {
              const bio = member.bio?.[locale];
              return (
                <Reveal key={`member-${i}`} delay={i * 0.04}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-center">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                      <Image
                        src={TEAM_PHOTOS[member.name] || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold">{member.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(dict, `equipe.roles.${member.roleKey}`)}
                    </p>
                    {bio ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90">{bio}</p>
                    ) : null}
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-3 text-xs text-primary hover:underline"
                      >
                        {member.email}
                      </a>
                    ) : null}
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center justify-center gap-1 text-xs text-primary hover:underline"
                      >
                        <LinkedinIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tuteurs et conseillers externes */}
      <section className="bg-muted [contain-intrinsic-size:auto_800px] [content-visibility:auto]">
        <div className="container-premium section-padding">
          <Reveal>
            <SectionHeading title={tEquipe.mentors_title} />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((mentor, i) => {
              const bio = mentor.bio?.[locale];
              return (
                <Reveal key={`mentor-${i}`} delay={i * 0.06}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-center">
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                      <Image
                        src={MENTOR_PHOTOS[mentor.name] || "/placeholder.svg"}
                        alt={mentor.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <h3 className="mt-3 font-heading text-base font-semibold">{mentor.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(dict, `equipe.mentorRoles.${mentor.roleKey}`)}
                    </p>
                    {bio ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground/90">{bio}</p>
                    ) : null}
                    {mentor.linkedin ? (
                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-1 text-xs text-primary hover:underline"
                      >
                        <LinkedinIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        title={tEquipe.join.title}
        body={tEquipe.join.body}
        buttonLabel={tEquipe.join.button}
        href="/contact"
      />
    </>
  );
}
