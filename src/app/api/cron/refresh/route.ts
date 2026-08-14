import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "未配置 CRON_SECRET" }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  revalidateTag("github-hot", "max");
  revalidatePath("/");
  revalidatePath("/skills");
  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
  });
}
