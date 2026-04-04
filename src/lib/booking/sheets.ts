import type { Slot, Booking, Instructor } from "./types";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

class KintoneBookingClient {
  private getBaseUrl(): string {
    const url = process.env.KINTONE_BASE_URL;
    if (!url) throw new Error("KINTONE_BASE_URL is not set");
    return url.replace(/\/$/, "");
  }

  private get slotsAppId(): string {
    return process.env.KINTONE_SLOTS_APP_ID || "";
  }
  private get slotsToken(): string {
    return process.env.KINTONE_API_TOKEN_SLOTS || "";
  }
  private get bookingsAppId(): string {
    return process.env.KINTONE_BOOKINGS_APP_ID || "";
  }
  private get bookingsToken(): string {
    return process.env.KINTONE_API_TOKEN_BOOKINGS || "";
  }
  private get instructorsAppId(): string {
    return process.env.KINTONE_INSTRUCTORS_APP_ID || "";
  }
  private get instructorsToken(): string {
    return process.env.KINTONE_API_TOKEN_INSTRUCTORS || "";
  }

  // ── Generic Kintone API ──

  private async fetchRecords(
    appId: string,
    token: string,
    query?: string
  ): Promise<Record<string, { value: string }>[]> {
    const baseUrl = this.getBaseUrl();
    const params = new URLSearchParams({ app: appId });
    if (query) params.set("query", query);

    const res = await fetch(`${baseUrl}/k/v1/records.json?${params.toString()}`, {
      headers: { "X-Cybozu-API-Token": token },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Kintone API error (${res.status}): ${body}`);
    }
    const data = await res.json();
    return data.records;
  }

  private async addRecord(
    appId: string,
    token: string,
    fields: Record<string, { value: string | number }>
  ): Promise<{ id: string }> {
    const baseUrl = this.getBaseUrl();
    const res = await fetch(`${baseUrl}/k/v1/record.json`, {
      method: "POST",
      headers: {
        "X-Cybozu-API-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app: appId, record: fields }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Kintone API error (${res.status}): ${body}`);
    }
    return res.json();
  }

