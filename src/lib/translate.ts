import type { SkillDetail, SkillRecord } from "./types";

const memory = new Map<string, { expires: number; value: string }>();

const categories: Record<string, string> = {
  "Docs & Writing": "文档与写作",
  "Data & Analytics": "数据与分析",
  "Design & Media": "设计与媒体",
  "Coding & Dev Tools": "开发工具",
  "Web & Frontend": "网页与前端",
  "Marketing & Growth": "增长与营销",
  "Product & Planning": "产品与规划",
  "Research & Search": "研究与检索",
  "Productivity": "效率",
  "DevOps & Infra": "运维与基础设施",
  "Finance & Business": "财务与商业",
  "Security": "安全",
  "Integrations & APIs": "集成与接口",
  "AI & ML": "人工智能",
};

export function originLabel(origin: SkillRecord["origin"]) {
  if (origin === "skills.sh") return "安装榜";
  if (origin === "skillmd") return "精选库";
  return "GitHub";
}

export function looksChinese(text: string) {
  const han = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return han > 0 && han >= latin;
}

function cached(key: string) {
  const hit = memory.get(key);
  if (!hit || hit.expires < Date.now()) return null;
  return hit.value;
}

function store(key: string, value: string) {
  memory.set(key, { expires: Date.now() + 24 * 60 * 60_000, value });
  return value;
}

async function mapPool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const result = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        result[index] = await worker(items[index]);
      }
    }),
  );
  return result;
}

async function googleTranslate(text: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url, {
    headers: { "User-Agent": "skills-hub/0.1" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error(`translate ${response.status}`);
  const data = (await response.json()) as [Array<[string, string]>];
  return (data[0] ?? []).map((part) => part[0]).join("");
}

export async function translateText(text: string) {
  const input = text.trim();
  if (!input || looksChinese(input)) return text;
  const key = `t:${input}`;
  const hit = cached(key);
  if (hit) return hit;
  try {
    return store(key, (await googleTranslate(input)).trim() || text);
  } catch {
    return text;
  }
}

export async function translateCategory(category?: string) {
  if (!category) return category;
  return categories[category] ?? translateText(category);
}

function shield(markdown: string) {
  const held: string[] = [];
  const next = markdown
    .replace(/```[\s\S]*?```/g, (block) => {
      held.push(block);
      return `\n%%${held.length - 1}%%\n`;
    })
    .replace(/`[^`\n]+`/g, (block) => {
      held.push(block);
      return `%%${held.length - 1}%%`;
    });
  return { next, held };
}

function restore(text: string, held: string[]) {
  return text.replace(/%%\s*(\d+)\s*%%/g, (_, index) => held[Number(index)] ?? _);
}

function chunk(text: string, size = 2800) {
  if (text.length <= size) return [text];
  const parts: string[] = [];
  let current = "";
  for (const piece of text.split(/(\n{2,})/)) {
    if (current.length + piece.length > size && current) {
      parts.push(current);
      current = piece;
    } else {
      current += piece;
    }
  }
  if (current.trim()) parts.push(current);
  return parts;
}

export async function translateMarkdown(markdown: string) {
  if (!markdown.trim() || looksChinese(markdown)) return markdown;
  const key = `md:${markdown}`;
  const hit = cached(key);
  if (hit) return hit;

  const { next, held } = shield(markdown);
  const parts = chunk(next);
  const translated = await mapPool(parts, 3, (part) =>
    part.trim() ? translateText(part) : Promise.resolve(part),
  );
  return store(key, restore(translated.join(""), held));
}

export async function localizeRecords(skills: SkillRecord[]) {
  return mapPool(skills, 5, async (skill) => ({
    ...skill,
    description: skill.description
      ? await translateText(skill.description)
      : skill.description,
    category: await translateCategory(skill.category),
  }));
}

export async function localizeDetail(skill: SkillDetail): Promise<SkillDetail> {
  const [description, markdown, category, repoDescription] = await Promise.all([
    skill.description ? translateText(skill.description) : skill.description,
    translateMarkdown(skill.markdown),
    translateCategory(skill.category),
    skill.repo?.description ? translateText(skill.repo.description) : undefined,
  ]);
  return {
    ...skill,
    description,
    markdown,
    category,
    originalDescription: skill.description,
    originalMarkdown: skill.markdown,
    repo: skill.repo
      ? { ...skill.repo, description: repoDescription ?? skill.repo.description }
      : skill.repo,
  };
}
