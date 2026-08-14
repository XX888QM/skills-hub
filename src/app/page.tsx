import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HomeHero } from "@/components/HomeHero";
import { SectionInner } from "@/components/PageFrame";
import { Tx } from "@/components/Tx";
import { Reveal, RevealHeading, RevealStagger } from "@/components/Reveal";
import { TrendingGrid, TrendingGridFallback } from "@/components/TrendingGrid";
import { loadStarBoard } from "@/lib/stars";

export const revalidate = 86400;

async function DailyHot() {
  const board = await loadStarBoard(12);
  return (
    <>
      <section className="py-24 sm:py-32">
        <SectionInner>
          <RevealHeading className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">
            <Tx k="home.hotTitle" />
          </RevealHeading>
          <Reveal>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-quiet">
              <Tx k="home.hotSub" />
            </p>
          </Reveal>
          <RevealStagger className="mt-14">
            <TrendingGrid items={board.slice(0, 6)} />
          </RevealStagger>
        </SectionInner>
      </section>
    </>
  );
}

function DailyHotFallback() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <SectionInner>
          <h2 className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">
            <Tx k="home.hotTitle" />
          </h2>
          <div className="mt-14">
            <TrendingGridFallback />
          </div>
        </SectionInner>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <div>
      <HomeHero />

      <section className="border-t border-border/70 py-24 sm:py-32">
        <SectionInner>
          <RevealHeading className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">
            <Tx k="home.packsTitle" />
          </RevealHeading>
          <Reveal>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-quiet">
              <Tx k="home.packsSub" />
            </p>
          </Reveal>
          <RevealStagger className="mt-14">
            <CategoryGrid />
          </RevealStagger>
        </SectionInner>
      </section>

      <Suspense fallback={<DailyHotFallback />}>
        <DailyHot />
      </Suspense>

      <section className="border-t border-border/70 py-24 sm:py-32">
        <SectionInner className="max-w-4xl">
          <RevealStagger batchMax={1}>
            {[
              { title: "home.p1t", text: "home.p1d" },
              { title: "home.p2t", text: "home.p2d" },
              { title: "home.p3t", text: "home.p3d" },
            ].map((item) => (
              <div key={item.title} className="reveal-item border-t border-border py-12 first:border-t-0 first:pt-0 sm:py-16">
                <h2 className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-5xl">
                  <Tx k={item.title} />
                </h2>
                <p className="mt-4 max-w-2xl text-pretty text-lg leading-8 text-quiet">
                  <Tx k={item.text} />
                </p>
              </div>
            ))}
          </RevealStagger>
        </SectionInner>
      </section>

      <section className="bg-accent text-on-accent">
        <SectionInner className="py-24 sm:py-32">
          <Reveal>
            <h2 className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-5xl lg:text-6xl">
              <Tx k="home.ctaTitle" />
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-on-accent/70">
              <Tx k="home.ctaText" />
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/packs"
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-2xl bg-[#0a0a0a] px-6 py-3 text-base font-medium text-[#f5f5f5] transition-opacity duration-200 hover:opacity-80"
              >
                <Tx k="home.packsCta" />
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href="/submit"
                className="inline-flex min-h-12 items-center whitespace-nowrap text-base text-on-accent/70 underline-offset-4 hover:underline"
              >
                <Tx k="home.ctaBtn" />
              </Link>
            </div>
          </Reveal>
        </SectionInner>
      </section>
    </div>
  );
}
