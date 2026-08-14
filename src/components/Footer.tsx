import Link from "next/link";
import { Tx } from "@/components/Tx";

export function Footer() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-16 text-sm leading-7 text-quiet sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <p className="text-pretty">
          <Tx k="footer.line1" />
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/guide" className="whitespace-nowrap hover:text-foreground">
            <Tx k="footer.guide" />
          </Link>
          <span className="text-pretty">
            <Tx k="footer.line2" />
          </span>
        </p>
      </div>
    </footer>
  );
}
