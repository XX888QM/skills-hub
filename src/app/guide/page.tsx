import Link from "next/link";
import { CopyForAgent } from "@/components/CopyForAgent";
import { InstallCommand } from "@/components/InstallCommand";
import { PageFrame } from "@/components/PageFrame";
import { Reveal, RevealHeading } from "@/components/Reveal";

const steps = [
  {
    label: "找",
    title: "先检索，或按方向看。",
    body: "首页按仓库星标排热门。检索会同时查 skills.sh 和 SkillMD。场景包是一组现成的检索词，不是本机目录。",
    extra: (
      <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-lg">
        <Link href="/search" className="underline underline-offset-4">
          去检索
        </Link>
        <Link href="/packs" className="underline underline-offset-4">
          看场景包
        </Link>
      </p>
    ),
  },
  {
    label: "看",
    title: "点进本站详情，再决定要不要装。",
    body: "说明书译成中文，代码和命令保持原样。星标是整个仓库的，不是单条 skill。带 scripts/ 的会标出来。",
  },
  {
    label: "装",
    title: "复制给 Agent，或自己在终端执行。",
    body: "详情页有「复制给 Agent」。粘到对话里，AI 会按说明书执行安装命令。也可以自己跑 CLI，它会识别本机已有的 Agent。",
    extra: (
      <div className="mt-6 space-y-4">
        <InstallCommand source="anthropics/skills" />
        <CopyForAgent source="anthropics/skills" name="skills" />
        <div className="space-y-2 font-mono text-sm leading-7 text-quiet">
          <p>Cursor · ~/.cursor/skills/</p>
          <p>Claude · ~/.claude/skills/</p>
          <p>Codex · ~/.agents/skills/</p>
        </div>
      </div>
    ),
  },
  {
    label: "用",
    title: "回到对话里，直接说要做的事。",
    body: "不必先点菜单。说清楚任务，或点名刚才装的 skill。Agent 会按说明书执行。",
    extra: (
      <p className="mt-5 font-mono text-sm leading-7 text-quiet">用 frontend-design 把这个页面做完</p>
    ),
  },
  {
    label: "上架",
    title: "仓库已经公开，贴上 owner/repo。",
    body: "我们用 GitHub 接口读目录，只收同时写了 name 和 description 的 SKILL.md，不另存一份拷贝。",
    extra: (
      <p className="mt-5 text-lg">
        <Link href="/submit" className="underline underline-offset-4">
          去上架
        </Link>
      </p>
    ),
  },
];

export default function GuidePage() {
  return (
    <PageFrame>
      <div className="max-w-3xl">
        <RevealHeading as="h1" className="text-4xl font-normal leading-[1.25] tracking-tight sm:text-6xl">
          使用说明
        </RevealHeading>
        <Reveal>
          <p className="mt-6 max-w-xl text-xl leading-8 text-quiet">
            货在 GitHub。这里只做发现、预览和安装命令。
          </p>
        </Reveal>
      </div>

      <Reveal>
        <ol className="mt-20 divide-y divide-border border-y border-border">
          {steps.map((step) => (
            <li key={step.label} className="grid gap-4 py-12 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-12 sm:py-16">
              <p className="text-sm text-quiet">{step.label}</p>
              <div>
                <h2 className="text-2xl font-normal tracking-tight sm:text-3xl">{step.title}</h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-quiet">{step.body}</p>
                {step.extra}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <section className="mt-20 max-w-2xl">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">装之前看一眼</h2>
          <p className="mt-5 text-lg leading-8 text-quiet">
            本站不爬全站，只按需打公开接口。安装量来自安装榜，和仓库星标不是一回事。带脚本的 skill
            可能在本机执行仓库里的命令，先读原文再装。
          </p>
        </section>
      </Reveal>
    </PageFrame>
  );
}
