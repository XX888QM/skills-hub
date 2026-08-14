import type { Metadata } from "next";
import Link from "next/link";
import { CopyForAgent } from "@/components/CopyForAgent";
import { InstallCommand } from "@/components/InstallCommand";
import { JsonLd } from "@/components/JsonLd";
import { KeepTogether } from "@/components/KeepTogether";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { Tx } from "@/components/Tx";
import { getSiteUrl, pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: pageMeta.guide.title,
  description: pageMeta.guide.description,
  alternates: { canonical: "/guide" },
  openGraph: {
    title: `${pageMeta.guide.title} · 汇总skill`,
    description: pageMeta.guide.description,
    url: "/guide",
  },
};

const steps = [
  {
    id: "s1",
    extra: (
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-lg">
        <Link href="/search" className="whitespace-nowrap underline underline-offset-4">
          <Tx k="guide.s1a" />
        </Link>
        <Link href="/packs" className="whitespace-nowrap underline underline-offset-4">
          <Tx k="guide.s1b" />
        </Link>
      </p>
    ),
  },
  { id: "s2" },
  {
    id: "s3",
    extra: (
      <div className="mt-6 space-y-4">
        <InstallCommand source="anthropics/skills" />
        <CopyForAgent source="anthropics/skills" name="skills" />
        <div className="space-y-2 font-mono text-sm leading-7 text-quiet">
          <p>Cursor · ~/.cursor/skills/</p>
          <p>Claude · ~/.claude/skills/</p>
          <p>Codex · ~/.agents/skills/</p>
        </div>
      </div>
    ),
  },
  {
    id: "s4",
    extra: (
      <p className="mt-5 font-mono text-sm leading-7 text-quiet">
        <Tx k="guide.s4e" />
      </p>
    ),
  },
  {
    id: "s5",
    extra: (
      <p className="mt-5 text-lg">
        <Link href="/submit" className="whitespace-nowrap underline underline-offset-4">
          <Tx k="guide.s5a" />
        </Link>
      </p>
    ),
  },
] as const;

const faqs = [
  {
    q: "汇总skill 是什么？",
    a: "汇总skill 是中文 Agent Skills 市场。它帮助开发者检索 GitHub 上已经公开的 Agent Skill 与 SKILL.md，阅读说明书，再复制安装命令。",
  },
  {
    q: "什么是 Agent Skill？",
    a: "Agent Skill 通常是公开仓库里的一份 SKILL.md，写明名称、用途和给 Agent 的操作说明。合格条目需要同时有 name 和 description。",
  },
  {
    q: "怎么安装 skill？",
    a: "在详情页复制 npx skills add owner/repo，或复制「给 Agent」的提示词让对话里的 AI 代装。先读说明书，确认可以接受后再执行。",
  },
  {
    q: "星标是单条 skill 的评分吗？",
    a: "不是。星标是整个 GitHub 仓库的 star 数。同一仓库里的多条 skill 共用这组数字。安装量来自安装榜，和星标不是一回事。",
  },
  {
    q: "汇总skill 会爬全站吗？数据从哪来？",
    a: "不会爬全站。本站按需读取 skills.sh、SkillMD 与 GitHub Search / Contents 等公开接口，不另存一份拷贝。仓库还在原处。",
  },
  {
    q: "如何上架自己的 skill？",
    a: "把公开 GitHub 仓库保持可见，在 /submit 贴上 owner/repo。本站用 GitHub 接口读目录，只收录合格的 SKILL.md。",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
    url: `${getSiteUrl()}/guide`,
  };
}

export default function GuidePage() {
  return (
    <PageFrame>
      <JsonLd data={faqJsonLd()} />
      <div className="max-w-3xl">
        <RevealHeading as="h1" className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          <Tx k="guide.title" />
        </RevealHeading>
        <Reveal>
          <p className="mt-6 max-w-2xl text-pretty text-xl leading-8 text-quiet">
            <KeepTogether>
              <Tx k="guide.sub" />
            </KeepTogether>
          </p>
        </Reveal>
      </div>

      <Reveal>
        <ol className="mt-20 divide-y divide-border border-y border-border">
          {steps.map((step) => (
            <li key={step.id} className="grid gap-4 py-12 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-12 sm:py-16">
              <p className="shrink-0 whitespace-nowrap text-sm text-quiet">
                <Tx k={`guide.${step.id}l`} />
              </p>
              <div className="min-w-0">
                <h2 className="text-pretty text-2xl font-normal tracking-tight sm:text-3xl">
                  <KeepTogether>
                    <Tx k={`guide.${step.id}t`} />
                  </KeepTogether>
                </h2>
                <p className="mt-4 max-w-2xl text-pretty text-lg leading-8 text-quiet">
                  <KeepTogether>
                    <Tx k={`guide.${step.id}d`} />
                  </KeepTogether>
                </p>
                {"extra" in step ? step.extra : null}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <section className="mt-20 max-w-2xl">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
            <Tx k="guide.warnTitle" />
          </h2>
          <p className="mt-5 text-pretty text-lg leading-8 text-quiet">
            <KeepTogether>
              <Tx k="guide.warn" />
            </KeepTogether>
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-20 max-w-2xl">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">
            <Tx k="guide.faqTitle" />
          </h2>
          <dl className="mt-10 divide-y divide-border border-y border-border">
            {faqs.map((item) => (
              <div key={item.q} className="py-8">
                <dt className="text-pretty text-xl font-normal tracking-tight">
                  <KeepTogether>{item.q}</KeepTogether>
                </dt>
                <dd className="mt-3 text-pretty text-lg leading-8 text-quiet">
                  <KeepTogether>{item.a}</KeepTogether>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>
    </PageFrame>
  );
}
