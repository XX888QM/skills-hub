"use client";

import { useEffect, useMemo, useState } from "react";
import { SkillList } from "@/components/SkillRow";
import { Tx, TxBusy, TxInstalls, TxUpdated } from "@/components/Tx";
import { useI18n } from "@/components/I18nProvider";
import { skillHref } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";
import Link from "next/link";
import { Star } from "lucide-react";

const sorts = [
  { id: "stars", key: "sort.stars" },
  { id: "installs", key: "sort.installs" },
  { id: "updated", key: "sort.updated" },
  { id: "name", key: "sort.name" },
  { id: "source", key: "sort.source" },
] as const;

type SortId = (typeof sorts)[number]["id"];

const catalogCols =
  "sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1.9fr)_minmax(0,1fr)_88px_5.5rem]";

function itemKey(item: CatalogItem) {
  return `${item.source.toLowerCase()}::${item.name.toLowerCase()}`;
}

function mergeItems(current: CatalogItem[], incoming: CatalogItem[]) {
  const map = new Map(current.map((item) => [itemKey(item), item]));
  for (const item of incoming) {
    const prev = map.get(itemKey(item));
    if (!prev) {
      map.set(itemKey(item), item);
      continue;
    }
    map.set(itemKey(item), {
      ...prev,
      ...item,
      stars: item.stars ?? prev.stars,
      forks: item.forks ?? prev.forks,
      pushedAt: item.pushedAt ?? prev.pushedAt,
      installs: item.installs ?? prev.installs,
      description: item.description || prev.description,
    });
  }
  return [...map.values()];
}

function purposeOf(item: CatalogItem) {
  const text = item.description?.trim();
  return text || "—";
}

function SkillCatalogRowsFallback() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      <div className="divide-y divide-border">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-[4.5rem] animate-pulse bg-muted/60" />
        ))}
      </div>
    </div>
  );
}

export function SkillCatalogFallback() {
  return (
    <TxBusy k="catalog.loading" className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {sorts.map((item) => (
            <span
              key={item.id}
              className="min-h-10 whitespace-nowrap rounded-full px-4 text-sm leading-10 text-quiet"
            >
              <Tx k={item.key} />
            </span>
          ))}
        </div>
        <div className="h-12 w-full rounded-2xl border border-border bg-surface sm:max-w-sm" />
      </div>
      <SkillCatalogRowsFallback />
    </TxBusy>
  );
}

