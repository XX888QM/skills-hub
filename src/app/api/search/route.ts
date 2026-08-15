import { NextResponse } from "next/server";
import { searchSkills } from "@/lib/sources";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ query: "", skills: [] });
  }
  const skills = await searchSkills(q);
  return NextResponse.json({ query: q, skills });
}
