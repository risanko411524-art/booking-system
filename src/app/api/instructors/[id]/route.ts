import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sheetsClient } from "@/lib/booking/sheets";
import { verifySessionToken, COOKIE_NAME } from "@/lib/booking/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await sheetsClient.updateInstructor(id, body);
    if (!updated) {
      return NextResponse.json({ error: "講師が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ instructor: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
