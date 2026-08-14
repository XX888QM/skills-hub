import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { SkillList } from "@/components/SkillRow";
import { scenePacks } from "@/lib/packs";
import { searchSkills } from "@/lib/sources";
import { localizeRecords } from "@/lib/translate";

export const revalidate = 180;

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pack = scenePacks.find((item) => item.slug === slug);
  if (!pack) notFound();

  const skills = await localizeRecords((await searchSkills(pack.query)).slice(0, 40));

  return (
    <PageFrame className="space-y-12">
      <div className="max-w-2xl">
        <RevealHeading as="h1" className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          {pack.title}
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-lg leading-8 text-quiet">{pack.summary}</p>
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
