import { translate, type Locale } from "./i18n";

export function formatInstalls(value?: number, locale: Locale = "zh") {
  if (value == null) return "—";
  if (locale === "zh") {
    if (value >= 10000) return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)} 万`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return String(value);
  }
  if (value >= 1_000_000) {
    const n = value / 1_000_000;
    return `${n >= 10 ? n.toFixed(0) : n.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const n = value / 1000;
    return `${n >= 10 ? n.toFixed(0) : n.toFixed(1)}k`;
  }
  return String(value);
}

export function formatRelativeTime(iso?: string, locale: Locale = "zh") {
  if (!iso) return "—";
  const delta = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(delta) || delta < 0) return "—";
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 60) return translate(locale, "time.m", { n: Math.max(1, minutes) });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return translate(locale, "time.h", { n: hours });
  const days = Math.floor(hours / 24);
  if (days < 30) return translate(locale, "time.d", { n: days });
  const months = Math.floor(days / 30);
  if (months < 12) return translate(locale, "time.mo", { n: months });
  return translate(locale, "time.y", { n: Math.floor(months / 12) });
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
  locale = "zh",
}: {
  source: string;
  name?: string;
  page?: string;
  locale?: Locale;
}) {
  return translate(locale, "copy.prompt", {
    name: name ?? "",
    source,
    command: installCommand(source),
    page: page ?? "",
  });
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

export function isGithubName(value: string) {
  return /^[\w.-]+$/.test(value);
}

export function splitSkillId(id: string) {
  const pieces = id.split("/").filter(Boolean);
  if (pieces.length >= 3) {
    return {
      name: pieces.at(-1) ?? id,
      source: `${pieces[0]}/${pieces[1]}`,
      owner: pieces[0] ?? "",
      repo: pieces[1] ?? "",
    };
  }
  if (pieces.length === 2) {
    return {
      name: pieces[1],
      source: `${pieces[0]}/${pieces[1]}`,
      owner: pieces[0],
      repo: pieces[1],
    };
  }
  return {
    name: pieces[0] ?? id,
    source: id,
    owner: pieces[0] ?? "",
    repo: "",
  };
}
