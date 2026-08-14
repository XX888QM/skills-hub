import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { Tx, TxInstalls, TxOrigin } from "@/components/Tx";
import { skillHref } from "@/lib/format";
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
            <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-foreground">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              <Tx k="verified" />
            </span>
          ) : null}
        </div>
        {skill.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-quiet">{skill.description}</p>
        ) : null}
      </div>
      <span className="hide-sm truncate text-sm text-quiet">{skill.source}</span>
      <span className="hide-sm text-right font-mono text-sm tabular-nums">
        <TxInstalls value={skill.installs} />
      </span>
      <span className="text-right text-sm text-quiet">
        <TxOrigin origin={skill.origin} />
      </span>
    </Link>
  );
}

export function SkillList({ skills }: { skills: SkillRecord[] }) {
  if (skills.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-quiet">
        <p className="text-pretty">
          <Tx k="empty.skill" />
        </p>
        <p className="mt-2 text-pretty">
          <Tx k="empty.hint" />
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      <div className="catalog-row px-5 py-4 text-xs font-medium text-quiet sm:px-6">
        <span className="whitespace-nowrap">
          <Tx k="catalog.name" />
        </span>
        <span className="hide-sm whitespace-nowrap">
          <Tx k="catalog.repo" />
        </span>
        <span className="hide-sm whitespace-nowrap text-right">
          <Tx k="catalog.installs" />
        </span>
        <span className="whitespace-nowrap text-right">
          <Tx k="skill.origin" />
        </span>
      </div>
      <div className="divide-y divide-muted">
        {skills.map((skill) => (
          <SkillRow key={`${skill.origin}-${skill.id}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}
