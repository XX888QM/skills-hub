import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { SectionInner } from "@/components/PageFrame";
import { Reveal, RevealHeading, RevealStagger } from "@/components/Reveal";
import { StarBoard, StarBoardFallback } from "@/components/StarBoard";
import { TrendingGrid, TrendingGridFallback } from "@/components/TrendingGrid";
import { loadStarBoard } from "@/lib/stars";

export const revalidate = 86400;

async function DailyHot() {
  const board = await loadStarBoard(12);
  return (
    <>
      <section className="py-24 sm:py-32">
        <SectionInner>
          <RevealHeading className="max-w-3xl text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
            今天最被盯着的仓库。
          </RevealHeading>
          <Reveal>
            <p className="mt-5 max-w-xl text-lg leading-8 text-quiet">
              按仓库星标排序，每天自动更新一次。点进去先看说明书，再决定装不装。
            </p>
          </Reveal>
          <RevealStagger className="mt-14">
            <TrendingGrid items={board.slice(0, 6)} />
          </RevealStagger>
        </SectionInner>
      </section>

      <section className="border-t border-border/70 py-24 sm:py-32">
        <SectionInner>
          <RevealHeading className="max-w-3xl text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
            按星标排。
          </RevealHeading>
          <Reveal>
            <p className="mt-5 max-w-xl text-lg leading-8 text-quiet">
              同一仓库里的多条 skill 共用这组星标。数字是仓库的，不是单条说明书的。
            </p>
          </Reveal>
          <RevealStagger className="mt-14" batchMax={4}>
            <StarBoard items={board} />
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
          <h2 className="max-w-3xl text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
            今天最被盯着的仓库。
          </h2>
          <div className="mt-14">
            <TrendingGridFallback />
          </div>
        </SectionInner>
      </section>
      <section className="border-t border-border/70 py-24 sm:py-32">
        <SectionInner>
          <h2 className="max-w-3xl text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
            按星标排。
          </h2>
          <div className="mt-14">
            <StarBoardFallback />
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

      <Suspense fallback={<DailyHotFallback />}>
        <DailyHot />
      </Suspense>

      <section className="border-t border-border/70 py-24 sm:py-32">
        <SectionInner className="max-w-4xl">
          <RevealStagger batchMax={1}>
            {[
              { title: "不爬站。", text: "GitHub、skills.sh、SkillMD 按需读取，仓库还在原处。" },
              { title: "说明书是中文。", text: "说明和正文译成中文，代码和命令保持原样。" },
              { title: "先看再装。", text: "带脚本的会标出来。星标、安装量分开显示。" },
            ].map((item) => (
              <div key={item.title} className="reveal-item border-t border-border py-12 first:border-t-0 first:pt-0 sm:py-16">
                <h2 className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-5xl">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-quiet">{item.text}</p>
              </div>
            ))}
          </RevealStagger>
        </SectionInner>
      </section>

      <section className="bg-accent text-on-accent">
        <SectionInner className="py-24 sm:py-32">
          <Reveal>
            <h2 className="max-w-3xl text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
              仓库已经公开？直接上架。
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-on-accent/70">
              贴上 owner/repo，我们用 GitHub 接口读 SKILL.md，不另存一份拷贝。
            </p>
            <Link
              href="/submit"
              className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-background px-6 py-3 text-base font-medium text-foreground transition-opacity duration-200 hover:opacity-80"
            >
              去上架
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
          </Reveal>
        </SectionInner>
      </section>
    </div>
  );
}
