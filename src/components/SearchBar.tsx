"use client";

import { ArrowRight, Search } from "lucide-react";
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

const editorialSuggestions = [
  { q: "frontend", zh: "前端", en: "frontend" },
  { q: "document", zh: "文档", en: "docs" },
  { q: "pdf", zh: "PDF", en: "PDF" },
  { q: "review", zh: "审查", en: "review" },
  { q: "react", zh: "React", en: "React" },
  { q: "nextjs", zh: "Next.js", en: "Next.js" },
];

export function SearchBar({
  initial = "",
  large = false,
  showSuggestions = false,
  editorial = false,
}: {
  initial?: string;
  large?: boolean;
  showSuggestions?: boolean;
  editorial?: boolean;
}) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [value, setValue] = useState(initial);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    if (!q) return;
    window.scrollTo(0, 0);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className={editorial ? "w-full overflow-hidden rounded-2xl border border-border" : "w-full"}>
      <form
        onSubmit={onSubmit}
        className={editorial ? "grid sm:grid-cols-[1fr_auto]" : "flex w-full gap-2"}
      >
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
            className={`w-full bg-surface pr-4 pl-12 text-foreground placeholder:text-quiet transition-[border-color,box-shadow] duration-200 focus:outline-none ${
              editorial ? "h-16 border-0 rounded-none text-base sm:h-20 sm:text-lg" : "rounded-2xl border border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(245,245,245,0.18)]"
            } ${
              large && !editorial ? "h-16 text-base sm:text-lg" : !editorial ? "h-12" : ""
            }`}
          />
        </div>
        <button
          type="submit"
          className={`shrink-0 whitespace-nowrap bg-[#eeeae1] px-6 font-medium text-[#0a0a08] transition-opacity duration-200 hover:opacity-85 ${
            editorial ? "m-2 flex h-14 items-center justify-center gap-3 rounded-xl sm:h-16" : "rounded-2xl"
          } ${
            large && !editorial ? "h-16" : !editorial ? "h-12" : ""
          }`}
        >
          {t("hero.searchBtn")}
          {editorial ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </button>
      </form>
      {showSuggestions ? (
        <div className={editorial ? "grid grid-cols-2 gap-2 border-t border-border px-4 py-3 sm:flex sm:flex-wrap sm:items-center" : "mt-3 flex flex-wrap gap-2"}>
          {editorial ? <span className="col-span-2 mr-1 text-xs text-quiet sm:col-span-1">{locale === "zh" ? "常用" : "Popular"}</span> : null}
          {(editorial ? editorialSuggestions : suggestions).map((item) => (
            <Link
              key={item.q}
              href={`/search?q=${encodeURIComponent(item.q)}`}
              className={editorial ? "inline-flex min-h-10 items-center justify-center rounded-full border border-border px-4 text-sm text-quiet transition-colors hover:border-quiet hover:text-foreground" : "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-sm text-quiet transition-colors duration-200 hover:text-foreground"}
            >
              {locale === "zh" ? item.zh : item.en}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
