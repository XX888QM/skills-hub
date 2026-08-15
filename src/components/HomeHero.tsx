"use client";

import { BookOpen, Terminal } from "lucide-react";
import { HeroTitle } from "@/components/HeroTitle";
import { useI18n } from "@/components/I18nProvider";
import { SearchBar } from "@/components/SearchBar";
import { Tx } from "@/components/Tx";

export function HomeHero() {
  const { t } = useI18n();

  return (
    <section className="border-b border-border/70">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] items-center gap-12 px-6 py-16 sm:px-6 lg:grid-cols-[1.22fr_0.78fr] lg:gap-[72px] lg:py-24">
        <div>
          <p className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-quiet uppercase">
            <span className="h-2 w-2 rounded-full bg-[#b7a271] shadow-[0_0_12px_rgba(183,162,113,0.8)]" aria-hidden />
            {t("hero.marketLabel")}
          </p>
          <HeroTitle />
          <p className="font-editorial mt-8 max-w-none text-pretty text-[17px] leading-8 text-quiet">
            <Tx k="hero.sub" />
          </p>
          <div className="mt-9 max-w-3xl sm:mt-11">
            <SearchBar large showSuggestions editorial />
          </div>
          <p className="mt-5 font-mono text-xs text-quiet">{t("hero.sourceNote")}</p>
        </div>

        <aside className="relative mx-auto w-full max-w-md rotate-[1.8deg] border border-border bg-surface p-7 shadow-2xl shadow-black/60 sm:min-h-[510px] sm:p-9" aria-label="SKILL.md 预览示意">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-6 font-mono text-xs text-quiet">
            <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" aria-hidden />{t("hero.previewTitle")}</span>
            <span>{t("hero.previewPublic")}</span>
          </div>
          <div className="space-y-4 py-8 font-mono text-sm leading-7">
            <p><span className="text-quiet">name:</span> frontend-design</p>
            <p><span className="text-quiet">source:</span> anthropics/skills</p>
          </div>
          <p className="font-editorial max-w-sm text-xl leading-9 text-quiet">{t("hero.previewText")}</p>
          <p className="mt-8 flex items-center gap-3 overflow-hidden border border-border bg-background px-4 py-4 font-mono text-xs text-foreground">
            <Terminal className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">npx skills add anthropics/skills</span>
          </p>
          <span className="absolute right-4 bottom-5 font-mono text-[10px] tracking-[0.2em] text-quiet [writing-mode:vertical-rl]">SKILL.md</span>
        </aside>
      </div>
    </section>
  );
}
