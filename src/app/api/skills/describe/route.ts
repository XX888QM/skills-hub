import { NextResponse } from "next/server";
import { isGithubName, splitSkillId } from "@/lib/format";
import { fillMissingDescriptions } from "@/lib/sources";
import { localizeRecordsBounded } from "@/lib/translate";
import type { SkillRecord } from "@/lib/types";

const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 12) {
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

function asStub(id: string): SkillRecord | null {
  const { owner, repo, name, source } = splitSkillId(id);
  if (!owner || !repo || !isGithubName(owner) || !isGithubName(repo)) return null;
  return {
    id,
    name,
    source,
    origin: "github",
  };
}

export async function POST(request: Request) {
  if (tooMany(clientIp(request))) {
    return NextResponse.json({ error: "请求太频繁，稍后再试。" }, { status: 429 });
  }

  let body: { ids?: unknown };
  try {
    body = (await request.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ error: "请求格式不正确。" }, { status: 400 });
  }
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((id): id is string => typeof id === "string").slice(0, 24)
    : [];
  const stubs = ids.map(asStub).filter((item): item is SkillRecord => Boolean(item));
  const filled = await localizeRecordsBounded(
    await fillMissingDescriptions(stubs, { timeoutMs: 6000, concurrency: 12 }),
    2500,
  );
  const descriptions = Object.fromEntries(
    filled
      .filter((item) => item.description?.trim())
      .map((item) => [item.id, item.description as string]),
  );
  return NextResponse.json({ descriptions });
}
