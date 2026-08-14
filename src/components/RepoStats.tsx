import { formatInstalls, formatRelativeTime } from "@/lib/format";
import type { GithubRepo } from "@/lib/types";

export function RepoStats({
  repo,
  installs,
}: {
  repo?: GithubRepo | null;
  installs?: number;
}) {
  const items = [
    { label: "仓库星标", value: repo ? formatInstalls(repo.stars) : "—" },
    { label: "复刻", value: repo ? formatInstalls(repo.forks) : "—" },
    { label: "最近推送", value: formatRelativeTime(repo?.pushedAt) },
    { label: "安装量", value: formatInstalls(installs) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-border py-10 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-sm text-quiet">{item.label}</dt>
          <dd className="mt-2 font-mono text-3xl tabular-nums tracking-tight sm:text-4xl">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
