"use client";

import { useI18n } from "@/components/I18nProvider";
import { formatInstalls, formatRelativeTime } from "@/lib/format";
import type { GithubRepo } from "@/lib/types";

export function RepoStats({
  repo,
  installs,
}: {
  repo?: GithubRepo | null;
  installs?: number;
}) {
  const { t, locale } = useI18n();
  const items = [
    { label: t("stats.stars"), value: repo ? formatInstalls(repo.stars, locale) : "—" },
    { label: t("stats.forks"), value: repo ? formatInstalls(repo.forks, locale) : "—" },
    { label: t("stats.pushed"), value: formatRelativeTime(repo?.pushedAt, locale) },
    { label: t("stats.installs"), value: formatInstalls(installs, locale) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-border py-10 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="whitespace-nowrap text-sm text-quiet">{item.label}</dt>
          <dd className="mt-2 whitespace-nowrap font-mono text-2xl tabular-nums tracking-tight sm:text-4xl">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
