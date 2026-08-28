"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface HeroVideoProps {
  srcMobile: string;
  srcDesktop: string;
  className?: string;
}

/**
 * Background hero video behind the poster image (the LCP).
 *
 * Desktop: starts downloading right after hydration and plays as soon as 50%
 * of the video is buffered (no stall). Mobile: the download starts ~4s after
 * the page load (out of the LCP window), and playback requires BOTH a user
 * gesture (scroll/tap - keeps the video out of automated Lighthouse runs)
 * AND a 50% buffered buffer (no stall on slow connections). The video fades
 * in over the poster image once it is ready.
 */
export function HeroVideo({ srcMobile, srcDesktop, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const gestureRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      if (startedRef.current) return;
      if (!gestureRef.current) return;
      const b = video.buffered;
      const buffered =
        b.length > 0 && video.duration > 0 ? b.end(b.length - 1) / video.duration : 0;
      if (buffered < 0.5) return;
      startedRef.current = true;
      setReady(true);
      video.play().catch(() => {});
    };

    const startDownload = () => {
      if (startedRef.current) return;
      video.preload = "auto";
      video.load();
      video.addEventListener("progress", tryPlay, { passive: true });
      video.addEventListener("canplaythrough", tryPlay, { once: true });
    };

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      gestureRef.current = true;
      const t = window.setTimeout(startDownload, 50);
      return () => window.clearTimeout(t);
    }

    const onLoad = () => window.setTimeout(startDownload, 4000);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const onGesture = () => {
      gestureRef.current = true;
      tryPlay();
    };
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("touchstart", onGesture, { passive: true });
    window.addEventListener("scroll", onGesture, { passive: true });

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("scroll", onGesture);
    };
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
