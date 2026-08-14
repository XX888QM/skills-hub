"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const suggestions = [
  { q: "frontend", zh: "前端", en: "frontend" },
  { q: "pdf", zh: "文档 / PDF", en: "pdf" },
  { q: "review", zh: "审查", en: "review" },
  { q: "react", zh: "React", en: "react" },
  { q: "nextjs", zh: "Next.js", en: "nextjs" },
];

export function SearchBar({
  initial = "",
  large = false,
  showSuggestions = false,
}: {
  initial?: string;
  large?: boolean;
  showSuggestions?: boolean;
}) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [value, setValue] = useState(initial);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex w-full gap-2">
        <label className="sr-only" htmlFor="skill-search">
          {t("hero.searchLabel")}
        </label>
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-quiet"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            id="skill-search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t("hero.placeholder")}
            className={`w-full rounded-2xl border border-border bg-surface pr-4 pl-12 text-foreground placeholder:text-quiet transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(245,245,245,0.18)] focus:outline-none ${
              large ? "h-16 text-base sm:text-lg" : "h-12"
            }`}
          />
        </div>
        <button
          type="submit"
          className={`shrink-0 whitespace-nowrap rounded-2xl bg-[#f5f5f5] px-6 font-medium text-[#0a0a0a] transition-opacity duration-200 hover:opacity-85 ${
            large ? "h-16" : "h-12"
          }`}
        >
          {t("hero.searchBtn")}
        </button>
      </form>
      {showSuggestions ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <Link
              key={item.q}
              href={`/search?q=${encodeURIComponent(item.q)}`}
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-sm text-quiet transition-colors duration-200 hover:text-foreground"
            >
              {locale === "zh" ? item.zh : item.en}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
