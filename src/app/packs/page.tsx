import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading, RevealStagger } from "@/components/Reveal";
import { Tx } from "@/components/Tx";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: pageMeta.packs.title,
  description: pageMeta.packs.description,
  alternates: { canonical: "/packs" },
  openGraph: {
    title: `${pageMeta.packs.title} · 汇总skill`,
    description: pageMeta.packs.description,
    url: "/packs",
  },
};

export default function PacksPage() {
  return (
    <PageFrame className="space-y-12">
      <div className="max-w-2xl">
        <RevealHeading as="h1" className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          <Tx k="packs.title" />
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-pretty text-lg leading-8 text-quiet">
            <Tx k="packs.sub" />
          </p>
        </Reveal>
      </div>
      <RevealStagger>
        <CategoryGrid />
      </RevealStagger>
    </PageFrame>
  );
}
