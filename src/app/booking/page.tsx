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
      <SlotList initialSlots={slots} initialYearMonth={yearMonth} />
    </div>
  );
}
