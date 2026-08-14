import { KeepTogether } from "@/components/KeepTogether";
import { PageFrame } from "@/components/PageFrame";
import { SkillCatalogFallback } from "@/components/SkillCatalog";
import { translate } from "@/lib/i18n";

export default function SkillsLoading() {
  return (
    <PageFrame className="space-y-12">
      <div className="max-w-4xl">
        <h1 className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          {translate("zh", "skills.title")}
        </h1>
        <p className="mt-5 text-pretty text-lg leading-8 text-quiet">
          <KeepTogether>{translate("zh", "skills.sub")}</KeepTogether>
        </p>
      </div>
      <SkillCatalogFallback />
    </PageFrame>
  );
}
