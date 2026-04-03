import { sheetsClient } from "@/lib/booking/sheets";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BookingCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await sheetsClient.getBookingById(id);

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-extrabold mb-2" style={{ color: "var(--text)" }}>予約が見つかりません</h2>
        <Link href="/booking" className="font-bold hover:underline" style={{ color: "var(--primary)" }}>予約枠一覧に戻る</Link>
      </div>
    );
  }

  const slot = await sheetsClient.getSlotById(booking.slot_id);
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="rounded-2xl p-8 mb-6 shadow-lg" style={{ background: "var(--bg2)", border: "3px solid var(--border)" }}>
        <div className="text-5xl mb-3">&#127881;</div>
        <h2 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text)" }}>予約が完了しました！</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>予約ID: {booking.booking_id}</p>
      </div>

      {slot && (
        <div className="bg-white rounded-2xl p-6 text-left space-y-4 shadow-md" style={{ border: "3px solid var(--border)" }}>
          <h3 className="font-extrabold text-lg pb-2" style={{ color: "var(--text)", borderBottom: "3px solid var(--primary)" }}>予約詳細</h3>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>予約日時</p>
            <p className="font-extrabold text-lg" style={{ color: "var(--text)" }}>
              {(() => {
                const date = new Date(slot.date + "T00:00:00");
                return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${days[date.getDay()]})`;
              })()}{" "}{slot.start_time} 〜 {slot.end_time}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>担当講師</p>
            <p className="font-extrabold text-lg" style={{ color: "var(--text)" }}>{slot.instructor_name}</p>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>Zoomリンク</p>
            <a href={slot.zoom_link} target="_blank" rel="noopener noreferrer"
              className="font-bold hover:underline break-all" style={{ color: "var(--primary)" }}>{slot.zoom_link}</a>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>予約者</p>
            <p className="font-bold" style={{ color: "var(--text)" }}>{booking.name}（{booking.room_name}）</p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <Link href="/booking" className="block rounded-full py-3 font-extrabold transition-all hover:scale-105 shadow-md"
          style={{ background: "var(--gradient)", color: "#ffffff" }}>予約枠一覧に戻る</Link>
        <Link href="/booking/my-bookings" className="block text-sm font-bold hover:underline" style={{ color: "var(--primary)" }}>予約一覧を確認する</Link>
      </div>
    </div>
  );
}
