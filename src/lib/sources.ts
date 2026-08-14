import { githubFileUrl, isGithubName, splitSkillId } from "./format";
import { safeMatter } from "./matter";
import type { GithubRepo, ResolvedSkill, SkillDetail, SkillRecord } from "./types";

const UA = { "User-Agent": "skills-hub/0.1" };

type SkillsShHit = {
  id: string;
  skillId?: string;
  name: string;
  installs?: number;
  source: string;
};

type SkillmdHit = {
  slug: string;
  title: string;
  description?: string;
  verified?: boolean;
  agents?: string;
  category?: string;
  avg_rating?: number;
};

const cache = new Map<string, { expires: number; value: unknown }>();

function remember<T>(key: string, ttlMs: number, value: T) {
  cache.set(key, { expires: Date.now() + ttlMs, value });
  return value;
}

function recall<T>(key: string) {
  const hit = cache.get(key);
  if (!hit || hit.expires < Date.now()) return null;
  return hit.value as T;
}

async function readJson<T>(url: string) {
  const response = await fetch(url, {
    headers: { ...UA, Accept: "application/json" },
    next: { revalidate: 180 },
  });
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return (await response.json()) as T;
}

async function readText(url: string) {
  const response = await fetch(url, {
    headers: UA,
    next: { revalidate: 180 },
  });
  if (!response.ok) return null;
  return response.text();
}

function asRecord(hit: SkillsShHit): SkillRecord {
  return {
    id: hit.id,
    name: hit.name || hit.skillId || hit.id.split("/").at(-1) || hit.id,
    source: hit.source,
    installs: hit.installs,
    origin: "skills.sh",
  };
}

function asSkillmd(hit: SkillmdHit): SkillRecord {
  const [owner, name] = hit.slug.split("/");
  return {
    id: hit.slug,
    name: hit.title || name || hit.slug,
    source: owner && name ? `${owner}/${name}` : hit.slug,
    description: hit.description,
    category: hit.category,
    verified: hit.verified,
    agents: hit.agents ? hit.agents.split(",").map((item) => item.trim()) : undefined,
    rating: hit.avg_rating,
    origin: "skillmd",
  };
}

function mergeKey(skill: SkillRecord) {
  return `${skill.source.toLowerCase()}::${skill.name.toLowerCase()}`;
}

export function mergeSkills(groups: SkillRecord[][]) {
  const map = new Map<string, SkillRecord>();
  for (const group of groups) {
    for (const skill of group) {
      const key = mergeKey(skill);
      const current = map.get(key);
      if (!current) {
        map.set(key, skill);
        continue;
      }
      map.set(key, {
        ...current,
        ...skill,
        id: current.origin === "skills.sh" ? current.id : skill.id,
        installs: current.installs ?? skill.installs,
        description: current.description || skill.description,
        verified: current.verified || skill.verified,
        category: current.category || skill.category,
        agents: current.agents?.length ? current.agents : skill.agents,
        origin: current.origin === "skills.sh" ? current.origin : skill.origin,
      });
    }
  }
  return [...map.values()].sort((a, b) => (b.installs ?? 0) - (a.installs ?? 0));
}

export async function searchSkills(query: string) {
  const q = query.trim();
  if (!q) return [];
  const key = `search:${q.toLowerCase()}`;
  const cached = recall<SkillRecord[]>(key);
  if (cached) return cached;

  const [skillsSh, skillmd] = await Promise.allSettled([
    readJson<{ skills?: SkillsShHit[] }>(
      `https://skills.sh/api/search?q=${encodeURIComponent(q)}`,
    ),
    readJson<{ items?: SkillmdHit[] }>(
      `https://api.skillmd.com/v1/search?q=${encodeURIComponent(q)}`,
    ),
  ]);

  const sh =
    skillsSh.status === "fulfilled"
      ? (skillsSh.value.skills ?? []).map(asRecord)
      : [];
  const md =
    skillmd.status === "fulfilled"
      ? (skillmd.value.items ?? []).map(asSkillmd)
      : [];

  return remember(key, 180_000, mergeSkills([sh, md]));
}

export async function searchMany(queries: string[]) {
  const groups = await Promise.all(queries.map((query) => searchSkills(query)));
  return mergeSkills(groups);
}

function looksLikeSkill(markdown: string) {
  const parsed = safeMatter(markdown);
  const name = parsed.data.name;
  const description = parsed.data.description;
  return Boolean(name && description);
}

