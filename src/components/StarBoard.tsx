import { Star } from "lucide-react";
import Link from "next/link";
import { formatInstalls, formatRelativeTime, skillHref } from "@/lib/format";
import type { StarBoardItem } from "@/lib/types";

export function StarBoard({ items }: { items: StarBoardItem[] }) {
  if (items.length === 0) {
    return (
      <p className="reveal-item rounded-2xl border border-dashed border-border px-6 py-16 text-center text-quiet">
        暂时没读到 GitHub 星标。换个热门词检索，或稍后再刷新。
      </p>
    );
  }

  const [lead, ...rest] = items;

  return (
    <div className="space-y-5">
      <Link
        href={lead.skills[0] ? skillHref(lead.skills[0].id) : `/search?q=${encodeURIComponent(lead.source)}`}
        className="reveal-item block rounded-2xl bg-surface p-8 transition-[background-color] duration-200 hover:bg-muted sm:p-12"
      >
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="min-w-0 max-w-2xl">
            <h3 className="text-3xl font-medium leading-[1.25] tracking-tight sm:text-5xl">{lead.source}</h3>
            {lead.description ? (
              <p className="mt-5 max-w-xl text-lg leading-8 text-quiet">{lead.description}</p>
            ) : null}
            <SkillChips item={lead} />
          </div>
          <div className="lg:text-right">
            <p className="flex items-center gap-2 font-mono text-5xl tabular-nums sm:text-6xl lg:justify-end">
              <Star className="h-8 w-8 fill-foreground" strokeWidth={0} aria-hidden />
              <span>{formatInstalls(lead.stars)}</span>
            </p>
            <p className="mt-3 text-sm text-quiet">{formatRelativeTime(lead.pushedAt)} 更新</p>
          </div>
        </div>
      </Link>

      <ol className="overflow-hidden rounded-2xl bg-surface">
        {rest.map((item, index) => (
          <li key={item.source} className="reveal-item border-t border-border/80 first:border-t-0">
            <Link
              href={
                item.skills[0]
                  ? skillHref(item.skills[0].id)
                  : `/search?q=${encodeURIComponent(item.source)}`
              }
              className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 transition-colors duration-200 hover:bg-muted sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:px-8 sm:py-6"
            >
              <span className="text-lg text-quiet">{index + 2}</span>
              <div className="min-w-0">
                <p className="truncate text-lg font-medium tracking-[-0.02em]">{item.source}</p>
                {item.description ? (
                  <p className="mt-1 line-clamp-1 text-sm text-quiet">{item.description}</p>
                ) : null}
              </div>
              <p className="flex items-center justify-end gap-1.5 font-mono text-xl tabular-nums sm:text-2xl">
                <Star className="h-4 w-4 fill-foreground" strokeWidth={0} aria-hidden />
                {formatInstalls(item.stars)}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SkillChips({ item }: { item: StarBoardItem }) {
  if (item.skills.length === 0) return null;
  return (
    <p className="mt-6 flex flex-wrap gap-2 text-sm">
      {item.skills.map((skill) => (
        <span key={skill.id} className="rounded-full bg-background px-3 py-1 text-quiet">
          {skill.name}
        </span>
      ))}
    </p>
  );
}

export function StarBoardFallback() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="正在加载星标榜">
      <div className="h-56 animate-pulse rounded-2xl bg-surface" />
      <div className="h-72 animate-pulse rounded-2xl bg-surface" />
    </div>
  );
}
