import { loadGithubRepo, searchSkills } from "./sources";
import { translateText } from "./translate";
import type { GithubRepo, StarBoardItem } from "./types";

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
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=15`,
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

export async function loadStarBoard(limit = 10) {
  const found = await searchGithubSkillRepos();
  const bySource = new Map(found.map((item) => [item.source.toLowerCase(), item]));

  await Promise.all(
    SEED_REPOS.map(async (source) => {
      if (bySource.has(source.toLowerCase())) return;
      const repo = await loadGithubRepo(source);
      if (repo) bySource.set(source.toLowerCase(), asItem(repo));
    }),
  );

  const ranked = [...bySource.values()]
    .filter((item) => item.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);

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
