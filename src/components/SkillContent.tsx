"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CopyForAgent } from "@/components/CopyForAgent";
import { RepoStats } from "@/components/RepoStats";
import { SkillMarkdown } from "@/components/SkillMarkdown";
import { UsageGuide } from "@/components/UsageGuide";
import { originLabel } from "@/lib/translate";
import type { SkillDetail } from "@/lib/types";

export function SkillContent({ skill }: { skill: SkillDetail }) {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const hasOriginal = Boolean(
    skill.originalMarkdown && skill.originalMarkdown !== skill.markdown,
  );
  const description =
    lang === "en" ? skill.originalDescription || skill.description : skill.description;
  const markdown =
    lang === "en" ? skill.originalMarkdown || skill.markdown : skill.markdown;
  const repoName = skill.repo?.fullName ?? skill.source;

  return (
    <div className="space-y-16 sm:space-y-20">
      <header className="max-w-3xl">
        <p className="text-sm text-quiet">{repoName}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <h1 className="text-4xl font-normal leading-[1.2] tracking-tight sm:text-6xl">
            {skill.name}
          </h1>
          {hasOriginal ? (
            <div className="flex rounded-full bg-surface p-1">
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`min-h-10 rounded-full px-4 text-sm transition-colors duration-200 ${
                  lang === "zh" ? "bg-[#f5f5f5] text-[#0a0a0a]" : "text-quiet"
                }`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`min-h-10 rounded-full px-4 text-sm transition-colors duration-200 ${
                  lang === "en" ? "bg-[#f5f5f5] text-[#0a0a0a]" : "text-quiet"
                }`}
              >
                原文
              </button>
            </div>
          ) : null}
        </div>
        {description ? (
          <p className="mt-8 max-w-2xl text-xl leading-8 text-quiet">{description}</p>
        ) : null}
      </header>

      <div>
        <RepoStats repo={skill.repo} installs={skill.installs} />
        <p className="mt-5 text-sm leading-7 text-quiet">
          {!skill.repo
            ? "没有读到对应的 GitHub 仓库。可能是镜像源，或接口额度用尽。"
            : `星标是整个仓库的，不是单条 skill。安装量来自安装榜。${
                skill.repo.license ? ` 许可：${skill.repo.license}。` : ""
              }`}
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="space-y-20">
          <UsageGuide skill={{ ...skill, description, markdown }} />
          <section>
            <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">说明书</h2>
            <div className="mt-10">
              <SkillMarkdown markdown={markdown} />
            </div>
          </section>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24">
          <div>
            <p className="text-sm text-quiet">交给 Agent 装</p>
            <p className="mt-2 text-lg leading-8">复制一段话，粘到 Cursor、Claude 或 Codex 的对话里。</p>
            <div className="mt-4">
              <CopyForAgent source={skill.source} name={skill.name} skillId={skill.id} />
            </div>
          </div>
          <div>
            <p className="text-sm text-quiet">来源</p>
            <p className="mt-2 text-lg">{originLabel(skill.origin)}</p>
          </div>
          <div className="space-y-3 text-lg">
            {skill.githubUrl ? (
              <p>
                <Link
                  href={skill.githubUrl}
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                  target="_blank"
                >
                  打开 GitHub 仓库
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
                  打开这份说明书
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
                  查看英文原文
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
