import type { ReactNode } from "react";

const PHRASES = [
  "npx skills add",
  "HuiZong Skill",
  "Claude Code",
  "汇总skill",
  "owner/repo",
  "SKILL.md",
  "Next.js",
  "skills.sh",
  "SkillMD",
  "llms.txt",
  "GitHub",
  "scripts/",
  "复制给 Agent",
  "Cursor",
  "Claude",
  "Codex",
  "Agent",
  "在终端执行。",
  "终端执行。",
  "仓库星标",
  "安装量",
];

const PATTERN = new RegExp(
  `(${PHRASES.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g",
);

export function KeepTogether({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  const parts = children.split(PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        PHRASES.includes(part) ? (
          <span key={`${part}-${index}`} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Nb({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}
