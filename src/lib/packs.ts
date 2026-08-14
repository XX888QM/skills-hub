import type { ScenePack } from "./types";

export const scenePacks: ScenePack[] = [
  {
    slug: "frontend",
    title: "前端界面",
    query: "frontend-design frontend ui",
    summary: "GitHub 上装得最多的一类：把页面做出厂，而不是生成一套模板脸。",
    tone: "官方 frontend-design 和一批 UI 工程 skill。",
  },
  {
    slug: "documents",
    title: "文档与表格",
    query: "pdf docx xlsx pptx",
    summary: "读、写、拆 PDF / Word / Excel / PPT。Anthropic 官方文档 skill 就在这组。",
    tone: "文档是安装榜常客。",
  },
  {
    slug: "react",
    title: "React 与 Next",
    query: "react next.js vercel",
    summary: "Vercel 实验室和社区里的 React / Next.js 最佳实践。",
    tone: "Web 应用开工最常搜的栈。",
  },
  {
    slug: "review",
    title: "审查与安全",
    query: "code-review security audit",
    summary: "PR 审查、安全加固、上线前核对。",
    tone: "装之前先看它会不会乱来。",
  },
  {
    slug: "testing",
    title: "浏览器测试",
    query: "playwright webapp-testing browser",
    summary: "用真实浏览器点一遍本地应用，官方 webapp-testing 走这条。",
    tone: "写完要能验。",
  },
  {
    slug: "workflow",
    title: "规划与工程",
    query: "superpowers tdd planning",
    summary: "拆任务、写计划、TDD。GitHub 上星标很高的一批 skill 仓库就在这。",
    tone: "先想清楚再动手。",
  },
];

export const featuredQueries = ["frontend", "pdf", "react", "review", "nextjs"];
