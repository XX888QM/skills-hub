import { NextResponse } from "next/server";
import { isGithubName } from "@/lib/format";
import { resolveRepo } from "@/lib/sources";
import { translateText } from "@/lib/translate";

const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 8) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function POST(request: Request) {
  if (tooMany(clientIp(request))) {
    return NextResponse.json({ error: "请求太频繁，稍后再试。" }, { status: 429 });
  }

  const body = (await request.json()) as { owner?: string; repo?: string };
  const owner = body.owner?.trim();
  const repo = body.repo?.trim();
  if (!owner || !repo || !isGithubName(owner) || !isGithubName(repo)) {
    return NextResponse.json({ error: "请提供合法的 owner 和 repo" }, { status: 400 });
  }
  try {
    const skills = await Promise.all(
      (await resolveRepo(owner, repo)).map(async (skill) => ({
        ...skill,
        description: skill.description
          ? await translateText(skill.description)
          : skill.description,
      })),
    );
    return NextResponse.json({ owner, repo, skills });
  } catch (error) {
    const message = error instanceof Error ? error.message : "解析失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
