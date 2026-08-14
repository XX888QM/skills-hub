import Link from "next/link";
import { PageFrame } from "@/components/PageFrame";

export default function NotFound() {
  return (
    <PageFrame className="max-w-2xl space-y-6">
      <h1 className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">这一页不在目录里</h1>
      <p className="text-lg leading-8 text-quiet">回到检索，或换一个仓库地址再解析。</p>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center rounded-2xl bg-accent px-5 font-medium text-on-accent transition-opacity duration-200 hover:opacity-85"
      >
        回首页
      </Link>
    </PageFrame>
  );
}
