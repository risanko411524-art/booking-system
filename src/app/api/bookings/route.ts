import { NextRequest, NextResponse } from "next/server";
import { sheetsClient } from "@/lib/booking/sheets";
import { validateBookingForm, canBookSlot } from "@/lib/booking/validation";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email") || undefined;
    const slotId = request.nextUrl.searchParams.get("slotId") || undefined;

    if (!email && !slotId) {
      return NextResponse.json(
        { error: "email または slotId を指定してください" },
        { status: 400 }
      );
    }

    const bookings = await sheetsClient.getBookings({ email, slotId });
    return NextResponse.json({ bookings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slot_id, email, name, room_name } = body;

    // Validate form
    const formError = validateBookingForm({ email, name, room_name });
    if (formError) {
      return NextResponse.json({ error: formError }, { status: 400 });
    }

    // Check slot exists and has capacity
    const slot = await sheetsClient.getSlotById(slot_id);
    if (!slot) {
      return NextResponse.json({ error: "枠が見つかりません" }, { status: 404 });
    }

    const bookable = canBookSlot(slot);
    if (!bookable.ok) {
      return NextResponse.json({ error: bookable.reason }, { status: 400 });
    }

    // Check duplicate: same email, same period, same month
    const hasDuplicate = await sheetsClient.hasActiveBookingInPeriod(
      email,
      slot.year_month,
      slot.period
    );
    if (hasDuplicate) {
      return NextResponse.json(
        { error: "この期間にはすでに予約があります。キャンセル後に再予約してください。" },
        { status: 400 }
      );
    }

    const booking = await sheetsClient.addBooking({
      slot_id,
      email,
      name,
      room_name,
    });

    return NextResponse.json({ booking, slot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