  private async updateRecord(
    appId: string,
    token: string,
    recordId: string,
    fields: Record<string, { value: string | number }>
  ): Promise<void> {
    const baseUrl = this.getBaseUrl();
    const res = await fetch(`${baseUrl}/k/v1/record.json`, {
      method: "PUT",
      headers: {
        "X-Cybozu-API-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app: appId, id: recordId, record: fields }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Kintone API error (${res.status}): ${body}`);
    }
  }

  private async deleteRecord(
    appId: string,
    token: string,
    recordId: string
  ): Promise<void> {
    const baseUrl = this.getBaseUrl();
    const res = await fetch(`${baseUrl}/k/v1/records.json`, {
      method: "DELETE",
      headers: {
        "X-Cybozu-API-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app: appId, ids: [recordId] }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Kintone API error (${res.status}): ${body}`);
    }
  }

  // ── Record ID lookup ──

  private async findRecordId(
    appId: string,
    token: string,
    query: string
  ): Promise<string | null> {
    const records = await this.fetchRecords(appId, token, query);
    if (records.length === 0) return null;
    const rec = records[0] as Record<string, { value: string }> & { $id: { value: string } };
    return rec.$id.value;
  }

  // ── Slots ──

  private parseSlot(rec: Record<string, { value: string }>): Slot {
    return {
      slot_id: rec.slot_id?.value || "",
      date: rec.date?.value || "",
      start_time: rec.start_time?.value || "",
      end_time: rec.end_time?.value || "",
      instructor_name: rec.instructor_name?.value || "",
      zoom_link: rec.zoom_link?.value || "",
      zoom_id: rec.zoom_id?.value || "",
      zoom_passcode: rec.zoom_passcode?.value || "",
      year_month: rec.year_month?.value || "",
      period: (rec.period?.value || "week2") as "week2" | "week4",
      max_capacity: parseInt(rec.max_capacity?.value || "12", 10),
      current_count: parseInt(rec.current_count?.value || "0", 10),
    };
  }

  async getSlots(yearMonth?: string): Promise<Slot[]> {
    let query: string | undefined;
    if (yearMonth) {
      query = `year_month = "${yearMonth}" order by date asc, start_time asc`;
    } else {
      query = "order by date asc, start_time asc";
    }
    const records = await this.fetchRecords(this.slotsAppId, this.slotsToken, query);
    return records.map((r) => this.parseSlot(r));
  }

  async getSlotById(slotId: string): Promise<Slot | null> {
    const records = await this.fetchRecords(
      this.slotsAppId,
      this.slotsToken,
      `slot_id = "${slotId}"`
    );
    if (records.length === 0) return null;
    return this.parseSlot(records[0]);
  }

  async addSlot(
    data: Omit<Slot, "slot_id" | "current_count" | "year_month">
  ): Promise<Slot> {
    const slotId = generateId("slot");
    const yearMonth = data.date.slice(0, 7);
    await this.addRecord(this.slotsAppId, this.slotsToken, {
      slot_id: { value: slotId },
      date: { value: data.date },
      start_time: { value: data.start_time },
      end_time: { value: data.end_time },
      instructor_name: { value: data.instructor_name },
      zoom_link: { value: data.zoom_link },
      zoom_id: { value: data.zoom_id || "" },
      zoom_passcode: { value: data.zoom_passcode || "" },
      year_month: { value: yearMonth },
      period: { value: data.period },
      max_capacity: { value: data.max_capacity },
      current_count: { value: 0 },
    });
    return {
      ...data,
      slot_id: slotId,
      zoom_id: data.zoom_id || "",
      zoom_passcode: data.zoom_passcode || "",
      year_month: yearMonth,
      current_count: 0,
    };
  }

  async updateSlot(
    slotId: string,
    data: Partial<Omit<Slot, "slot_id">>
  ): Promise<Slot | null> {
    const recordId = await this.findRecordId(
      this.slotsAppId,
      this.slotsToken,
      `slot_id = "${slotId}"`
    );
    if (!recordId) return null;

    const fields: Record<string, { value: string | number }> = {};
    if (data.date !== undefined) {
      fields.date = { value: data.date };
      fields.year_month = { value: data.date.slice(0, 7) };
    }
    if (data.start_time !== undefined) fields.start_time = { value: data.start_time };
    if (data.end_time !== undefined) fields.end_time = { value: data.end_time };
    if (data.instructor_name !== undefined) fields.instructor_name = { value: data.instructor_name };
    if (data.zoom_link !== undefined) fields.zoom_link = { value: data.zoom_link };
    if (data.zoom_id !== undefined) fields.zoom_id = { value: data.zoom_id };
    if (data.zoom_passcode !== undefined) fields.zoom_passcode = { value: data.zoom_passcode };
    if (data.period !== undefined) fields.period = { value: data.period };
    if (data.max_capacity !== undefined) fields.max_capacity = { value: data.max_capacity };

    await this.updateRecord(this.slotsAppId, this.slotsToken, recordId, fields);
    return this.getSlotById(slotId);
  }

  async deleteSlot(slotId: string): Promise<boolean> {
    const recordId = await this.findRecordId(
      this.slotsAppId,
      this.slotsToken,
      `slot_id = "${slotId}"`
    );
    if (!recordId) return false;
    await this.deleteRecord(this.slotsAppId, this.slotsToken, recordId);
    return true;
  }

  private async updateSlotCount(slotId: string, delta: number): Promise<void> {
    const records = await this.fetchRecords(
      this.slotsAppId,
      this.slotsToken,
      `slot_id = "${slotId}"`
    );
    if (records.length === 0) return;
    const rec = records[0] as Record<string, { value: string }> & { $id: { value: string } };
    const currentCount = parseInt(rec.current_count?.value || "0", 10);
    const newCount = Math.max(0, currentCount + delta);
    await this.updateRecord(this.slotsAppId, this.slotsToken, rec.$id.value, {
      current_count: { value: newCount },
    });
  }

  // ── Bookings ──

  private parseBooking(rec: Record<string, { value: string }>): Booking {
    return {
      booking_id: rec.booking_id?.value || "",
      slot_id: rec.slot_id?.value || "",
      email: rec.email?.value || "",
      name: rec.name?.value || "",
      room_name: rec.room_name?.value || "",
      status: (rec.status?.value || "active") as "active" | "cancelled",
      booked_at: rec.booked_at?.value || "",
      cancelled_at: rec.cancelled_at?.value || "",
    };
  }

  async getBookings(filters?: {
    email?: string;
    slotId?: string;
  }): Promise<Booking[]> {
    const conditions: string[] = [];
    if (filters?.email) conditions.push(`email = "${filters.email}"`);
    if (filters?.slotId) conditions.push(`slot_id = "${filters.slotId}"`);
    const query = conditions.length > 0
      ? `${conditions.join(" and ")} order by booked_at desc`
      : "order by booked_at desc";

    const records = await this.fetchRecords(this.bookingsAppId, this.bookingsToken, query);
    return records.map((r) => this.parseBooking(r));
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const records = await this.fetchRecords(
      this.bookingsAppId,
      this.bookingsToken,
      `booking_id = "${bookingId}"`
    );
    if (records.length === 0) return null;
    return this.parseBooking(records[0]);
  }

  async addBooking(data: {
    slot_id: string;
    email: string;
    name: string;
    room_name: string;
  }): Promise<Booking> {
    const bookingId = generateId("bk");
    const now = new Date().toISOString();
    await this.addRecord(this.bookingsAppId, this.bookingsToken, {
      booking_id: { value: bookingId },
      slot_id: { value: data.slot_id },
      email: { value: data.email },
      name: { value: data.name },
      room_name: { value: data.room_name },
      status: { value: "active" },
      booked_at: { value: now },
      cancelled_at: { value: "" },
    });
    await this.updateSlotCount(data.slot_id, 1);
    return {
      booking_id: bookingId,
      slot_id: data.slot_id,
      email: data.email,
      name: data.name,
      room_name: data.room_name,
      status: "active",
      booked_at: now,
      cancelled_at: "",
    };
  }

  async cancelBooking(bookingId: string): Promise<Booking | null> {
    const records = await this.fetchRecords(
      this.bookingsAppId,
      this.bookingsToken,
      `booking_id = "${bookingId}"`
    );
    if (records.length === 0) return null;
    const rec = records[0] as Record<string, { value: string }> & { $id: { value: string } };
    if (rec.status?.value !== "active") return null;

    const now = new Date().toISOString();
    await this.updateRecord(this.bookingsAppId, this.bookingsToken, rec.$id.value, {
      status: { value: "cancelled" },
      cancelled_at: { value: now },
    });
    await this.updateSlotCount(rec.slot_id?.value, -1);

    return {
      ...this.parseBooking(rec),
      status: "cancelled",
      cancelled_at: now,
    };
  }

  async hasActiveBookingInPeriod(
    email: string,
    yearMonth: string,
    period: "week2" | "week4"
  ): Promise<boolean> {
    const slots = await this.getSlots(yearMonth);
    const periodSlotIds = slots
      .filter((s) => s.period === period)
      .map((s) => s.slot_id);
    if (periodSlotIds.length === 0) return false;

    const bookings = await this.getBookings({ email });
    return bookings.some(
      (b) => b.status === "active" && periodSlotIds.includes(b.slot_id)
    );
  }

  // ── Instructors ──

  private parseInstructor(rec: Record<string, { value: string }>): Instructor {
    return {
      instructor_id: rec.instructor_id?.value || "",
      name: rec.name?.value || "",
      zoom_link: rec.zoom_link?.value || "",
      zoom_id: rec.zoom_id?.value || "",
      zoom_passcode: rec.zoom_passcode?.value || "",
    };
  }

  async getInstructors(): Promise<Instructor[]> {
    const records = await this.fetchRecords(
      this.instructorsAppId,
      this.instructorsToken,
      "order by instructor_id asc"
    );
    return records.map((r) => this.parseInstructor(r));
  }

  async addInstructor(data: {
    name: string;
    zoom_link: string;
    zoom_id?: string;
    zoom_passcode?: string;
  }): Promise<Instructor> {
    const instructorId = generateId("inst");
    await this.addRecord(this.instructorsAppId, this.instructorsToken, {
      instructor_id: { value: instructorId },
      name: { value: data.name },
      zoom_link: { value: data.zoom_link },
      zoom_id: { value: data.zoom_id || "" },
      zoom_passcode: { value: data.zoom_passcode || "" },
    });
    return {
      instructor_id: instructorId,
      name: data.name,
      zoom_link: data.zoom_link,
      zoom_id: data.zoom_id || "",
      zoom_passcode: data.zoom_passcode || "",
    };
  }

  async updateInstructor(
    instructorId: string,
    data: Partial<Omit<Instructor, "instructor_id">>
  ): Promise<Instructor | null> {
    const recordId = await this.findRecordId(
      this.instructorsAppId,
      this.instructorsToken,
      `instructor_id = "${instructorId}"`
    );
    if (!recordId) return null;

    const fields: Record<string, { value: string }> = {};
    if (data.name !== undefined) fields.name = { value: data.name };
    if (data.zoom_link !== undefined) fields.zoom_link = { value: data.zoom_link };
    if (data.zoom_id !== undefined) fields.zoom_id = { value: data.zoom_id };
    if (data.zoom_passcode !== undefined) fields.zoom_passcode = { value: data.zoom_passcode };

    await this.updateRecord(this.instructorsAppId, this.instructorsToken, recordId, fields);

    const records = await this.fetchRecords(
      this.instructorsAppId,
      this.instructorsToken,
      `instructor_id = "${instructorId}"`
    );
    if (records.length === 0) return null;
    return this.parseInstructor(records[0]);
  }
}

export const sheetsClient = new KintoneBookingClient();
