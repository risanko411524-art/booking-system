"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Slot } from "@/lib/booking/types";

export default function BookingForm({ slot }: { slot: Slot }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slot.slot_id, email, name, room_name: roomName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "予約に失敗しました"); setSubmitting(false); return; }
      window.location.href = `/booking/complete/${data.booking.booking_id}`;
    } catch { setError("予約に失敗しました。もう一度お試しください。"); setSubmitting(false); }
  }

  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const date = new Date(slot.date + "T00:00:00");
  const inputCls = "w-full rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-3 shadow-sm";

  return (
    <div>
      <div className="rounded-2xl p-5 mb-6 shadow-md" style={{ background: "var(--bg2)", border: "3px solid var(--border)" }}>
        <h3 className="font-extrabold mb-2" style={{ color: "var(--text)" }}>予約枠の詳細</h3>
        <p className="font-bold text-lg" style={{ color: "var(--text)" }}>
          {date.getMonth() + 1}/{date.getDate()}({days[date.getDay()]}) {slot.start_time} 〜 {slot.end_time}
        </p>
        <p style={{ color: "var(--text)" }}>担当講師: <span className="font-extrabold">{slot.instructor_name}</span></p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>残席: {slot.max_capacity - slot.current_count}/{slot.max_capacity}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>メールアドレス</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls} style={{ border: "2px solid var(--border)", outlineColor: "var(--primary)" }} placeholder="example@email.com" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>名前</label>
          <input id="name" type="text" required maxLength={50} value={name} onChange={(e) => setName(e.target.value)}
            className={inputCls} style={{ border: "2px solid var(--border)", outlineColor: "var(--primary)" }} placeholder="山田 太郎" />
        </div>
        <div>
          <label htmlFor="roomName" className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>部屋名（所属グループ）</label>
          <input id="roomName" type="text" required maxLength={50} value={roomName} onChange={(e) => setRoomName(e.target.value)}
            className={inputCls} style={{ border: "2px solid var(--border)", outlineColor: "var(--primary)" }} placeholder="グループA" />
        </div>

        {error && (
          <div className="rounded-xl p-3 text-sm font-bold" style={{ background: "#ffcdd2", border: "2px solid #ef9a9a", color: "#c62828" }}>{error}</div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full rounded-full py-4 font-extrabold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg"
          style={{ background: "var(--gradient)", color: "#ffffff" }}>
          {submitting ? "予約中..." : "予約を確定する"}
        </button>
      </form>
    </div>
  );
}
