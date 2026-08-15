"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CopyForAgent } from "@/components/CopyForAgent";
import { useI18n } from "@/components/I18nProvider";
import { KeepTogether } from "@/components/KeepTogether";
import { RepoStats } from "@/components/RepoStats";
import { SkillMarkdown } from "@/components/SkillMarkdown";
import { UsageGuide } from "@/components/UsageGuide";
import { originLabel } from "@/lib/translate";
import type { SkillDetail } from "@/lib/types";

export function SkillContent({ skill }: { skill: SkillDetail }) {
  const { t, locale } = useI18n();
  const [lang, setLang] = useState<"zh" | "en">(locale === "zh" ? "zh" : "en");
  const hasOriginal = Boolean(
    skill.originalMarkdown && skill.originalMarkdown !== skill.markdown,
  );
  const description =
    lang === "en" ? skill.originalDescription || skill.description : skill.description;
  const markdown =
    lang === "en" ? skill.originalMarkdown || skill.markdown : skill.markdown;
  const repoName = skill.repo?.fullName ?? skill.source;

  return (
    <article className="space-y-16 sm:space-y-20">
      <header className="max-w-3xl">
        <p className="truncate text-sm text-quiet">{repoName}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <h1 className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
            {skill.name}
          </h1>
          {hasOriginal ? (
            <div className="flex shrink-0 rounded-full bg-surface p-1">
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`min-h-10 whitespace-nowrap rounded-full px-4 text-sm transition-colors duration-200 ${
                  lang === "zh" ? "bg-[#f5f5f5] text-[#0a0a0a]" : "text-quiet"
                }`}
              >
                {t("skill.zh")}
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`min-h-10 whitespace-nowrap rounded-full px-4 text-sm transition-colors duration-200 ${
                  lang === "en" ? "bg-[#f5f5f5] text-[#0a0a0a]" : "text-quiet"
                }`}
              >
                {t("skill.en")}
              </button>
            </div>
          ) : null}
        </div>
        {description ? (
          <p className="mt-8 max-w-2xl text-pretty text-xl leading-8 text-quiet">{description}</p>
        ) : null}
      </header>

      <div>
        <RepoStats repo={skill.repo} installs={skill.installs} />
        <p className="mt-5 text-pretty text-sm leading-7 text-quiet">
          <KeepTogether>
            {!skill.repo
              ? t("skill.noRepo")
              : `${t("skill.starNote")}${
                  skill.repo.license ? ` ${t("skill.license", { license: skill.repo.license })}` : ""
                }`}
          </KeepTogether>
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,17.5rem)] lg:items-start">
        <div className="space-y-20">
          <UsageGuide skill={{ ...skill, description, markdown }} />
          <section>
            <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{t("skill.manual")}</h2>
            <div className="mt-10">
              <SkillMarkdown markdown={markdown} />
            </div>
          </section>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24">
          <div>
            <p className="whitespace-nowrap text-sm text-quiet">{t("skill.agentTitle")}</p>
            <p className="mt-2 text-pretty text-lg leading-8">
              <KeepTogether>{t("skill.agentText")}</KeepTogether>
            </p>
            <div className="mt-5">
              <CopyForAgent source={skill.source} name={skill.name} skillId={skill.id} />
            </div>
          </div>
          <div>
            <p className="text-sm text-quiet">{t("skill.origin")}</p>
            <p className="mt-2 text-lg">{originLabel(skill.origin, locale)}</p>
          </div>
          <div className="space-y-3 text-lg">
            {skill.githubUrl ? (
              <p>
                <Link
                  href={skill.githubUrl}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                  target="_blank"
                >
                  <span className="whitespace-nowrap">{t("skill.github")}</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
              </p>
            ) : null}
            {skill.githubFileUrl ? (
              <p>
                <Link
                  href={skill.githubFileUrl}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                  target="_blank"
                >
                  <span className="whitespace-nowrap">{t("skill.file")}</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
              </p>
            ) : skill.rawUrl ? (
              <p>
                <Link
                  href={skill.rawUrl}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                  target="_blank"
                >
                  <span className="whitespace-nowrap">{t("skill.raw")}</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </article>
  );
}
