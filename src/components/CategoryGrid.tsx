import Link from "next/link";
import { KeepTogether } from "@/components/KeepTogether";
import { Tx } from "@/components/Tx";
import { packMessageKey, scenePacks } from "@/lib/packs";

export function CategoryGrid({ editorial = false }: { editorial?: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {scenePacks.map((pack, index) => (
        <Link
          key={pack.slug}
          href={`/packs/${pack.slug}`}
          className={editorial ? "reveal-item group border-t border-border py-8 transition-colors hover:bg-surface sm:px-6" : "reveal-item rounded-2xl bg-surface p-8 transition-[background-color] duration-200 hover:bg-muted sm:p-10"}
        >
          {editorial ? (
            <div className="grid gap-4 sm:grid-cols-[48px_0.8fr_1.2fr] sm:items-start">
              <span className="font-mono text-xs text-quiet">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-editorial text-2xl font-normal tracking-tight sm:text-3xl"><Tx k={packMessageKey(pack.slug, "title")} /></h3>
              <p className="text-pretty text-[15px] leading-7 text-quiet"><KeepTogether><Tx k={packMessageKey(pack.slug, "summary")} /></KeepTogether></p>
            </div>
          ) : (
            <>
              <h3 className="whitespace-nowrap text-2xl font-normal tracking-tight sm:text-3xl"><Tx k={packMessageKey(pack.slug, "title")} /></h3>
              <p className="mt-3 text-pretty text-[15px] leading-7 text-quiet"><KeepTogether><Tx k={packMessageKey(pack.slug, "summary")} /></KeepTogether></p>
            </>
          )}
        </Link>
      ))}
    </div>
  );
}
