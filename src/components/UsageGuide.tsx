import { CopyForAgent } from "@/components/CopyForAgent";
import { InstallCommand } from "@/components/InstallCommand";
import type { SkillDetail } from "@/lib/types";

const defaultAgents = ["Cursor", "Claude Code", "Codex"];

const agentNames: Record<string, string> = {
  "claude-code": "Claude Code",
  "claude-ai": "Claude",
  "codex": "Codex",
  cursor: "Cursor",
};

export function UsageGuide({ skill }: { skill: SkillDetail }) {
  const agents = (skill.agents?.length ? skill.agents : defaultAgents).map(
    (agent) => agentNames[agent] ?? agent,
  );

  return (
    <section className="space-y-12">
      <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">怎么用</h2>
      <ol className="space-y-12">
        <li className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-10">
          <p className="text-sm text-quiet">安装</p>
          <div>
            <p className="text-lg">
              把链接复制给正在用的 Agent，让它帮你装。也可以自己在终端执行。
            </p>
            <div className="mt-5">
              <InstallCommand source={skill.source} />
            </div>
            <div className="mt-4">
              <CopyForAgent source={skill.source} name={skill.name} skillId={skill.id} />
            </div>
          </div>
        </li>
        <li className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-10">
          <p className="text-sm text-quiet">对话</p>
          <div>
            <p className="text-lg">不必先点菜单。把要做的事说清楚，或点名这个 skill。</p>
            <p className="mt-5 font-mono text-sm leading-7 text-quiet">
              用 {skill.name} {skill.description ? "处理这件事" : "帮我做…"}
            </p>
          </div>
        </li>
        <li className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-10">
          <p className="text-sm text-quiet">环境</p>
          <div>
            <p className="text-lg">{agents.join("、")}。同一份说明书可以跨工具用。</p>
            <div className="mt-5 space-y-2 font-mono text-sm leading-7 text-quiet">
              <p>Cursor · ~/.cursor/skills/{skill.name}/</p>
              <p>Claude · ~/.claude/skills/{skill.name}/</p>
              <p>Codex · ~/.agents/skills/{skill.name}/</p>
            </div>
          </div>
        </li>
      </ol>
      {skill.hasScripts ? (
        <p className="max-w-2xl text-sm leading-7 text-quiet">
          带 scripts/ 时，Agent 可能会执行仓库里的脚本。先读原文，确认命令可接受再装。
        </p>
      ) : null}
    </section>
  );
}
