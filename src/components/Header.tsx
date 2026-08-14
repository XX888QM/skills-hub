"use client";

import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Tx } from "@/components/Tx";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/search", key: "nav.search" },
  { href: "/skills", key: "nav.skill" },
  { href: "/packs", key: "nav.packs" },
  { href: "/guide", key: "nav.guide" },
] as const;

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-6 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo-hub.png"
            alt="汇总skill"
            width={32}
            height={32}
            className="h-8 w-8 rounded-[10px] border border-border"
            priority
          />
          <span className="whitespace-nowrap text-[17px] font-medium tracking-[-0.02em]">
            <Tx k="brand.name" />
          </span>
        </Link>
        <div className="flex min-w-0 items-center justify-end gap-2 text-[15px]">
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
            {links.map((link) => {
              const on = active(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={on ? "page" : undefined}
                  className={`min-h-11 shrink-0 whitespace-nowrap rounded-xl px-3 py-2 transition-colors duration-200 ${
                    on ? "bg-muted text-foreground" : "text-quiet hover:text-foreground"
                  }`}
                >
                  <Tx k={link.key} />
                </Link>
              );
            })}
            <Link
              href="https://github.com/XX888QM/skills-hub"
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-quiet transition-colors duration-200 hover:text-foreground"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border border-current">
                <Github className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </span>
              GitHub
            </Link>
            <Link
              href="/submit"
              className="ml-2 inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-[#f5f5f5] px-4 text-sm font-medium text-[#0a0a0a] transition-opacity duration-200 hover:opacity-85"
            >
              <Tx k="nav.submit" />
            </Link>
          </nav>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
