"use client";

import { useState } from "react";
import Link from "next/link";
import type { Slot } from "@/lib/booking/types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
}

export default function SlotAdminList({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState(initialSlots);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(slotId: string) {
    if (!confirm("この枠を削除しますか？関連する予約も無効になります。")) return;
    setDeletingId(slotId);
    try {
      const res = await fetch(`/api/slots/${slotId}`, { method: "DELETE" });
      if (res.ok) setSlots((prev) => prev.filter((s) => s.slot_id !== slotId));
    } finally { setDeletingId(null); }
  }

  if (slots.length === 0) return <p className="font-bold" style={{ color: "var(--text-muted)" }}>枠がまだありません</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md" style={{ border: "3px solid var(--border)" }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: "var(--bg2)" }} className="text-left">
            <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>日付</th>
            <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>時間</th>
            <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>期</th>
            <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>講師</th>
            <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>予約数</th>
            <th className="px-3 py-3 font-extrabold" style={{ color: "var(--text)", borderBottom: "2px solid var(--border)" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.slot_id} className="hover:bg-[var(--bg)]" style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="px-3 py-3 font-bold">{formatDate(slot.date)}</td>
              <td className="px-3 py-3">{slot.start_time}〜{slot.end_time}</td>
              <td className="px-3 py-3">
                <span className="text-xs font-extrabold px-2 py-1 rounded-full" style={{ background: "var(--primary)", color: "#ffffff" }}>
                  {slot.period === "week2" ? "第2週" : "第4週"}
                </span>
              </td>
              <td className="px-3 py-3 font-bold">{slot.instructor_name}</td>
              <td className="px-3 py-3">
                <span className="font-extrabold" style={{ color: "var(--primary-dark)" }}>{slot.current_count}</span>/{slot.max_capacity}
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <Link href={`/admin/bookings/${slot.slot_id}`} className="font-bold hover:underline" style={{ color: "var(--primary)" }}>予約者</Link>
                  <Link href={`/admin/slots/${slot.slot_id}/edit`} className="font-bold hover:underline" style={{ color: "var(--primary)" }}>編集</Link>
                  <button onClick={() => handleDelete(slot.slot_id)} disabled={deletingId === slot.slot_id}
                    className="font-bold hover:underline disabled:opacity-50" style={{ color: "#c62828" }}>削除</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
