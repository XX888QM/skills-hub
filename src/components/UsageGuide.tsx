"use client";

import { useI18n } from "@/components/I18nProvider";
import { InstallCommand } from "@/components/InstallCommand";
import { KeepTogether } from "@/components/KeepTogether";
import type { SkillDetail } from "@/lib/types";

const defaultAgents = ["Cursor", "Claude Code", "Codex"];

const agentNames: Record<string, string> = {
  "claude-code": "Claude Code",
  "claude-ai": "Claude",
  codex: "Codex",
  cursor: "Cursor",
};

export function UsageGuide({ skill }: { skill: SkillDetail }) {
  const { t, locale } = useI18n();
  const agents = (skill.agents?.length ? skill.agents : defaultAgents).map(
    (agent) => agentNames[agent] ?? agent,
  );
  const sep = locale === "zh" || locale === "ja" ? "、" : ", ";

  return (
    <section className="space-y-12">
      <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{t("usage.title")}</h2>
      <ol className="space-y-12">
        <li className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-10">
          <p className="shrink-0 whitespace-nowrap text-sm text-quiet">{t("usage.install")}</p>
          <div className="min-w-0">
            <p className="text-pretty text-lg">
              <KeepTogether>{t("usage.installText")}</KeepTogether>
            </p>
            <div className="mt-5">
              <InstallCommand source={skill.source} />
            </div>
          </div>
        </li>
        <li className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-10">
          <p className="shrink-0 whitespace-nowrap text-sm text-quiet">{t("usage.talk")}</p>
          <div className="min-w-0">
            <p className="text-pretty text-lg">
              <KeepTogether>{t("usage.talkText")}</KeepTogether>
            </p>
            <p className="mt-5 overflow-x-auto font-mono text-sm leading-7 text-quiet">
              <span className="whitespace-nowrap">
                {t("usage.talkExample", {
                  name: skill.name,
                  task: skill.description ? t("usage.talkTask") : t("usage.talkFallback"),
                })}
              </span>
            </p>
          </div>
        </li>
        <li className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-10">
          <p className="shrink-0 whitespace-nowrap text-sm text-quiet">{t("usage.env")}</p>
          <div className="min-w-0">
            <p className="text-pretty text-lg">
              <KeepTogether>{t("usage.envText", { agents: agents.join(sep) })}</KeepTogether>
            </p>
            <div className="mt-5 space-y-2 overflow-x-auto font-mono text-sm leading-7 text-quiet">
              <p className="whitespace-nowrap">Cursor · ~/.cursor/skills/{skill.name}/</p>
              <p className="whitespace-nowrap">Claude · ~/.claude/skills/{skill.name}/</p>
              <p className="whitespace-nowrap">Codex · ~/.agents/skills/{skill.name}/</p>
            </div>
          </div>
        </li>
      </ol>
      {skill.hasScripts ? (
        <p className="max-w-2xl text-pretty text-sm leading-7 text-quiet">
          <KeepTogether>{t("usage.scripts")}</KeepTogether>
        </p>
      ) : null}
    </section>
  );
}
