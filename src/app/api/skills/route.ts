import { NextResponse } from "next/server";
import { loadCatalogPage } from "@/lib/stars";
import { localizeRecordsBounded } from "@/lib/translate";

export const revalidate = 180;

export async function GET(request: Request) {
  const page = Math.max(1, Number(new URL(request.url).searchParams.get("page") ?? "1") || 1);

  try {
    const { items, hasMore } = await loadCatalogPage(page);
    const localized = await localizeRecordsBounded(items, 2500);
    return NextResponse.json({ page, items: localized, hasMore });
  } catch {
    return NextResponse.json(
      { page, items: [], hasMore: false, error: "目录暂时读不到" },
      { status: 502 },
    );
  }
}
