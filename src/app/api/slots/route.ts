import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sheetsClient } from "@/lib/booking/sheets";
import { verifySessionToken, COOKIE_NAME } from "@/lib/booking/auth";

export async function GET(request: NextRequest) {
  try {
    const yearMonth = request.nextUrl.searchParams.get("yearMonth") || undefined;
    const slots = await sheetsClient.getSlots(yearMonth);
    return NextResponse.json({ slots });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin only
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { date, start_time, end_time, instructor_name, zoom_link, zoom_id, zoom_passcode, period, max_capacity } = body;

    if (!date || !start_time || !end_time || !instructor_name || !zoom_link || !period) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    const slot = await sheetsClient.addSlot({
      date,
      start_time,
      end_time,
      instructor_name,
      zoom_link,
      zoom_id: zoom_id || "",
      zoom_passcode: zoom_passcode || "",
      period,
      max_capacity: max_capacity || 12,
    });

    return NextResponse.json({ slot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
