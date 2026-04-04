import { sheetsClient } from "@/lib/booking/sheets";
import SlotList from "@/components/booking/SlotList";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let slots: Awaited<ReturnType<typeof sheetsClient.getSlots>>;
  try {
    slots = await sheetsClient.getSlots(yearMonth);
  } catch {
    slots = [];
  }

  return (
    <div>
      {/* ヘッダーイラスト */}
      <div className="text-center mb-8 rounded-2xl p-6 shadow-sm" style={{ background: "var(--bg2)", border: "2px solid var(--border)" }}>
        <div className="text-5xl mb-3">&#128197;&#128101;&#9989;</div>
        <h2 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>予約枠を選んで参加しよう！</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>1回目・2回目からそれぞれ1枠ずつ予約できます</p>
      </div>
      <SlotList initialSlots={slots} initialYearMonth={yearMonth} />
    </div>
  );
}
