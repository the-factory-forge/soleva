import type { LucideIcon } from "lucide-react";
import { Home, Sun, Zap } from "lucide-react";

// Soleva pillars: electric conversion, on-board solar system, low-carbon habitat.

export interface Service {
  slug: string;
  icon: LucideIcon;
  image?: string;
}

export const services: Service[] = [
  {
    slug: "conversion-electrique",
    icon: Zap,
    image: "/images/van-exterior.webp",
  },
  {
    slug: "systeme-solaire",
    icon: Sun,
    image: "/images/solar-panels.webp",
  },
  {
    slug: "habitat",
    icon: Home,
    image: "/images/habitat.webp",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
