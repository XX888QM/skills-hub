"use client";

import { useRef } from "react";
import { useI18n } from "@/components/I18nProvider";
import { gsap, useGSAP } from "@/lib/gsap-client";

export function HeroTitle() {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>(".hero-line-title");
        const glow = ref.current?.querySelector(".hero-title-glow");

        gsap.fromTo(
          lines,
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.18,
            ease: "power3.out",
          },
        );

        if (glow) {
          gsap.fromTo(
            glow,
            { autoAlpha: 0, scale: 0.88 },
            { autoAlpha: 0.7, scale: 1, duration: 1.6, ease: "power2.out" },
          );
          gsap.to(glow, {
            autoAlpha: 0.35,
            duration: 3.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 1.4,
          });
        }
      });
      return () => media.revert();
    },
    { scope: ref, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <h1
      ref={ref}
      className="hero-title relative mx-auto max-w-6xl text-balance text-[2.4rem] leading-[1.25] font-normal tracking-tight sm:text-6xl xl:text-7xl"
    >
      <span
        className="hero-title-glow pointer-events-none absolute top-1/2 left-1/2 h-[78%] w-[82%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(64,255,242,0.22),rgba(255,62,200,0.12)_52%,transparent_70%)]"
        aria-hidden
      />
      <span className="hero-line-title hero-title-neon-cyan relative block">
        {t("hero.title1")}
      </span>
      <span className="hero-line-title hero-title-neon-pink relative block">
        {t("hero.title2")}
      </span>
    </h1>
  );
}
