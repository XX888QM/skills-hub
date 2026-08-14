import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { SkillList } from "@/components/SkillRow";
import { Tx } from "@/components/Tx";
import { pageMeta } from "@/lib/site";
import { searchSkills } from "@/lib/sources";
import { localizeRecordsBounded } from "@/lib/translate";

export const revalidate = 180;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const title = query ? `检索「${query}」` : pageMeta.search.title;
  const description = query
    ? `在汇总skill 检索「${query}」相关的公开 Agent Skill 与 SKILL.md。同时查询 skills.sh 与 SkillMD。`
    : pageMeta.search.description;
  const path = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
  return {
    title,
    description,
    robots: query ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · 汇总skill`,
      description,
      url: path,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const skills = query
    ? await localizeRecordsBounded((await searchSkills(query)).slice(0, 60), 2000)
    : [];

  return (
    <PageFrame className="space-y-12">
      <div className="max-w-3xl">
        <RevealHeading as="h1" className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          <Tx k="search.title" />
        </RevealHeading>
        <Reveal className="mt-8">
          <SearchBar initial={query} large showSuggestions={!query} />
        </Reveal>
      </div>
      {query ? (
        <Reveal>
          <p className="mb-6 text-pretty text-quiet">
            <Tx k="search.results" values={{ q: query, n: skills.length }} />
          </p>
          <SkillList skills={skills} />
        </Reveal>
      ) : (
        <Reveal>
          <p className="text-pretty text-lg text-quiet">
            <Tx k="search.hint" />
          </p>
        </Reveal>
      )}
    </PageFrame>
  );
}
