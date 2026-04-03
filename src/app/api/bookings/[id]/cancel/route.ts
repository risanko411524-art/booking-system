import { NextRequest, NextResponse } from "next/server";
import { sheetsClient } from "@/lib/booking/sheets";
import { canCancelBooking } from "@/lib/booking/validation";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await sheetsClient.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
    }
    if (booking.status !== "active") {
      return NextResponse.json({ error: "この予約はすでにキャンセルされています" }, { status: 400 });
    }

    // Check cancel deadline
    const slot = await sheetsClient.getSlotById(booking.slot_id);
    if (!slot) {
      return NextResponse.json({ error: "枠が見つかりません" }, { status: 404 });
    }

    const cancelable = canCancelBooking(slot);
    if (!cancelable.ok) {
      return NextResponse.json({ error: cancelable.reason }, { status: 400 });
    }

    const cancelled = await sheetsClient.cancelBooking(id);
    return NextResponse.json({ booking: cancelled });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
