import { fillMissingDescriptions, loadGithubRepo, searchMany, searchSkills } from "./sources";
import { translateText } from "./translate";
import type { CatalogItem, GithubRepo, StarBoardItem } from "./types";

const SEED_REPOS = [
  "anthropics/skills",
  "vercel-labs/agent-skills",
  "openai/skills",
  "github/awesome-copilot",
  "anthropics/knowledge-work-plugins",
  "vercel-labs/skills",
];

type SearchRepo = {
  full_name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  description: string | null;
  pushed_at: string;
};

function asItem(repo: SearchRepo | GithubRepo): StarBoardItem {
  if ("fullName" in repo) {
    return {
      source: repo.fullName,
      stars: repo.stars,
      forks: repo.forks,
      url: repo.url,
      description: repo.description,
      pushedAt: repo.pushedAt,
      skills: [],
    };
  }
  return {
    source: repo.full_name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    url: repo.html_url,
    description: repo.description ?? undefined,
    pushedAt: repo.pushed_at,
    skills: [],
  };
}

const SEARCH_QUERIES = [
  "topic:agent-skills OR topic:claude-skills OR topic:cursor-skills fork:false",
  "SKILL.md stars:>80 fork:false",
  "\"agent skills\" stars:>50 fork:false",
];

function githubHeaders() {
  return {
    "User-Agent": "skills-hub/0.1",
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
}

function looksLikeSkillRepo(repo: SearchRepo) {
  const hay = `${repo.full_name} ${repo.description ?? ""}`.toLowerCase();
  return /skill|agent|claude|cursor|copilot|anthropic|openai|codex/.test(hay);
}

async function searchGithubSkillRepos() {
  const groups = await Promise.all(
    SEARCH_QUERIES.map(async (query) => {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=30`,
        {
          headers: githubHeaders(),
          next: { revalidate: 86400, tags: ["github-hot"] },
        },
      );
      if (!response.ok) return [];
      const data = (await response.json()) as { items?: SearchRepo[] };
      return (data.items ?? []).filter(looksLikeSkillRepo);
    }),
  );

  const bySource = new Map<string, SearchRepo>();
  for (const repo of groups.flat()) {
    const key = repo.full_name.toLowerCase();
    const current = bySource.get(key);
    if (!current || repo.stargazers_count > current.stargazers_count) {
      bySource.set(key, repo);
    }
  }
  return [...bySource.values()].map(asItem);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
    );
  });
}

let lastHotRepos: StarBoardItem[] = [];

async function loadHotReposUncached(limit: number) {
  const found = await searchGithubSkillRepos();
  const bySource = new Map(found.map((item) => [item.source.toLowerCase(), item]));

  if (bySource.size < limit) {
    await Promise.all(
      SEED_REPOS.map(async (source) => {
        if (bySource.has(source.toLowerCase())) return;
        const repo = await loadGithubRepo(source);
        if (repo) bySource.set(source.toLowerCase(), asItem(repo));
      }),
    );
  }

  return [...bySource.values()]
    .filter((item) => item.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);
}

export async function loadHotRepos(limit = 40, opts?: { timeoutMs?: number }) {
  const work = loadHotReposUncached(limit);
  const result = opts?.timeoutMs ? await withTimeout(work, opts.timeoutMs) : await work.catch(() => null);
  if (result?.length) {
    lastHotRepos = result;
    return result;
  }
  if (lastHotRepos.length) return lastHotRepos.slice(0, limit);
  return result ?? [];
}

function repoToCatalogItem(item: StarBoardItem): CatalogItem {
  const repo = item.source.split("/")[1] ?? item.source;
  return {
    id: `${item.source}/${repo}`,
    name: repo,
    source: item.source,
    description: item.description,
    origin: "github",
    stars: item.stars,
    forks: item.forks,
    pushedAt: item.pushedAt,
  };
}

export async function loadStarBoard(limit = 10) {
  const ranked = await loadHotRepos(limit);

  const withSkills = await Promise.all(
    ranked.map(async (item) => {
      const repoName = item.source.split("/")[1] ?? item.source;
      const hits = (await searchSkills(repoName)).filter(
        (skill) => skill.source.toLowerCase() === item.source.toLowerCase(),
      );
      const description = item.description
        ? await translateText(item.description)
        : item.description;
      return {
        ...item,
        description,
        skills: hits.slice(0, 4),
      };
    }),
  );

  return withSkills;
}

const CATALOG_QUERIES = [
  "skill",
  "frontend",
  "pdf",
  "react",
  "review",
  "nextjs",
  "claude",
  "cursor",
  "agent",
  "anthropic",
];

export const CATALOG_FIRST_PAGE_SIZE = 36;
export const CATALOG_FIRST_PAGE_TIMEOUT_MS = 4000;

const QUERY_BATCHES = [
  CATALOG_QUERIES.slice(0, 3),
  CATALOG_QUERIES.slice(3, 6),
  CATALOG_QUERIES.slice(6, 8),
  CATALOG_QUERIES.slice(8),
];

export const CATALOG_MORE_PAGES = QUERY_BATCHES.length;

function attachRepoMeta(skills: CatalogItem[], repos: StarBoardItem[]): CatalogItem[] {
  const repoBySource = new Map(repos.map((item) => [item.source.toLowerCase(), item]));
  return skills.map((skill) => {
    const repo = repoBySource.get(skill.source.toLowerCase());
    return {
      ...skill,
      stars: skill.stars ?? repo?.stars,
      forks: skill.forks ?? repo?.forks,
      pushedAt: skill.pushedAt ?? repo?.pushedAt,
    };
  });
}

export async function loadCatalogFirstPage() {
  const repos = await loadHotRepos(CATALOG_FIRST_PAGE_SIZE, {
    timeoutMs: CATALOG_FIRST_PAGE_TIMEOUT_MS,
  });
  const items = await fillMissingDescriptions(repos.map(repoToCatalogItem), {
    timeoutMs: 1500,
    concurrency: 6,
  });
  return {
    items,
    hasMore: CATALOG_MORE_PAGES > 0,
  };
}

export async function loadCatalogPage(page: number) {
  const batch = QUERY_BATCHES[page - 1];
  if (!batch?.length) return { items: [] as CatalogItem[], hasMore: false };

  const extras = await searchMany(batch);
  const repos = await loadHotRepos(CATALOG_FIRST_PAGE_SIZE, { timeoutMs: 2500 });
  const items = await fillMissingDescriptions(
    attachRepoMeta(
      extras.map((skill) => ({
        ...skill,
        stars: undefined,
        forks: undefined,
        pushedAt: undefined,
      })),
      repos,
    ),
    { timeoutMs: 4000, concurrency: 8 },
  );

  return {
    items,
    hasMore: page < QUERY_BATCHES.length,
  };
}
