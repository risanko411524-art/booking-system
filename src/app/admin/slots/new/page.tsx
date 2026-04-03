"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Instructor } from "@/lib/booking/types";

export default function NewSlotPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [period, setPeriod] = useState<"week2" | "week4">("week2");
  const [maxCapacity, setMaxCapacity] = useState(12);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/instructors").then((r) => r.json()).then((d) => setInstructors(d.instructors || [])).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const instructor = instructors.find((i) => i.instructor_id === selectedInstructorId);
    if (!instructor) { setError("講師を選択してください"); setSubmitting(false); return; }
    try {
      const res = await fetch("/api/slots", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, start_time: startTime, end_time: endTime, instructor_name: instructor.name, zoom_link: instructor.zoom_link, period, max_capacity: maxCapacity }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "作成に失敗しました"); return; }
      router.push("/admin/slots");
    } catch { setError("作成に失敗しました"); } finally { setSubmitting(false); }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-3 shadow-sm";
  const inputStyle = { border: "2px solid var(--border)", outlineColor: "var(--primary)" };

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">&#10133;</span>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>新規枠作成</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>日付</label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>開始時刻</label>
            <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>終了時刻</label>
            <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>期</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value as "week2" | "week4")} className={inputCls} style={inputStyle}>
            <option value="week2">第2週</option>
            <option value="week4">第4週</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>担当講師</label>
          {instructors.length === 0 ? (
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>
              先に講師を登録してください。<a href="/admin/instructors" className="hover:underline" style={{ color: "var(--primary)" }}>講師管理へ</a>
            </p>
          ) : (
            <select required value={selectedInstructorId} onChange={(e) => setSelectedInstructorId(e.target.value)} className={inputCls} style={inputStyle}>
              <option value="">選択してください</option>
              {instructors.map((inst) => (<option key={inst.instructor_id} value={inst.instructor_id}>{inst.name}</option>))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>定員</label>
          <input type="number" min={1} max={100} value={maxCapacity} onChange={(e) => setMaxCapacity(parseInt(e.target.value, 10))} className={inputCls} style={inputStyle} />
        </div>
        {error && <p className="font-bold text-sm" style={{ color: "#c62828" }}>{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={submitting}
            className="rounded-full px-6 py-3 font-extrabold disabled:opacity-50 transition-all hover:scale-105 shadow-md"
            style={{ background: "var(--gradient)", color: "#ffffff" }}>
            {submitting ? "作成中..." : "作成"}
          </button>
          <button type="button" onClick={() => router.push("/admin/slots")}
            className="rounded-full px-6 py-3 font-bold bg-white shadow-sm hover:shadow-md transition-all"
            style={{ border: "2px solid var(--border)", color: "var(--text)" }}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
