import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sheetsClient } from "@/lib/booking/sheets";
import { verifySessionToken, COOKIE_NAME } from "@/lib/booking/auth";

export async function GET() {
  try {
    const instructors = await sheetsClient.getInstructors();
    return NextResponse.json({ instructors });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { name, zoom_link, zoom_id, zoom_passcode } = body;

    if (!name || !zoom_link) {
      return NextResponse.json({ error: "名前とZoomリンクは必須です" }, { status: 400 });
    }

    const instructor = await sheetsClient.addInstructor({ name, zoom_link, zoom_id: zoom_id || "", zoom_passcode: zoom_passcode || "" });
    return NextResponse.json({ instructor });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
