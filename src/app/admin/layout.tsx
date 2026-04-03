import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <header className="shadow-lg" style={{ background: "linear-gradient(135deg, #2E7D32, #4CAF50)", color: "#ffffff" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/admin" className="font-extrabold text-lg" style={{ color: "#ffffff" }}>管理者</Link>
          <nav className="flex gap-4 text-sm font-bold">
            <Link href="/admin/slots" className="hover:opacity-80" style={{ color: "#ffffff" }}>枠管理</Link>
            <Link href="/admin/instructors" className="hover:opacity-80" style={{ color: "#ffffff" }}>講師管理</Link>
          </nav>
          <Link href="/" className="ml-auto text-sm opacity-70 hover:opacity-100" style={{ color: "#ffffff" }}>サイトに戻る</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
