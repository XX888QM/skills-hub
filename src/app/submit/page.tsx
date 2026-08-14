"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { InstallCommand } from "@/components/InstallCommand";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { parseRepoInput } from "@/lib/format";
import type { ResolvedSkill } from "@/lib/types";

type ResolveResponse = {
  owner: string;
  repo: string;
  skills: ResolvedSkill[];
  error?: string;
};

export default function SubmitPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResolveResponse | null>(null);

  const parsed = useMemo(() => parseRepoInput(input), [input]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed) {
      setError("请输入 owner/repo，或粘贴 GitHub 仓库地址。");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = (await response.json()) as ResolveResponse;
      if (!response.ok) {
        setError(data.error || "解析失败");
        return;
      }
      setResult(data);
    } catch {
      setError("网络异常，稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame className="space-y-12">
      <div className="max-w-2xl">
        <RevealHeading as="h1" className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          上架
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-lg leading-8 text-quiet">
            仓库保持公开，里面有合格的 SKILL.md 即可。我们用 GitHub 接口读目录，不另存一份拷贝。
          </p>
        </Reveal>
      </div>
      <Reveal>
      <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="anthropics/skills 或 https://github.com/anthropics/skills"
          className="h-16 min-w-0 flex-1 rounded-2xl border border-border bg-surface px-4 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(245,245,245,0.18)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-16 rounded-2xl bg-accent px-6 font-medium text-on-accent transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
        >
          {loading ? "解析中…" : "解析仓库"}
        </button>
      </form>
      </Reveal>
      {error ? <p className="text-destructive">{error}</p> : null}
      {result ? (
        <div className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.02em]">
                {result.owner}/{result.repo}
              </h2>
              <p className="mt-1 text-sm text-quiet">
                读到 {result.skills.length} 个合格 Skill（需同时有 name 和 description）。
              </p>
            </div>
            <div className="w-full max-w-xl">
              <InstallCommand source={`${result.owner}/${result.repo}`} />
            </div>
          </div>
          {result.skills.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-quiet">
              这个仓库里没有通过校验的 SKILL.md。确认 frontmatter 写了 name 和 description。
            </p>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-2xl bg-surface">
              {result.skills.map((skill) => (
                <div key={skill.path} className="px-4 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{skill.name}</h3>
                    <span className="font-mono text-xs text-quiet">{skill.path}</span>
                  </div>
                  <p className="mt-2 text-sm text-quiet">{skill.description}</p>
                  {skill.hasScripts ? (
                    <p className="mt-2 text-sm text-accent">含 scripts/，安装前先读。</p>
                  ) : null}
                  <Link
                    href={skill.rawUrl}
                    target="_blank"
                    className="mt-2 inline-block text-sm text-foreground underline underline-offset-3"
                  >
                    打开原文
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </PageFrame>
  );
}
