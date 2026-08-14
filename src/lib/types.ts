export type SkillOrigin = "skills.sh" | "skillmd" | "github";

export type SkillRecord = {
  id: string;
  name: string;
  source: string;
  installs?: number;
  description?: string;
  category?: string;
  verified?: boolean;
  agents?: string[];
  rating?: number;
  origin: SkillOrigin;
};

export type GithubRepo = {
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  pushedAt?: string;
  license?: string;
  description?: string;
};

export type SkillDetail = SkillRecord & {
  markdown: string;
  frontmatter: Record<string, unknown>;
  rawUrl?: string;
  githubUrl?: string;
  githubFileUrl?: string;
  hasScripts: boolean;
  repo?: GithubRepo | null;
  originalDescription?: string;
  originalMarkdown?: string;
};

export type ResolvedSkill = {
  path: string;
  name: string;
  description: string;
  rawUrl: string;
  hasScripts: boolean;
};

export type ScenePack = {
  slug: string;
  title: string;
  query: string;
  summary: string;
  tone: string;
};

export type StarBoardItem = {
  source: string;
  stars: number;
  forks: number;
  url: string;
  description?: string;
  pushedAt?: string;
  skills: SkillRecord[];
};

export type CatalogItem = SkillRecord & {
  stars?: number;
  forks?: number;
  pushedAt?: string;
};
