import { Star, Terminal } from "lucide-react";
import Link from "next/link";
import { Tx, TxBusy, TxInstalls } from "@/components/Tx";
import { installCommand, skillHref } from "@/lib/format";
import type { StarBoardItem } from "@/lib/types";

export function TrendingGrid({ items }: { items: StarBoardItem[] }) {
  if (items.length === 0) {
    return (
      <p className="reveal-item rounded-2xl border border-dashed border-border px-6 py-16 text-center text-quiet">
        <Tx k="empty.hot" />
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const skill = item.skills[0];
        const href = skill ? skillHref(skill.id) : `/search?q=${encodeURIComponent(item.source)}`;
        const title = skill?.name ?? item.source.split("/")[1] ?? item.source;
        return (
          <Link
            key={item.source}
            href={href}
            className="reveal-item flex flex-col rounded-2xl bg-surface p-7 transition-[background-color] duration-200 hover:bg-muted"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-xl font-normal tracking-tight">{title}</h3>
              <span className="inline-flex shrink-0 items-center gap-1 font-mono text-sm text-foreground">
                <Star className="h-4 w-4 fill-foreground" strokeWidth={0} aria-hidden />
                <TxInstalls value={item.stars} />
              </span>
            </div>
            <p className="mt-2 truncate text-sm text-quiet">{item.source}</p>
            <p className="mt-5 line-clamp-2 flex-1 text-pretty text-[15px] leading-7 text-quiet">
              {skill?.description || item.description || <Tx k="hot.cardFallback" />}
            </p>
            <p className="mt-6 flex items-start gap-2 rounded-xl bg-background px-3 py-2.5 font-mono text-xs leading-5 text-foreground">
              <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              <span>{installCommand(item.source)}</span>
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export function TrendingGridFallback() {
  return (
    <TxBusy k="hot.loading" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-56 animate-pulse rounded-2xl bg-surface" />
      ))}
    </TxBusy>
  );
}
