"use client";

import { lazy, Suspense, type ReactNode } from "react";

import { cn } from "#/lib/utils";

// Lazy wrappers around ./ui/animations (motion): the animation chunk is loaded
// dynamically instead of being modulepreloaded in the home critical path.
// The Suspense fallback renders the content visible (no flash) while loading.
interface WrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const FadeUpImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.FadeUp })),
);
const FadeInImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.FadeIn })),
);
const ScaleInImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.ScaleIn })),
);
const StaggerContainerImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.StaggerContainer })),
);
const StaggerItemImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.StaggerItem })),
);
const HeroAnimationImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.HeroAnimation })),
);
const ImageRevealImpl = lazy(() =>
  import("@/components/ui/animations").then((m) => ({ default: m.ImageReveal })),
);

function fallback(className?: string, children?: ReactNode) {
  return <div className={cn(className)}>{children}</div>;
}

export function FadeUp(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <FadeUpImpl {...props} />
    </Suspense>
  );
}

export function FadeIn(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <FadeInImpl {...props} />
    </Suspense>
  );
}

export function ScaleIn(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <ScaleInImpl {...props} />
    </Suspense>
  );
}

export function StaggerContainer(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <StaggerContainerImpl {...props} />
    </Suspense>
  );
}

export function StaggerItem(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <StaggerItemImpl {...props} />
    </Suspense>
  );
}

export function HeroAnimation(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <HeroAnimationImpl {...props} />
    </Suspense>
  );
}

export function ImageReveal(props: WrapperProps) {
  return (
    <Suspense fallback={fallback(props.className, props.children)}>
      <ImageRevealImpl {...props} />
    </Suspense>
  );
}
