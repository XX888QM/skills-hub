import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/search", label: "检索" },
  { href: "/packs", label: "场景包" },
  { href: "/guide", label: "说明" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-hub.png"
            alt="汇总"
            width={32}
            height={32}
            className="h-8 w-8 rounded-[10px] border border-border"
            priority
          />
          <span className="text-[17px] font-medium tracking-[-0.02em]">汇总</span>
        </Link>
        <nav className="flex items-center gap-1 text-[15px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 rounded-xl px-3 py-2 text-quiet transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            className="ml-2 inline-flex h-10 items-center rounded-full bg-[#f5f5f5] px-4 text-sm font-medium text-[#0a0a0a] transition-opacity duration-200 hover:opacity-85"
          >
            上架
          </Link>
        </nav>
      </div>
    </header>
  );
}
