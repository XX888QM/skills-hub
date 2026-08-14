"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { InstallCommand } from "@/components/InstallCommand";
import { useI18n } from "@/components/I18nProvider";
import { KeepTogether } from "@/components/KeepTogether";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";
import { parseRepoInput, skillHref } from "@/lib/format";
import type { ResolvedSkill } from "@/lib/types";

type ResolveResponse = {
  owner: string;
  repo: string;
  skills: ResolvedSkill[];
  error?: string;
};

export default function SubmitPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResolveResponse | null>(null);

  const parsed = useMemo(() => parseRepoInput(input), [input]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed) {
      setError(t("submit.badInput"));
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
        setError(data.error || t("submit.fail"));
        return;
      }
      setResult(data);
    } catch {
      setError(t("submit.net"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame className="space-y-12">
      <div className="max-w-2xl">
        <RevealHeading as="h1" className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          {t("submit.title")}
        </RevealHeading>
        <Reveal>
          <p className="mt-5 text-pretty text-lg leading-8 text-quiet">
            <KeepTogether>{t("submit.sub")}</KeepTogether>
          </p>
        </Reveal>
      </div>
      <Reveal>
        <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("submit.placeholder")}
            className="h-16 min-w-0 flex-1 rounded-2xl border border-border bg-surface px-4 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(245,245,245,0.18)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-16 shrink-0 whitespace-nowrap rounded-2xl bg-[#f5f5f5] px-6 font-medium text-[#0a0a0a] transition-opacity duration-200 hover:opacity-85 disabled:opacity-60"
          >
            {loading ? t("submit.loading") : t("submit.btn")}
          </button>
        </form>
      </Reveal>
      {error ? <p className="text-destructive">{error}</p> : null}
      {result ? (
        <div className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="whitespace-nowrap text-2xl font-normal tracking-tight">
                {result.owner}/{result.repo}
              </h2>
              <p className="mt-1 text-pretty text-sm text-quiet">
                <KeepTogether>{t("submit.found", { n: result.skills.length })}</KeepTogether>
              </p>
            </div>
            <div className="w-full max-w-xl">
              <InstallCommand source={`${result.owner}/${result.repo}`} />
            </div>
          </div>
          {result.skills.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-pretty text-quiet">
              <KeepTogether>{t("submit.empty")}</KeepTogether>
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
                    <p className="mt-2 text-pretty text-sm text-foreground">
                      <KeepTogether>{t("submit.scripts")}</KeepTogether>
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <Link
                      href={skillHref(`${result.owner}/${result.repo}/${skill.name}`)}
                      className="whitespace-nowrap text-foreground underline underline-offset-3"
                    >
                      {t("submit.openSite")}
                    </Link>
                    <Link
                      href={skill.rawUrl}
                      target="_blank"
                      className="whitespace-nowrap text-quiet underline underline-offset-3"
                    >
                      {t("submit.open")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </PageFrame>
  );
}
