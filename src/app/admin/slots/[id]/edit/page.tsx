"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import type { Slot, Instructor } from "@/lib/booking/types";

export default function EditSlotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [slot, setSlot] = useState<Slot | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const [period, setPeriod] = useState<"week2" | "week4">("week2");
  const [maxCapacity, setMaxCapacity] = useState(12);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/slots`).then((r) => r.json()),
      fetch("/api/instructors").then((r) => r.json()),
    ]).then(([slotsData, instData]) => {
      const allSlots: Slot[] = slotsData.slots || [];
      const found = allSlots.find((s) => s.slot_id === id);
      if (found) {
        setSlot(found);
        setDate(found.date);
        setStartTime(found.start_time);
        setEndTime(found.end_time);
        setPeriod(found.period);
        setMaxCapacity(found.max_capacity);
      }
      const allInst: Instructor[] = instData.instructors || [];
      setInstructors(allInst);
      if (found) {
        const match = allInst.find((i) => i.name === found.instructor_name);
        if (match) setSelectedInstructorId(match.instructor_id);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const instructor = instructors.find(
      (i) => i.instructor_id === selectedInstructorId
    );

    try {
      const res = await fetch(`/api/slots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          start_time: startTime,
          end_time: endTime,
          instructor_name: instructor?.name || slot?.instructor_name,
          zoom_link: instructor?.zoom_link || slot?.zoom_link,
          period,
          max_capacity: maxCapacity,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "更新に失敗しました");
        return;
      }

      router.push("/admin/slots");
    } catch {
      setError("更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">読み込み中...</p>;
  }

  if (!slot) {
    return <p className="text-red-600">枠が見つかりません</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">枠編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">開始時刻</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">終了時刻</label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">期</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "week2" | "week4")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="week2">1回目</option>
            <option value="week4">2回目</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">担当講師</label>
          <select
            value={selectedInstructorId}
            onChange={(e) => setSelectedInstructorId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">変更しない</option>
            {instructors.map((inst) => (
              <option key={inst.instructor_id} value={inst.instructor_id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">定員</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(parseInt(e.target.value, 10))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "更新中..." : "更新"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/slots")}
            className="border border-gray-300 rounded-lg px-6 py-2 hover:bg-gray-100"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
