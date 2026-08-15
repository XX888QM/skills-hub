"use client";

import Image from "next/image";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-border bg-black">
            <Image src="/logo-hub.png" alt="" width={36} height={36} priority className="h-full w-full object-cover" />
          </span>
          <span className="font-editorial whitespace-nowrap text-lg tracking-[-0.02em]">
            <Tx k="brand.name" />
          </span>
        </Link>
        <div className="hidden min-w-0 items-center justify-end gap-3 text-sm md:flex">
          <nav className="flex min-w-0 items-center gap-1">
            {links.map((link) => {
              const on = active(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={on ? "page" : undefined}
                  className={`min-h-11 shrink-0 whitespace-nowrap border-b px-3 py-3 transition-colors duration-200 ${
                    on ? "border-foreground text-foreground" : "border-transparent text-quiet hover:text-foreground"
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
              className="ml-4 inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 text-quiet transition-colors duration-200 hover:text-foreground"
            >
              <Github className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              GitHub
            </Link>
            <Link
              href="/submit"
              className="ml-2 inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-lg bg-[#eeeae1] px-5 font-medium text-[#0a0a08] transition-opacity duration-200 hover:opacity-85"
            >
              <Tx k="nav.submit" />
            </Link>
          </nav>
          <LanguageSwitch />
        </div>
        <button
          type="button"
          aria-label={open ? "关闭导航" : "打开导航"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-lg border border-border text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      {open ? (
        <nav className="border-t border-border bg-background px-4 py-4 md:hidden" aria-label="移动导航">
          <div className="grid gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="min-h-12 rounded-lg px-4 py-3 text-quiet hover:bg-muted hover:text-foreground">
                <Tx k={link.key} />
              </Link>
            ))}
            <Link href="/submit" onClick={() => setOpen(false)} className="mt-2 min-h-12 rounded-lg bg-[#eeeae1] px-4 py-3 text-center font-medium text-[#0a0a08]">
              <Tx k="nav.submit" />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
