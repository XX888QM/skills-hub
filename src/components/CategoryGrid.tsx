import Link from "next/link";
import { KeepTogether } from "@/components/KeepTogether";
import { Tx } from "@/components/Tx";
import { packMessageKey, scenePacks } from "@/lib/packs";

export function CategoryGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {scenePacks.map((pack) => (
        <Link
          key={pack.slug}
          href={`/packs/${pack.slug}`}
          className="reveal-item rounded-2xl bg-surface p-8 transition-[background-color] duration-200 hover:bg-muted sm:p-10"
        >
          <h3 className="whitespace-nowrap text-2xl font-normal tracking-tight sm:text-3xl">
            <Tx k={packMessageKey(pack.slug, "title")} />
          </h3>
          <p className="mt-3 text-pretty text-[15px] leading-7 text-quiet">
            <KeepTogether>
              <Tx k={packMessageKey(pack.slug, "summary")} />
            </KeepTogether>
          </p>
        </Link>
      ))}
    </div>
  );
}
