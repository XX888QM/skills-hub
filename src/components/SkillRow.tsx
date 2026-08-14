import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { formatInstalls, skillHref } from "@/lib/format";
import { originLabel } from "@/lib/translate";
import type { SkillRecord } from "@/lib/types";

export function SkillRow({ skill }: { skill: SkillRecord }) {
  return (
    <Link
      href={skillHref(skill.id)}
      className="catalog-row px-5 py-5 transition-colors duration-200 hover:bg-muted sm:px-6"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{skill.name}</span>
          {skill.verified ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              已核验
            </span>
          ) : null}
        </div>
        {skill.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-quiet">{skill.description}</p>
        ) : null}
      </div>
      <span className="hide-sm truncate text-sm text-quiet">{skill.source}</span>
      <span className="hide-sm text-right font-mono text-sm tabular-nums">
        {formatInstalls(skill.installs)}
      </span>
      <span className="text-right text-sm text-quiet">{originLabel(skill.origin)}</span>
    </Link>
  );
}

export function SkillList({ skills }: { skills: SkillRecord[] }) {
  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-quiet">
        <p>没有找到匹配的 Skill。</p>
        <p className="mt-2">换个中文场景词，或到上架页贴 `owner/repo` 解析。</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      <div className="catalog-row px-5 py-4 text-xs font-medium text-quiet sm:px-6">
        <span>名称</span>
        <span className="hide-sm">仓库</span>
        <span className="hide-sm text-right">安装量</span>
        <span className="text-right">来源</span>
      </div>
      <div className="divide-y divide-muted">
        {skills.map((skill) => (
          <SkillRow key={`${skill.origin}-${skill.id}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}
