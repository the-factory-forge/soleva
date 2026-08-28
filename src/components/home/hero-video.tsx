"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  poster: string;
  srcMobile: string;
  srcDesktop: string;
  className?: string;
}

/**
 * Background hero video, loaded only AFTER the page has finished loading
 * (post critical-path): the LCP stays the poster image, then the video takes
 * over with a fade once it can play. Mobile uses the 480p encode, desktop the
 * 720p one (chosen by the browser via the <source media> attribute).
 */
export function HeroVideo({ poster, srcMobile, srcDesktop, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      video.play().catch(() => {});
    };

    const onLoad = () => {
      window.setTimeout(start, 300);
    };

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
      poster={poster}
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