export function SkillCatalog({
  items: initialItems,
  hasMore: initialHasMore = false,
}: {
  items: CatalogItem[];
  hasMore?: boolean;
}) {
  const { t } = useI18n();
  const [items, setItems] = useState(initialItems);
  const [sort, setSort] = useState<SortId>("stars");
  const [query, setQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(initialHasMore);
  const [error, setError] = useState<string | null>(
    initialItems.length === 0 && !initialHasMore ? t("skills.error") : null,
  );
  useEffect(() => {
    if (!initialHasMore) return;

    let cancelled = false;

    (async () => {
      let page = 1;
      while (!cancelled) {
        try {
          const response = await fetch(`/api/skills?page=${page}`);
          const data = (await response.json()) as {
            items?: CatalogItem[];
            hasMore?: boolean;
            error?: string;
          };
          if (!response.ok) {
            if (!cancelled) {
              setError("fail");
              setLoadingMore(false);
            }
            return;
          }
          if (cancelled) return;
          setItems((current) => mergeItems(current, data.items ?? []));
          setError(null);
          if (!data.hasMore) break;
          page += 1;
        } catch {
          if (!cancelled) {
              setError("fail");
            setLoadingMore(false);
          }
          return;
        }
      }
      if (!cancelled) setLoadingMore(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [initialHasMore]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter((item) =>
          [item.name, item.source, item.description, item.category]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : items;

    return [...filtered].sort((a, b) => {
      if (sort === "stars") return (b.stars ?? -1) - (a.stars ?? -1);
      if (sort === "installs") return (b.installs ?? -1) - (a.installs ?? -1);
      if (sort === "updated") {
        return (b.pushedAt ? Date.parse(b.pushedAt) : 0) - (a.pushedAt ? Date.parse(a.pushedAt) : 0);
      }
      if (sort === "name") return a.name.localeCompare(b.name, "zh");
      return a.source.localeCompare(b.source);
    });
  }, [items, query, sort]);

  const empty = visible.length === 0;
  const failed = empty && !loadingMore && Boolean(error) && !query.trim();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {sorts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSort(item.id)}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 text-sm transition-colors duration-200 ${
                sort === item.id
                  ? "bg-[#f5f5f5] text-[#0a0a0a]"
                  : "text-quiet hover:text-foreground"
              }`}
            >
              <Tx k={item.key} />
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="skill-catalog-filter">
          {t("skills.filterLabel")}
        </label>
        <input
          id="skill-catalog-filter"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("skills.filter")}
          className="h-12 w-full rounded-2xl border border-border bg-surface px-4 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(245,245,245,0.18)] focus:outline-none sm:max-w-sm"
        />
      </div>

      <p className="text-pretty text-sm text-quiet">
        {loadingMore
          ? t("skills.loaded", { n: visible.length })
          : t("skills.count", { n: visible.length })}
      </p>

      {failed ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-quiet">
          <p>{t("skills.error")}</p>
          <p className="mt-2">
            <Link href="/search" className="underline underline-offset-4 hover:text-foreground">
              <Tx k="skills.retry" />
            </Link>
          </p>
        </div>
      ) : empty && loadingMore && !query.trim() ? (
        <SkillCatalogRowsFallback />
      ) : empty ? (
        <SkillList skills={[]} />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-surface">
          <div className={`hidden gap-4 px-6 py-4 text-xs text-quiet sm:grid ${catalogCols}`}>
            <span className="whitespace-nowrap">
              <Tx k="catalog.name" />
            </span>
            <span className="whitespace-nowrap">
              <Tx k="catalog.purpose" />
            </span>
            <span className="whitespace-nowrap">
              <Tx k="catalog.repo" />
            </span>
            <span className="whitespace-nowrap text-right">
              <Tx k="catalog.stars" />
            </span>
            <span className="whitespace-nowrap text-right">
              <Tx k="catalog.installs" />
            </span>
          </div>
          <div className="divide-y divide-border">
            {visible.map((item) => (
              <Link
                key={`${item.origin}-${itemKey(item)}`}
                href={skillHref(item.id)}
                className={`grid grid-cols-1 gap-2 px-5 py-5 transition-colors duration-200 hover:bg-muted sm:items-baseline sm:gap-4 sm:px-6 ${catalogCols}`}
              >
                <div className="min-w-0">
                  <p className="font-medium">{item.name}</p>
                  {item.pushedAt ? (
                    <p className="mt-2 text-xs text-quiet">
                      <TxUpdated iso={item.pushedAt} />
                    </p>
                  ) : null}
                </div>
                <p className="min-w-0 text-pretty text-sm">{purposeOf(item)}</p>
                <p className="truncate text-sm text-quiet">{item.source}</p>
                <p className="flex items-center gap-1 font-mono text-sm tabular-nums sm:justify-end">
                  <Star className="h-3.5 w-3.5 fill-foreground" strokeWidth={0} aria-hidden />
                  <TxInstalls value={item.stars} />
                </p>
                <p className="font-mono text-sm tabular-nums sm:text-right">
                  <TxInstalls value={item.installs} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {loadingMore ? (
        <p className="text-center text-sm text-quiet" aria-live="polite">
          <Tx k="skills.loadingMore" />
        </p>
      ) : null}

      {error && !failed ? (
        <p className="text-center text-sm text-quiet">{t("skills.error")}</p>
      ) : null}
    </div>
  );
}
