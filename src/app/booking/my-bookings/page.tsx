"use client";

import { useState } from "react";
import Link from "next/link";
import type { Booking, Slot } from "@/lib/booking/types";

interface BookingWithSlot extends Booking {
  slot?: Slot;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
}

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<BookingWithSlot[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      const bookingList: Booking[] = data.bookings || [];
      const slotsRes = await fetch("/api/slots");
      const slotsData = await slotsRes.json();
      const allSlots: Slot[] = slotsData.slots || [];
      const enriched: BookingWithSlot[] = bookingList.map((b) => ({
        ...b, slot: allSlots.find((s) => s.slot_id === b.slot_id),
      }));
      enriched.sort((a, b) => {
        if (a.status !== b.status) return a.status === "active" ? -1 : 1;
        return (b.slot?.date || "").localeCompare(a.slot?.date || "");
      });
      setBookings(enriched);
      setSearched(true);
    } catch { setMessage("検索に失敗しました"); } finally { setLoading(false); }
  }

  async function handleCancel(bookingId: string) {
    if (!confirm("この予約をキャンセルしますか？")) return;
    setCancellingId(bookingId);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "キャンセルに失敗しました"); return; }
      setMessage("予約をキャンセルしました");
      setBookings((prev) => prev.map((b) => b.booking_id === bookingId ? { ...b, status: "cancelled" as const, cancelled_at: new Date().toISOString() } : b));
    } catch { setMessage("キャンセルに失敗しました"); } finally { setCancellingId(null); }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">&#128270;&#128203;</div>
        <h2 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>予約確認</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>メールアドレスで予約状況を確認できます</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          className="flex-1 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-3 shadow-sm"
          style={{ border: "2px solid var(--border)", outlineColor: "var(--primary)" }} />
        <button type="submit" disabled={loading}
          className="rounded-full px-5 py-3 font-extrabold disabled:opacity-50 shadow-md"
          style={{ background: "var(--primary)", color: "#ffffff" }}>
          {loading ? "検索中..." : "検索"}
        </button>
      </form>

      {message && (
        <div className="rounded-xl p-3 text-sm font-bold mb-4"
          style={{
            background: message.includes("キャンセルしました") ? "var(--bg2)" : "#ffcdd2",
            border: message.includes("キャンセルしました") ? "2px solid var(--border)" : "2px solid #ef9a9a",
            color: message.includes("キャンセルしました") ? "var(--primary-dark)" : "#c62828",
          }}>
          {message}
        </div>
      )}

      {searched && bookings.length === 0 && (
        <p className="text-center font-bold" style={{ color: "var(--text-muted)" }}>予約が見つかりませんでした</p>
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const slot = booking.slot;
            const canCancel = booking.status === "active" && slot &&
              new Date(`${slot.date}T${slot.start_time}:00`).getTime() - Date.now() > 3 * 60 * 60 * 1000;
            return (
              <div key={booking.booking_id} className="rounded-2xl p-4 bg-white shadow-md"
                style={{ border: "3px solid var(--border)", opacity: booking.status === "cancelled" ? 0.55 : 1 }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    {slot ? (
                      <>
                        <p className="font-extrabold text-lg" style={{ color: "var(--text)" }}>
                          {formatDate(slot.date)} {slot.start_time}〜{slot.end_time}
                        </p>
                        <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>担当: {slot.instructor_name}</p>
                      </>
                    ) : (
                      <p className="font-bold" style={{ color: "var(--text-muted)" }}>枠情報なし</p>
                    )}
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full"
                    style={{
                      background: booking.status === "active" ? "var(--accent-light)" : "#e0e0e0",
                      color: booking.status === "active" ? "#F57F17" : "#9e9e9e",
                    }}>
                    {booking.status === "active" ? "予約済" : "キャンセル済"}
                  </span>
                </div>
                {booking.status === "active" && slot?.zoom_link && (
                  <>
                    <a href={slot.zoom_link} target="_blank" rel="noopener noreferrer"
                      className="block text-center font-extrabold rounded-full py-2.5 mt-3 shadow-md transition-all hover:scale-105"
                      style={{ background: "var(--gradient)", color: "#ffffff" }}>
                      ここから参加する
                    </a>
                    {(slot.zoom_id || slot.zoom_passcode) && (
                      <div className="rounded-xl p-2.5 mt-2 text-sm" style={{ background: "var(--accent-light)", border: "2px solid var(--accent)" }}>
                        {slot.zoom_id && <p className="font-bold" style={{ color: "var(--text)" }}>Zoom ID: <span className="font-extrabold">{slot.zoom_id}</span></p>}
                        {slot.zoom_passcode && <p className="font-bold" style={{ color: "var(--text)" }}>パスコード: <span className="font-extrabold">{slot.zoom_passcode}</span></p>}
                      </div>
                    )}
                  </>
                )}
                {canCancel && (
                  <button onClick={() => handleCancel(booking.booking_id)}
                    disabled={cancellingId === booking.booking_id}
                    className="block w-full text-center font-bold rounded-full py-2 mt-2 disabled:opacity-50 transition-all"
                    style={{ background: "#ffcdd2", color: "#c62828", border: "2px solid #ef9a9a" }}>
                    {cancellingId === booking.booking_id ? "キャンセル中..." : "この予約をキャンセル"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/booking" className="text-sm font-bold hover:underline" style={{ color: "var(--primary)" }}>予約枠一覧に戻る</Link>
      </div>
    </div>
  );
}
