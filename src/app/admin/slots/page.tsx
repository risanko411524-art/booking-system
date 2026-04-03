import { sheetsClient } from "@/lib/booking/sheets";
import Link from "next/link";
import SlotAdminList from "./SlotAdminList";

export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  let slots: Awaited<ReturnType<typeof sheetsClient.getSlots>>;
  try { slots = await sheetsClient.getSlots(); } catch { slots = []; }
  slots.sort((a, b) => b.date.localeCompare(a.date) || b.start_time.localeCompare(a.start_time));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>予約枠管理</h1>
        <Link href="/admin/slots/new"
          className="rounded-full px-5 py-2.5 text-sm font-extrabold shadow-md transition-all hover:scale-105"
          style={{ background: "var(--gradient)", color: "#ffffff" }}>
          新規枠作成
        </Link>
      </div>
      <SlotAdminList initialSlots={slots} />
    </div>
  );
}
