import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">&#128736;&#65039;</div>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>管理者ダッシュボード</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/slots"
          className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all hover:scale-105"
          style={{ border: "3px solid var(--border)" }}>
          <div className="text-4xl mb-3">&#128197;</div>
          <h2 className="text-lg font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>枠管理</h2>
          <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>予約枠の作成・編集・削除</p>
        </Link>
        <Link href="/admin/instructors"
          className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all hover:scale-105"
          style={{ border: "3px solid var(--border)" }}>
          <div className="text-4xl mb-3">&#128105;&#8205;&#127979;</div>
          <h2 className="text-lg font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>講師管理</h2>
          <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>講師の登録・編集</p>
        </Link>
        <Link href="/booking"
          className="rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all hover:scale-105"
          style={{ border: "3px solid var(--border)" }}>
          <div className="text-4xl mb-3">&#127760;</div>
          <h2 className="text-lg font-extrabold mb-2" style={{ color: "var(--primary-dark)" }}>予約サイト</h2>
          <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>ユーザー向け予約ページを確認</p>
        </Link>
      </div>
    </div>
  );
}
