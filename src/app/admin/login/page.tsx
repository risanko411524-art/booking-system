"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { const data = await res.json(); setError(data.error || "ログインに失敗しました"); return; }
      router.push("/admin");
    } catch { setError("ログインに失敗しました"); } finally { setLoading(false); }
  }

  return (
    <div className="min-h-full flex items-center justify-center" style={{ background: "var(--gradient-soft)" }}>
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg" style={{ border: "3px solid var(--border)" }}>
        <h1 className="text-2xl font-extrabold text-center mb-8" style={{ color: "var(--text)" }}>管理者ログイン</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>パスワード</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-3 shadow-sm"
              style={{ border: "2px solid var(--border)", outlineColor: "var(--primary)" }} />
          </div>
          {error && <p className="font-bold text-sm" style={{ color: "#c62828" }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full py-3 font-extrabold disabled:opacity-50 transition-all hover:scale-105 shadow-lg"
            style={{ background: "var(--gradient)", color: "#ffffff" }}>
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
