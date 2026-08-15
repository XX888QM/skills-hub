import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HomeHero } from "@/components/HomeHero";
import { SectionInner } from "@/components/PageFrame";
import { Tx } from "@/components/Tx";
import { TrendingGrid, TrendingGridFallback } from "@/components/TrendingGrid";
import { loadStarBoard } from "@/lib/stars";

export const revalidate = 86400;

async function DailyHot() {
  const board = await loadStarBoard(12);
  return (
    <section className="border-b border-border py-24 sm:py-32">
      <SectionInner className="max-w-[1440px] lg:px-12">
        <SectionLabel textKey="home.sectionHot" />
        <h2 className="font-editorial mt-5 text-balance text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl">
          <Tx k="home.hotTitle" />
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-quiet">
          <Tx k="home.hotSub" />
        </p>
        <div className="mt-14"><TrendingGrid items={board.slice(0, 6)} /></div>
      </SectionInner>
    </section>
  );
}

function DailyHotFallback() {
  return (
    <section className="border-b border-border py-24 sm:py-32">
      <SectionInner className="max-w-[1440px] lg:px-12">
        <SectionLabel textKey="home.sectionHot" />
        <h2 className="font-editorial mt-5 text-balance text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl"><Tx k="home.hotTitle" /></h2>
        <div className="mt-14"><TrendingGridFallback /></div>
      </SectionInner>
    </section>
  );
}

function SectionLabel({ textKey }: { textKey: string }) {
  return <p className="font-mono text-xs tracking-[0.16em] text-quiet uppercase"><Tx k={textKey} /></p>;
}

export default function HomePage() {
  return (
    <div>
      <HomeHero />

      <section className="border-b border-border py-24 sm:py-32">
        <SectionInner className="max-w-[1440px] lg:px-12">
          <SectionLabel textKey="home.sectionPacks" />
          <h2 className="font-editorial mt-5 text-balance text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl"><Tx k="home.packsTitle" /></h2>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-quiet"><Tx k="home.packsSub" /></p>
          <div className="mt-14"><CategoryGrid editorial /></div>
        </SectionInner>
      </section>

      <Suspense fallback={<DailyHotFallback />}>
        <DailyHot />
      </Suspense>

      <section className="border-b border-border py-24 sm:py-32">
        <SectionInner className="max-w-[1440px] lg:px-12">
          <SectionLabel textKey="home.sectionTrust" />
          <h2 className="font-editorial mt-5 text-balance text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl"><Tx k="home.trustTitle" /></h2>
          <div className="mt-14 grid border-t border-l border-border md:grid-cols-3">
            {[
              { title: "home.p1t", text: "home.p1d" },
              { title: "home.p2t", text: "home.p2d" },
              { title: "home.p3t", text: "home.p3d" },
            ].map((item, index) => (
              <article key={item.title} className="border-r border-b border-border p-8 sm:p-10">
                <span className="font-mono text-xs text-quiet">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-editorial mt-12 text-balance text-3xl font-normal leading-[1.2] tracking-tight">
                  <Tx k={item.title} />
                </h3>
                <p className="mt-4 max-w-2xl text-pretty text-lg leading-8 text-quiet">
                  <Tx k={item.text} />
                </p>
              </article>
            ))}
          </div>
        </SectionInner>
      </section>

      <section>
        <SectionInner className="max-w-[1440px] py-24 sm:py-32 lg:px-12">
          <div className="border border-border p-8 sm:p-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div>
              <SectionLabel textKey="home.sectionPublic" />
              <h2 className="font-editorial mt-5 text-balance text-4xl font-normal leading-[1.1] tracking-tight sm:text-6xl">
              <Tx k="home.ctaTitle" />
              </h2>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-quiet"><Tx k="home.ctaText" /></p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-5 lg:mt-0">
              <Link
                href="/packs"
                className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap border border-border px-6 py-3 text-base transition-colors hover:bg-surface"
              >
                <Tx k="home.packsCta" />
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href="/submit"
                className="inline-flex min-h-12 items-center whitespace-nowrap rounded-lg bg-[#eeeae1] px-6 text-base font-medium text-[#0a0a08] transition-opacity hover:opacity-85"
              >
                <Tx k="home.ctaBtn" />
              </Link>
            </div>
          </div>
        </SectionInner>
      </section>
    </div>
  );
}
