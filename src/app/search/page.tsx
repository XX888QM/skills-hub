import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { SkillList } from "@/components/SkillRow";
import { searchSkills } from "@/lib/sources";
import { localizeRecords } from "@/lib/translate";

export const revalidate = 180;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const skills = query
    ? await localizeRecords((await searchSkills(query)).slice(0, 60))
    : [];

  return (
    <PageFrame className="space-y-12">
      <div className="max-w-3xl">
        <RevealHeading as="h1" className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          检索
        </RevealHeading>
        <Reveal className="mt-8">
          <SearchBar initial={query} large showSuggestions={!query} />
        </Reveal>
      </div>
      {query ? (
        <Reveal>
          <p className="mb-6 text-quiet">
            「{query}」共 {skills.length} 条。说明已译成中文，重复项已合并。
          </p>
          <SkillList skills={skills} />
        </Reveal>
      ) : (
        <Reveal>
          <p className="text-lg text-quiet">输入关键词后，会同时查 skills.sh 和 SkillMD。</p>
        </Reveal>
      )}
    </PageFrame>
  );
}
