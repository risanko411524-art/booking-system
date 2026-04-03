import Link from "next/link";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <header className="shadow-md" style={{ background: "var(--primary-dark)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/booking" className="text-xl font-extrabold" style={{ color: "#ffffff" }}>
            グループコンサル予約
          </Link>
          <Link
            href="/booking/my-bookings"
            className="text-sm font-bold rounded-full px-4 py-1.5"
            style={{ background: "var(--accent)", color: "var(--text)" }}
          >
            予約確認
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
