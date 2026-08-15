import Link from "next/link";
import { Tx } from "@/components/Tx";

export function Footer() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-10 text-sm leading-7 text-quiet sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <p className="text-pretty">
          <Tx k="footer.line1" />
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/guide" className="whitespace-nowrap hover:text-foreground">
            <Tx k="footer.guide" />
          </Link>
          <Link href="https://github.com/XX888QM/skills-hub" target="_blank" rel="noreferrer" className="whitespace-nowrap hover:text-foreground">GitHub</Link>
        </p>
      </div>
    </footer>
  );
}
