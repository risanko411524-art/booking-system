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
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          枠が見つかりません
        </h2>
        <Link href="/booking" className="text-blue-600 hover:underline">
          予約枠一覧に戻る
        </Link>
      </div>
    );
  }

  const isFull = slot.current_count >= slot.max_capacity;
  const isPast = new Date(`${slot.date}T${slot.start_time}:00`) <= new Date();

  if (isFull || isPast) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isPast ? "この枠は既に終了しています" : "この枠は満席です"}
        </h2>
        <Link href="/booking" className="text-blue-600 hover:underline">
          予約枠一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">予約フォーム</h2>
      <BookingForm slot={slot} />
    </div>
  );
}
