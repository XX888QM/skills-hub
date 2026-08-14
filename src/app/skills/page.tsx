import { Suspense } from "react";
import type { Metadata } from "next";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { SkillCatalog, SkillCatalogFallback } from "@/components/SkillCatalog";
import { Tx } from "@/components/Tx";
import { loadCatalogFirstPage } from "@/lib/stars";
import { pageMeta, siteConfig } from "@/lib/site";
import { localizeRecordsBounded } from "@/lib/translate";
import type { CatalogItem } from "@/lib/types";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: pageMeta.skills.title,
  description: pageMeta.skills.description,
  alternates: { canonical: "/skills" },
  openGraph: {
    title: `${pageMeta.skills.title} · ${siteConfig.name}`,
    description: pageMeta.skills.description,
    url: "/skills",
  },
};

async function SkillsCatalogLoader() {
  let catalog: { items: CatalogItem[]; hasMore: boolean };
  try {
    const first = await loadCatalogFirstPage();
    const localized = await localizeRecordsBounded(first.items, 1200);
    const items: CatalogItem[] = localized.map((skill, index) => ({
      ...first.items[index],
      ...skill,
      stars: first.items[index]?.stars,
      forks: first.items[index]?.forks,
      pushedAt: first.items[index]?.pushedAt,
    }));
    catalog = { items, hasMore: first.hasMore };
  } catch {
    catalog = { items: [], hasMore: true };
  }
  return <SkillCatalog items={catalog.items} hasMore={catalog.hasMore} />;
}

export default function SkillsPage() {
  return (
    <PageFrame className="space-y-12">
      <div className="max-w-4xl">
        <RevealHeading as="h1" className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          <Tx k="skills.title" />
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-pretty text-lg leading-8 text-quiet">
            <Tx k="skills.sub" />
          </p>
        </Reveal>
      </div>
      <Suspense fallback={<SkillCatalogFallback />}>
        <Reveal>
          <SkillsCatalogLoader />
        </Reveal>
      </Suspense>
    </PageFrame>
  );
}
