"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  srcMobile: string;
  srcDesktop: string;
  className?: string;
}

/**
 * Background hero video. Desktop: starts right after hydration like the
 * original autoplay (preload auto + play once the buffer can play).
 * Mobile: waits for the page load (keeps the poster image as the LCP), then
 * fills the buffer before playing (no stall). The poster image stays below
 * and is revealed by the fade - the video never has its own poster attribute
 * (that would double-download the poster without priority).
 */
export function HeroVideo({ srcMobile, srcDesktop, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      video.preload = "auto";
      video.load();
      const tryPlay = () => video.play().catch(() => {});
      if (video.readyState >= 3) tryPlay();
      else video.addEventListener("canplay", tryPlay, { once: true });
    };

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      // Desktop: behave like the original autoplay (start quickly).
      const t = window.setTimeout(start, 50);
      return () => window.clearTimeout(t);
    }

    // Mobile: only start after the page has fully loaded (post critical path).
    const onLoad = () => window.setTimeout(start, 300);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      onLoadedData={() => setReady(true)}
      className={cn(
        "h-full w-full object-cover transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <source src={srcDesktop} type="video/mp4" media="(min-width: 1024px)" />
      <source src={srcMobile} type="video/mp4" />
    </video>
  );
}
