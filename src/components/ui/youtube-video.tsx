import { PlayIcon } from "lucide-react";
import { useState } from "react";

import { Image } from "@/components/ui/image";
import { srcSetFor } from "@/lib/constants";

export function YoutubeVideo({
  videoId,
  title,
  poster,
  playLabel,
}: {
  videoId: string;
  title: string;
  poster: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  return playing ? (
    <iframe
      className="h-full w-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${playLabel} : ${title}`}
      className="group relative flex h-full w-full items-center justify-center bg-muted focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary"
    >
      <Image src={poster} srcSet={srcSetFor(poster)} sizes="(max-width: 768px) 100vw, 768px" alt="" fill className="object-cover" />
      <span className="relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
        <PlayIcon className="size-7" aria-hidden="true" />
      </span>
    </button>
  );
}
