import Link from "next/link";
import { PageFrame } from "@/components/PageFrame";
import { Tx } from "@/components/Tx";

export default function NotFound() {
  return (
    <PageFrame className="max-w-2xl space-y-6">
      <h1 className="text-balance text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
        <Tx k="notfound.title" />
      </h1>
      <p className="text-pretty text-lg leading-8 text-quiet">
        <Tx k="notfound.text" />
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/search"
          className="inline-flex min-h-12 items-center whitespace-nowrap rounded-2xl bg-[#f5f5f5] px-5 font-medium text-[#0a0a0a] transition-opacity duration-200 hover:opacity-85"
        >
          <Tx k="notfound.search" />
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center whitespace-nowrap rounded-2xl border border-border px-5 text-foreground transition-colors duration-200 hover:bg-muted"
        >
          <Tx k="notfound.home" />
        </Link>
      </div>
    </PageFrame>
  );
}
