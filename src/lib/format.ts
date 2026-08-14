export function formatInstalls(value?: number) {
  if (value == null) return "—";
  if (value >= 10000) return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)} 万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function formatRelativeTime(iso?: string) {
  if (!iso) return "—";
  const delta = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(delta) || delta < 0) return "—";
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} 个月前`;
  return `${Math.floor(months / 12)} 年前`;
}

export function githubFileUrl(rawUrl?: string) {
  const match = rawUrl?.match(
    /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/,
  );
  if (!match) return undefined;
  return `https://github.com/${match[1]}/${match[2]}/blob/${match[3]}/${match[4]}`;
}

export function parseRepoInput(input: string) {
  const trimmed = input.trim().replace(/\/+$/, "");
  const github = trimmed.match(
    /github\.com\/([^/]+)\/([^/#?]+)/i,
  );
  if (github) return { owner: github[1], repo: github[2].replace(/\.git$/, "") };
  const short = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (short) return { owner: short[1], repo: short[2] };
  return null;
}

export function installCommand(source: string) {
  return `npx skills add ${source}`;
}

export function agentInstallPrompt({
  source,
  name,
  page,
}: {
  source: string;
  name?: string;
  page?: string;
}) {
  const lines = [
    "请帮我安装这个 Agent Skill。",
    name ? `名称：${name}` : "",
    `仓库：${source}`,
    `安装命令：${installCommand(source)}`,
    page ? `说明书：${page}` : "",
    "先读说明书，确认可以接受后再执行安装命令。装好后告诉我怎么用。",
  ];
  return lines.filter(Boolean).join("\n");
}

export function skillHref(id: string) {
  return `/s/${id
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")}`;
}

export function decodeSkillId(parts: string[]) {
  return parts.map((part) => decodeURIComponent(part)).join("/");
}

export function splitSkillId(id: string) {
  const pieces = id.split("/").filter(Boolean);
  const name = pieces.at(-1) ?? id;
  const source =
    pieces.length >= 3 ? pieces.slice(0, 2).join("/") : pieces.slice(0, -1).join("/") || id;
  return { name, source, owner: pieces[0] ?? "", repo: pieces[1] ?? "" };
}
