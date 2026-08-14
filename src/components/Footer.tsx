import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-16 text-sm leading-7 text-quiet sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <p>货在 GitHub，这里只做发现、预览和安装命令。</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/guide" className="hover:text-foreground">
            使用说明
          </Link>
          <span>数据来自 skills.sh、SkillMD 与 GitHub 公开接口。</span>
        </p>
      </div>
    </footer>
  );
}
