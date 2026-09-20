import { NextResponse } from "next/server";
import { getLibrariesByIds } from "@/lib/data/libraries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // user input: split, drop blanks, cap the count
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  const items = await getLibrariesByIds(ids);
  return NextResponse.json({ items });
}