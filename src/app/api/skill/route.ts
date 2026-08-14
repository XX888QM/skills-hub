import { NextResponse } from "next/server";
import { loadSkillDetail, searchSkills } from "@/lib/sources";
import { splitSkillId } from "@/lib/format";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }
  const hint = (await searchSkills(splitSkillId(id).name)).find((item) => item.id === id);
  const skill = await loadSkillDetail(id, hint);
  if (!skill) {
    return NextResponse.json({ error: "没有读到这个 Skill" }, { status: 404 });
  }
  return NextResponse.json(skill);
}
