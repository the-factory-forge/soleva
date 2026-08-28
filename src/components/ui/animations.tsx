"use client";

import { LazyMotion, domAnimation, m, type Variants } from "motion/react";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { cn } from "#/lib/utils";

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export interface AnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: AnimationProps) {
  const hydrated = useHydrated();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={hydrated ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function FadeIn({ children, delay = 0, className }: AnimationProps) {
  const hydrated = useHydrated();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={hydrated ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeIn}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function ScaleIn({ children, delay = 0, className }: AnimationProps) {
  const hydrated = useHydrated();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={hydrated ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={scaleIn}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  as?: "div" | "ul" | "ol";
}) {
  const hydrated = useHydrated();
  const MotionTag = m[as] as typeof m.div;
  return (
    <LazyMotion features={domAnimation}>
      <MotionTag
        initial={hydrated ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: { transition: { staggerChildren: staggerDelay } },
        }}
        className={cn(className)}
      >
        {children}
      </MotionTag>
    </LazyMotion>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const MotionTag = m[as] as typeof m.div;
  return (
    <LazyMotion features={domAnimation}>
      <MotionTag
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </MotionTag>
    </LazyMotion>
  );
}

export function HeroAnimation({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const hydrated = useHydrated();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={hydrated ? { opacity: 0, y: 30 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function ImageReveal({ children, delay = 0, className }: AnimationProps) {
  const hydrated = useHydrated();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={hydrated ? { opacity: 0, scale: 1.05 } : false}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
