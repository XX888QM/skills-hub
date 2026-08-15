import { ArrowUpRight, Terminal } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { Tx, TxBusy, TxInstalls } from "@/components/Tx";
import { installCommand } from "@/lib/format";
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
    <div className="grid min-w-0 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const skill = item.skills[0];
        const title = skill?.name ?? item.source.split("/")[1] ?? item.source;
        const command = installCommand(item.source);
        return (
          <article
            key={item.source}
            className="reveal-item flex min-h-80 min-w-0 flex-col border-r border-b border-border bg-surface/40 p-7 transition-colors hover:bg-surface"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 truncate font-mono text-xs text-quiet">{item.source}</p>
              <span className="inline-flex shrink-0 items-center gap-1 font-mono text-sm text-foreground" aria-label={`${item.stars} stars`}>
                <TxInstalls value={item.stars} />
              </span>
            </div>
            <h3 className="font-editorial mt-8 min-w-0 text-3xl font-normal tracking-tight">{title}</h3>
            <p className="mt-4 line-clamp-3 flex-1 text-pretty text-[15px] leading-7 text-quiet">
              {skill?.description || item.description || <Tx k="hot.cardFallback" />}
            </p>
            <p className="mt-7 flex items-start gap-2 overflow-hidden border border-border bg-background px-3 py-3 font-mono text-xs leading-5 text-foreground">
              <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="truncate">{command}</span>
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <CopyButton text={command} />
              <Link href={`https://github.com/${item.source}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 text-sm text-quiet hover:text-foreground">
                <Tx k="home.repoLink" /><ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function TrendingGridFallback() {
  return (
    <TxBusy k="hot.loading" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-80 animate-pulse border border-border bg-surface" />
      ))}
    </TxBusy>
  );
}