function hasScripts(markdown: string, path = "") {
  return /scripts\//.test(markdown) || /\/scripts\//.test(path);
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    ...UA,
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function loadGithubRepo(source: string): Promise<GithubRepo | null> {
  const parsed = source.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (!parsed) return null;
  const key = `gh:${source}`;
  const cached = recall<GithubRepo | null>(key);
  if (cached !== null && cached !== undefined) return cached;

  const response = await fetch(`https://api.github.com/repos/${source}`, {
    headers: githubHeaders(),
    next: { revalidate: 300, tags: ["github-repo"] },
  });
  if (!response.ok) return remember(key, 180_000, null);

  const data = (await response.json()) as {
    full_name?: string;
    html_url?: string;
    stargazers_count?: number;
    forks_count?: number;
    pushed_at?: string;
    license?: { spdx_id?: string } | null;
    description?: string | null;
  };

  return remember(key, 300_000, {
    fullName: data.full_name ?? source,
    url: data.html_url ?? `https://github.com/${source}`,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    pushedAt: data.pushed_at,
    license: data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION"
      ? data.license.spdx_id
      : undefined,
    description: data.description ?? undefined,
  });
}

async function loadGithubMarkdown(id: string) {
  const { owner, repo, name, source } = splitSkillId(id);
  if (!owner || !repo) return null;
  const candidates = [
    `https://raw.githubusercontent.com/${source}/HEAD/skills/${name}/SKILL.md`,
    `https://raw.githubusercontent.com/${source}/HEAD/${name}/SKILL.md`,
    `https://raw.githubusercontent.com/${source}/HEAD/.claude/skills/${name}/SKILL.md`,
    `https://raw.githubusercontent.com/${source}/HEAD/.agents/skills/${name}/SKILL.md`,
    `https://raw.githubusercontent.com/${source}/HEAD/.cursor/skills/${name}/SKILL.md`,
    `https://raw.githubusercontent.com/${source}/HEAD/SKILL.md`,
  ];
  try {
    return await Promise.any(
      candidates.map(async (url) => {
        const text = await readText(url);
        if (text && looksLikeSkill(text)) return { markdown: text, rawUrl: url };
        throw new Error("miss");
      }),
    );
  } catch {
    return null;
  }
}

async function loadSkillmdMarkdown(id: string) {
  const { owner, name, source } = splitSkillId(id);
  const slugs = [`${owner}/${name}`, source, id];
  for (const slug of slugs) {
    const text = await readText(`https://api.skillmd.com/api/skills/${slug}/raw`);
    if (text && text.length > 40) return { markdown: text, rawUrl: `https://api.skillmd.com/api/skills/${slug}/raw` };
  }
  return null;
}

export async function loadSkillDetail(id: string, hint?: SkillRecord): Promise<SkillDetail | null> {
  const key = `detail:${id}`;
  const cached = recall<SkillDetail>(key);
  if (cached) return cached;

  const { name, source, owner, repo: repoName } = splitSkillId(id);
  const repoSource = hint?.source && isGithubName(hint.source.split("/")[0] ?? "")
    ? hint.source
    : source;
  const [gh, repo] = await Promise.all([
    loadGithubMarkdown(id),
    loadGithubRepo(repoSource),
  ]);
  let loaded = gh;
  if (!loaded) {
    loaded = await loadSkillmdMarkdown(id);
  }
  if (!loaded && owner && repoName && isGithubName(owner) && isGithubName(repoName)) {
    const listed = await resolveRepo(owner, repoName).catch(() => []);
    const match =
      listed.find((item) => item.name.toLowerCase() === name.toLowerCase()) ?? listed[0];
    if (match) {
      const text = await readText(match.rawUrl);
      if (text && looksLikeSkill(text)) loaded = { markdown: text, rawUrl: match.rawUrl };
    }
  }
  const githubUrl = repo?.url ?? `https://github.com/${repoSource}`;
  if (!loaded) {
    return hint
      ? remember(key, 180_000, {
          ...hint,
          markdown: hint.description
            ? `---\nname: ${hint.name}\ndescription: ${hint.description}\n---\n\n${hint.description}`
            : `# ${hint.name}\n\n暂未读到 SKILL.md 原文。可先用安装命令拉取仓库。`,
          frontmatter: {},
          hasScripts: false,
          githubUrl,
          repo,
        })
      : null;
  }

  const parsed = safeMatter(loaded.markdown);
  const detail: SkillDetail = {
    id,
    name: String(parsed.data.name ?? hint?.name ?? name),
    source: repoSource,
    installs: hint?.installs,
    description: String(parsed.data.description ?? hint?.description ?? ""),
    category: hint?.category,
    verified: hint?.verified,
    agents: hint?.agents,
    rating: hint?.rating,
    origin: hint?.origin ?? (gh ? "github" : "skillmd"),
    markdown: parsed.content.trim() || loaded.markdown,
    frontmatter: parsed.data,
    rawUrl: loaded.rawUrl,
    githubUrl,
    githubFileUrl: githubFileUrl(loaded.rawUrl),
    hasScripts: hasScripts(loaded.markdown),
    repo,
  };
  return remember(key, 180_000, detail);
}

type GithubTree = {
  tree?: { path: string; type: string }[];
};

export async function resolveRepo(owner: string, repo: string) {
  if (!isGithubName(owner) || !isGithubName(repo)) {
    throw new Error("仓库名不合法");
  }
  const key = `repo:${owner}/${repo}`;
  const cached = recall<ResolvedSkill[]>(key);
  if (cached) return cached;

  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers: githubHeaders(), next: { revalidate: 300, tags: ["github-repo"] } },
  );
  if (!treeRes.ok) {
    throw new Error(
      treeRes.status === 404
        ? "仓库不存在或未公开"
        : `GitHub 暂时不可用（${treeRes.status}）`,
    );
  }
  const tree = (await treeRes.json()) as GithubTree;
  const paths = (tree.tree ?? [])
    .filter((item) => item.type === "blob" && /(^|\/)SKILL\.md$/i.test(item.path))
    .map((item) => item.path)
    .slice(0, 24);

  const resolved = (
    await Promise.all(
      paths.map(async (path) => {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`;
        const markdown = await readText(rawUrl);
        if (!markdown || !looksLikeSkill(markdown)) return null;
        const parsed = safeMatter(markdown);
        return {
          path,
          name: String(parsed.data.name ?? path.split("/").at(-2) ?? path),
          description: String(parsed.data.description ?? ""),
          rawUrl,
          hasScripts: hasScripts(markdown, path),
        } satisfies ResolvedSkill;
      }),
    )
  ).filter((item): item is ResolvedSkill => Boolean(item));

  return remember(key, 300_000, resolved);
}
