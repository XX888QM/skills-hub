import { NextResponse } from "next/server";
import { resolveRepo } from "@/lib/sources";
import { translateText } from "@/lib/translate";

export async function POST(request: Request) {
  const body = (await request.json()) as { owner?: string; repo?: string };
  const owner = body.owner?.trim();
  const repo = body.repo?.trim();
  if (!owner || !repo) {
    return NextResponse.json({ error: "请提供 owner 和 repo" }, { status: 400 });
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
