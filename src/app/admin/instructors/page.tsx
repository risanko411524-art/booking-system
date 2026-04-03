"use client";

import { useState, useEffect } from "react";
import type { Instructor } from "@/lib/booking/types";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [name, setName] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editZoomLink, setEditZoomLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchInstructors(); }, []);

  async function fetchInstructors() {
    try { const res = await fetch("/api/instructors"); const d = await res.json(); setInstructors(d.instructors || []); } catch { setInstructors([]); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSubmitting(true);
    try {
      const res = await fetch("/api/instructors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, zoom_link: zoomLink }) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "登録に失敗しました"); return; }
      setName(""); setZoomLink(""); await fetchInstructors();
    } catch { setError("登録に失敗しました"); } finally { setSubmitting(false); }
  }

  async function handleUpdate(instructorId: string) {
    setError("");
    try {
      const res = await fetch(`/api/instructors/${instructorId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: editName, zoom_link: editZoomLink }) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "更新に失敗しました"); return; }
      setEditingId(null); await fetchInstructors();
    } catch { setError("更新に失敗しました"); }
  }

  const inputCls = "rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-3 shadow-sm";
  const inputStyle = { border: "2px solid var(--border)", outlineColor: "var(--primary)" };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">&#128105;&#8205;&#127979;</span>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>講師管理</h1>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md" style={{ border: "3px solid var(--border)" }}>
        <h2 className="font-extrabold mb-3" style={{ color: "var(--text)" }}>新規講師登録</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="講師名"
            className={`${inputCls} flex-1`} style={inputStyle} />
          <input type="url" required value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="ZoomリンクURL"
            className={`${inputCls} flex-[2]`} style={inputStyle} />
          <button type="submit" disabled={submitting}
            className="rounded-full px-5 py-3 font-extrabold disabled:opacity-50 whitespace-nowrap shadow-md"
            style={{ background: "var(--primary)", color: "#ffffff" }}>
            {submitting ? "登録中..." : "登録"}
          </button>
        </form>
      </div>

      {error && <p className="font-bold text-sm mb-4" style={{ color: "#c62828" }}>{error}</p>}

      {instructors.length === 0 ? (
        <p className="font-bold" style={{ color: "var(--text-muted)" }}>講師が登録されていません</p>
      ) : (
        <div className="space-y-2">
          {instructors.map((inst) => (
            <div key={inst.instructor_id} className="bg-white rounded-2xl p-4 shadow-md" style={{ border: "3px solid var(--border)" }}>
              {editingId === inst.instructor_id ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    className={`${inputCls} flex-1`} style={inputStyle} />
                  <input type="url" value={editZoomLink} onChange={(e) => setEditZoomLink(e.target.value)}
                    className={`${inputCls} flex-[2]`} style={inputStyle} />
                  <div className="flex gap-1">
                    <button onClick={() => handleUpdate(inst.instructor_id)}
                      className="rounded-full px-4 py-2 text-sm font-extrabold shadow-md" style={{ background: "var(--primary)", color: "#ffffff" }}>保存</button>
                    <button onClick={() => setEditingId(null)}
                      className="rounded-full px-4 py-2 text-sm font-bold bg-white shadow-sm" style={{ border: "2px solid var(--border)" }}>取消</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold" style={{ color: "var(--text)" }}>{inst.name}</p>
                    <p className="text-sm break-all" style={{ color: "var(--text-muted)" }}>{inst.zoom_link}</p>
                  </div>
                  <button onClick={() => { setEditingId(inst.instructor_id); setEditName(inst.name); setEditZoomLink(inst.zoom_link); }}
                    className="text-sm font-bold hover:underline" style={{ color: "var(--primary)" }}>編集</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
