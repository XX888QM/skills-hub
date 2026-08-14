import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }
  }

  revalidateTag("github-hot", "max");
  revalidatePath("/");
  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
  });
}
