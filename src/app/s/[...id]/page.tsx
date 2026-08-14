import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { SkillContent } from "@/components/SkillContent";
import { decodeSkillId, splitSkillId } from "@/lib/format";
import { loadSkillDetail, searchSkills } from "@/lib/sources";
import { localizeDetail } from "@/lib/translate";

export const revalidate = 180;

export default async function SkillPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const { id: parts } = await params;
  const id = decodeSkillId(parts);
  const hint = (await searchSkills(splitSkillId(id).name)).find(
    (item) => item.id === id || item.source === splitSkillId(id).source,
  );
  const raw = await loadSkillDetail(id, hint);
  if (!raw) notFound();
  const skill = await localizeDetail(raw);

  return (
    <PageFrame>
      <SkillContent skill={skill} />
    </PageFrame>
  );
}
