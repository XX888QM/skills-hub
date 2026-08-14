import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { SkillList } from "@/components/SkillRow";
import { Tx } from "@/components/Tx";
import { packMessageKey, scenePacks } from "@/lib/packs";
import { searchSkills } from "@/lib/sources";
import { localizeRecordsBounded } from "@/lib/translate";

export const revalidate = 180;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pack = scenePacks.find((item) => item.slug === slug);
  if (!pack) return { title: "场景包" };
  return {
    title: pack.title,
    description: `${pack.summary} 这是汇总skill 上的场景包，结果来自公开 Agent Skill 检索。`,
    alternates: { canonical: `/packs/${pack.slug}` },
    openGraph: {
      title: `${pack.title} · 汇总skill`,
      description: pack.summary,
      url: `/packs/${pack.slug}`,
    },
  };
}

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pack = scenePacks.find((item) => item.slug === slug);
  if (!pack) notFound();

  const skills = await localizeRecordsBounded((await searchSkills(pack.query)).slice(0, 40), 2000);

  return (
    <PageFrame className="space-y-12">
      <div className="max-w-2xl">
        <RevealHeading as="h1" className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          <Tx k={packMessageKey(pack.slug, "title")} />
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-pretty text-lg leading-8 text-quiet">
            <Tx k={packMessageKey(pack.slug, "summary")} />
          </p>
        </Reveal>
      </div>
      <Reveal className="max-w-3xl">
        <SearchBar initial={pack.query} large />
      </Reveal>
      <Reveal>
        <SkillList skills={skills} />
      </Reveal>
    </PageFrame>
  );
}
