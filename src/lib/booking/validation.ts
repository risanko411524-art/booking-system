import type { Slot } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingForm(data: {
  email?: string;
  name?: string;
  room_name?: string;
}): string | null {
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    return "有効なメールアドレスを入力してください";
  }
  if (!data.name || data.name.length < 1 || data.name.length > 50) {
    return "名前を入力してください（50文字以内）";
  }
  if (!data.room_name || data.room_name.length < 1 || data.room_name.length > 50) {
    return "部屋名を入力してください（50文字以内）";
  }
  return null;
}

export function canBookSlot(slot: Slot): { ok: boolean; reason?: string } {
  if (slot.current_count >= slot.max_capacity) {
    return { ok: false, reason: "この枠は満席です" };
  }
  const now = new Date();
  const slotStart = new Date(`${slot.date}T${slot.start_time}:00`);
  if (slotStart <= now) {
    return { ok: false, reason: "この枠は既に開始しています" };
  }
  return { ok: true };
}

export function canCancelBooking(slot: Slot): {
  ok: boolean;
  reason?: string;
} {
  const now = new Date();
  const slotStart = new Date(`${slot.date}T${slot.start_time}:00`);
  const threeHoursBefore = new Date(slotStart.getTime() - 3 * 60 * 60 * 1000);
  if (now >= threeHoursBefore) {
    return { ok: false, reason: "キャンセルは開始3時間前までです" };
  }
  return { ok: true };
}
