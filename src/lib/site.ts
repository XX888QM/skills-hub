export const siteConfig = {
  name: "汇总skill",
  nameEn: "HuiZong Skill",
  repoName: "skills-hub",
  repoUrl: "https://github.com/XX888QM/skills-hub",
  defaultTitle: "汇总skill — 中文 Agent Skills 市场",
  description:
    "汇总skill 是中文 Agent Skills 市场。面向开发者检索 GitHub 上的公开 Agent Skill 与 SKILL.md，阅读说明书，复制 npx skills add 安装命令。数据按需来自 skills.sh、SkillMD 与 GitHub 公开接口，不爬全站。",
  keywords: [
    "汇总skill",
    "HuiZong Skill",
    "Agent Skills",
    "Agent Skill",
    "SKILL.md",
    "skills.sh",
    "SkillMD",
    "GitHub Skills",
    "npx skills add",
    "Agent Skill 市场",
    "中文 Skill",
  ],
};

function asUrl(value?: string) {
  const trimmed = value?.replace(/\/+$/, "");
  if (!trimmed) return "";
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export function getSiteUrl() {
  return (
    asUrl(process.env.SITE_URL) ||
    asUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    asUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    asUrl(process.env.VERCEL_URL) ||
    "http://localhost:3000"
  );
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const pageMeta = {
  search: {
    title: "检索",
    description:
      "在汇总skill 按关键词检索公开 Agent Skill。同时查询 skills.sh 与 SkillMD，合并重复项后阅读说明书，再决定是否安装。",
  },
  skills: {
    title: "公开 Skill",
    description:
      "浏览 GitHub 上能搜到的公开 Agent Skill。可按仓库星标、安装量、更新时间或名称排序。星标是整个仓库的，不是单条说明书的。",
  },
  packs: {
    title: "场景包",
    description:
      "按前端、文档、React、审查、测试、规划等方向查看公开 Agent Skill。每个场景包是一组实时检索，不是本机目录。",
  },
  guide: {
    title: "使用说明",
    description:
      "汇总skill 使用说明：如何检索 Agent Skill、阅读 SKILL.md、复制安装命令或交给 Agent 代装，以及如何上架公开仓库。",
  },
  submit: {
    title: "预览仓库",
    description:
      "把公开 GitHub 仓库的 owner/repo 贴到汇总skill。本站当场读取合格的 SKILL.md，不另存拷贝，也不做上架审核。",
  },
};
