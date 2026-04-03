import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sheetsClient } from "@/lib/booking/sheets";
import { verifySessionToken, COOKIE_NAME } from "@/lib/booking/auth";

async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }
  return null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const updated = await sheetsClient.updateSlot(id, body);
    if (!updated) {
      return NextResponse.json({ error: "枠が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ slot: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    const deleted = await sheetsClient.deleteSlot(id);
    if (!deleted) {
      return NextResponse.json({ error: "枠が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
