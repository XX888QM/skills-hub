"use client";

import { type ReactNode, type Ref, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-client";

function prefersMotion(callback: () => void) {
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", callback);
  return () => media.revert();
}

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      prefersMotion(() => {
        const el = ref.current;
        if (!el) return;
        gsap.set(el, { autoAlpha: 0, y: 36 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      }),
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () =>
      prefersMotion(() => {
        const node = text.current;
        const trigger = wrap.current;
        if (!node || !trigger) return;
        gsap.set(node, { autoAlpha: 0, y: 28 });
        ScrollTrigger.create({
          trigger,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(node, {
              autoAlpha: 1,
              y: 0,
              duration: 1.05,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      }),
    { scope: wrap },
  );

  return (
    <div ref={wrap}>
      <Tag ref={text as Ref<HTMLHeadingElement>} className={className}>
        {children}
      </Tag>
    </div>
  );
}

export function RevealStagger({
  children,
  className,
  batchMax = 3,
}: {
  children: ReactNode;
  className?: string;
  batchMax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      prefersMotion(() => {
        const items = gsap.utils.toArray<HTMLElement>(".reveal-item");
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y: 48 });
        ScrollTrigger.batch(items, {
          start: "top 88%",
          interval: 0.14,
          batchMax,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: true,
            }),
        });
      }),
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
