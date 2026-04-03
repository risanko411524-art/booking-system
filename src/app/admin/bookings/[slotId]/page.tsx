import { sheetsClient } from "@/lib/booking/sheets";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SlotBookingsPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;
  const slot = await sheetsClient.getSlotById(slotId);
  const bookings = await sheetsClient.getBookings({ slotId });
  const activeBookings = bookings.filter((b) => b.status === "active");
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div>
      <Link href="/admin/slots" className="text-sm font-bold hover:underline mb-4 inline-block" style={{ color: "var(--primary)" }}>
        ← 枠一覧に戻る
      </Link>

      {slot ? (
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--text)" }}>予約者一覧</h1>
          <p className="font-bold" style={{ color: "var(--text-muted)" }}>
            {(() => { const date = new Date(slot.date + "T00:00:00"); return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`; })()}
            {" "}{slot.start_time}〜{slot.end_time} / {slot.instructor_name}
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
            予約数: <span className="font-extrabold" style={{ color: "var(--primary-dark)" }}>{activeBookings.length}</span>/{slot.max_capacity}
          </p>
        </div>
      ) : (
        <h1 className="text-2xl font-extrabold mb-6" style={{ color: "var(--text)" }}>予約者一覧</h1>
      )}

      {activeBookings.length === 0 ? (
        <p className="font-bold" style={{ color: "var(--text-muted)" }}>予約者はいません</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md" style={{ border: "3px solid var(--border)" }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "var(--bg2)" }} className="text-left">
                <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>#</th>
                <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>名前</th>
                <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>メール</th>
                <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>部屋名</th>
                <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>予約日時</th>
              </tr>
            </thead>
            <tbody>
              {activeBookings.map((booking, i) => (
                <tr key={booking.booking_id} className="hover:bg-[var(--bg)]" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-3 py-3 font-bold">{i + 1}</td>
                  <td className="px-3 py-3 font-bold">{booking.name}</td>
                  <td className="px-3 py-3">{booking.email}</td>
                  <td className="px-3 py-3">{booking.room_name}</td>
                  <td className="px-3 py-3">{new Date(booking.booked_at).toLocaleString("ja-JP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {bookings.filter((b) => b.status === "cancelled").length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-extrabold mb-3" style={{ color: "var(--text-muted)" }}>キャンセル済</h2>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm" style={{ border: "2px solid #e0e0e0", opacity: 0.6 }}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#f5f5f5" }} className="text-left">
                  <th className="px-3 py-2 font-bold" style={{ borderBottom: "1px solid #e0e0e0" }}>名前</th>
                  <th className="px-3 py-2 font-bold" style={{ borderBottom: "1px solid #e0e0e0" }}>メール</th>
                  <th className="px-3 py-2 font-bold" style={{ borderBottom: "1px solid #e0e0e0" }}>キャンセル日時</th>
                </tr>
              </thead>
              <tbody>
                {bookings.filter((b) => b.status === "cancelled").map((booking) => (
                  <tr key={booking.booking_id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                    <td className="px-3 py-2">{booking.name}</td>
                    <td className="px-3 py-2">{booking.email}</td>
                    <td className="px-3 py-2">{booking.cancelled_at ? new Date(booking.cancelled_at).toLocaleString("ja-JP") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
