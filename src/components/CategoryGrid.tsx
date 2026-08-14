import Link from "next/link";
import { scenePacks } from "@/lib/packs";

export function CategoryGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {scenePacks.map((pack) => (
        <Link
          key={pack.slug}
          href={`/packs/${pack.slug}`}
          className="reveal-item rounded-2xl bg-surface p-8 transition-[background-color] duration-200 hover:bg-muted sm:p-10"
        >
          <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{pack.title}</h3>
          <p className="mt-3 text-[15px] leading-7 text-quiet">{pack.summary}</p>
          <p className="mt-5 font-mono text-xs text-quiet">{pack.query}</p>
        </Link>
      ))}
    </div>
  );
}
