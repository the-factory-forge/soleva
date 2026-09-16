import { ArrowRight, PauseIcon, PlayIcon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { IMAGES } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/navigation";

export function HomeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => setPaused(true));
    };
    updatePlayback();
    preference.addEventListener("change", updatePlayback);
    return () => preference.removeEventListener("change", updatePlayback);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
      <div className="absolute inset-0 -z-10">
        <Image
          src={IMAGES.videoPoster}
          srcSet={`/images/video-poster-480.webp 480w, /images/video-poster-800.webp 800w, ${IMAGES.videoPoster} 1600w`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          id="home-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={IMAGES.videoPoster}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
          onPause={() => setPaused(true)}
          onPlay={() => setPaused(false)}
        >
          <source src="/images/hero-video-720p.mp4" type="video/mp4" media="(min-width: 1024px)" />
          <source src="/images/hero-video-480p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/30" />
      </div>

      <div className="container-premium flex min-h-[92vh] flex-col justify-center py-32">
        <div className="max-w-2xl">
          <p className="hero-enter inline-flex items-center gap-2 rounded-full border border-primary/40 bg-dark/70 px-4 py-1.5 text-sm font-medium text-primary">
            <Sun className="h-4 w-4" aria-hidden="true" />
            {dict.home.hero.eyebrow}
          </p>
          <h1 className="hero-enter mt-6 font-heading text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {dict.home.hero.title}
          </h1>
          <p
            className="hero-enter mt-6 max-w-xl text-lg leading-relaxed text-dark-foreground/80"
            style={{ animationDelay: "80ms" }}
          >
            {dict.home.hero.subtitle}
          </p>
          <div
            className="hero-enter mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "120ms" }}
          >
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              render={
                <Link
                  href={withLocale(locale, "/contact")}
                  className="inline-flex items-center gap-2"
                />
              }
            >
              {dict.home.hero.primary_cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-dark-foreground/30 bg-transparent text-dark-foreground hover:bg-dark-foreground/10 hover:text-dark-foreground"
              render={<Link href={withLocale(locale, "/le-van")} />}
            >
              {dict.home.hero.secondary_cta}
            </Button>
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="absolute right-5 bottom-5 border-white/40 bg-dark text-dark-foreground hover:bg-secondary hover:text-white sm:right-8"
        aria-label={paused ? dict.home.hero.play_video : dict.home.hero.pause_video}
        aria-controls="home-background-video"
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          if (video.paused) void video.play().catch(() => setPaused(true));
          else video.pause();
        }}
      >
        {paused ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
      </Button>
    </section>
  );
}
