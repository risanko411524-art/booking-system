import { sheetsClient } from "@/lib/booking/sheets";
import BookingForm from "@/components/booking/BookingForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BookingFormPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;
  const slot = await sheetsClient.getSlotById(slotId);

  if (!slot) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">&#128533;</div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: "var(--text)" }}>枠が見つかりません</h2>
        <Link href="/booking" className="font-bold hover:underline" style={{ color: "var(--primary)" }}>予約枠一覧に戻る</Link>
      </div>
    );
  }

  const isFull = slot.current_count >= slot.max_capacity;
  const isPast = new Date(`${slot.date}T${slot.start_time}:00`) <= new Date();

  if (isFull || isPast) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">{isPast ? "&#9203;" : "&#128532;"}</div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: "var(--text)" }}>
          {isPast ? "この枠は既に終了しています" : "この枠は満席です"}
        </h2>
        <Link href="/booking" className="font-bold hover:underline" style={{ color: "var(--primary)" }}>予約枠一覧に戻る</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">&#9997;&#65039;</div>
        <h2 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>予約フォーム</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>以下を入力して予約を確定してください</p>
      </div>
      <BookingForm slot={slot} />
    </div>
  );
}
