"use client";

import { useState } from "react";
import Link from "next/link";
import type { Slot } from "@/lib/booking/types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
}

export default function SlotList({
  initialSlots,
  initialYearMonth,
}: {
  initialSlots: Slot[];
  initialYearMonth: string;
}) {
  const [yearMonth, setYearMonth] = useState(initialYearMonth);
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [loading, setLoading] = useState(false);

  async function changeMonth(ym: string) {
    setYearMonth(ym);
    setLoading(true);
    try {
      const res = await fetch(`/api/slots?yearMonth=${ym}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    const [y, m] = yearMonth.split("-").map(Number);
    const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
    changeMonth(prev);
  }

  function nextMonth() {
    const [y, m] = yearMonth.split("-").map(Number);
    const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
    changeMonth(next);
  }

  const [year, month] = yearMonth.split("-").map(Number);

  const week2Slots = slots.filter((s) => s.period === "week2").sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
  const week4Slots = slots.filter((s) => s.period === "week4").sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-8">
        <button onClick={prevMonth} className="px-3 py-1.5 rounded-full font-bold hover:shadow-md transition-all" style={{ background: "var(--bg2)", color: "var(--primary-dark)" }}>
          ← 前月
        </button>
        <h2 className="text-2xl font-extrabold px-6 py-2 rounded-full shadow-sm" style={{ background: "var(--accent)", color: "var(--text)" }}>
          {year}年{month}月
        </h2>
        <button onClick={nextMonth} className="px-3 py-1.5 rounded-full font-bold hover:shadow-md transition-all" style={{ background: "var(--bg2)", color: "var(--primary-dark)" }}>
          翌月 →
        </button>
      </div>

      {loading ? (
        <p className="text-center font-bold" style={{ color: "var(--text-muted)" }}>読み込み中...</p>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white shadow-sm" style={{ border: "3px dashed var(--border)" }}>
          <p className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>この月の予約枠はまだありません</p>
        </div>
      ) : (
        <div className="space-y-8">
          {[
            { label: "1回目", slots: week2Slots },
            { label: "2回目", slots: week4Slots },
          ].map(
            ({ label, slots: periodSlots }) =>
              periodSlots.length > 0 && (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-extrabold px-4 py-1.5 rounded-full shadow-sm" style={{ background: "var(--primary)", color: "#ffffff" }}>
                      {label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>1人1回まで予約可能</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {periodSlots.map((slot) => {
                      const isFull = slot.current_count >= slot.max_capacity;
                      const isPast = new Date(`${slot.date}T${slot.start_time}:00`) <= new Date();
                      const remaining = slot.max_capacity - slot.current_count;

                      return (
                        <div
                          key={slot.slot_id}
                          className="rounded-2xl p-5 bg-white shadow-md hover:shadow-lg transition-all"
                          style={{
                            border: isFull || isPast ? "2px solid #e0e0e0" : "3px solid var(--border)",
                            opacity: isFull || isPast ? 0.55 : 1,
                          }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-extrabold text-xl" style={{ color: "var(--text)" }}>
                                {formatDate(slot.date)}
                              </p>
                              <p className="font-bold" style={{ color: "var(--text-muted)" }}>
                                {slot.start_time} 〜 {slot.end_time}
                              </p>
                            </div>
                            <span
                              className="text-sm font-extrabold px-3 py-1 rounded-full"
                              style={{
                                background: isFull ? "#ffcdd2" : isPast ? "#e0e0e0" : "var(--accent-light)",
                                color: isFull ? "#c62828" : isPast ? "#9e9e9e" : "#F57F17",
                              }}
                            >
                              {isPast ? "終了" : isFull ? "満席" : `残${remaining}席`}
                            </span>
                          </div>
                          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                            担当: <span className="font-extrabold" style={{ color: "var(--text)" }}>{slot.instructor_name}</span>
                          </p>
                          {!isFull && !isPast ? (
                            <Link
                              href={`/booking/${slot.slot_id}`}
                              className="block text-center font-extrabold rounded-full py-3 transition-all hover:scale-105 shadow-md"
                              style={{ background: "var(--gradient)", color: "#ffffff" }}
                            >
                              予約する
                            </Link>
                          ) : (
                            <button disabled className="block w-full text-center font-bold rounded-full py-3 cursor-not-allowed" style={{ background: "#eeeeee", color: "#bdbdbd" }}>
                              {isPast ? "終了" : "満席"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
