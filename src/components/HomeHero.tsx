"use client";

import { HeroTitle } from "@/components/HeroTitle";
import { SearchBar } from "@/components/SearchBar";
import { Tx } from "@/components/Tx";
import { gsap, useGSAP } from "@/lib/gsap-client";
import { useRef } from "react";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>(".hero-line");
        if (lines.length) {
          gsap.from(lines, {
            autoAlpha: 0,
            y: 28,
            duration: 0.9,
            stagger: 0.12,
            delay: 0.28,
            ease: "power3.out",
          });
        }
        const glow = ref.current?.querySelector(".hero-glow");
        if (glow && ref.current) {
          gsap.to(glow, {
            yPercent: 28,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
        }
        gsap.to(".hero-stage", {
          autoAlpha: 0.35,
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });
      return () => media.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden"
    >
      <div
        className="hero-glow pointer-events-none absolute inset-x-0 top-[-20%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_58%)]"
        aria-hidden
      />
      <div className="hero-stage mx-auto w-full max-w-6xl px-6 py-20 text-center sm:px-8 sm:py-28">
        <HeroTitle />
        <p className="hero-line mx-auto mt-7 max-w-2xl text-pretty text-lg leading-8 text-quiet sm:text-xl">
          <Tx k="hero.sub" />
        </p>
        <div className="hero-line mx-auto mt-12 max-w-2xl">
          <SearchBar large showSuggestions />
        </div>
      </div>
    </section>
  );
}
