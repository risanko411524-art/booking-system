import type { Slot, Booking, Instructor } from "./types";

class GASClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.GAS_WEB_APP_URL || "";
  }

  private async get<T>(action: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(this.baseUrl);
    url.searchParams.set("action", action);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) url.searchParams.set(key, value);
      }
    }
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`GAS API error: ${res.status}`);
    return res.json();
  }

  private async post<T>(action: string, body: unknown, params?: Record<string, string>): Promise<T> {
    const url = new URL(this.baseUrl);
    url.searchParams.set("action", action);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) url.searchParams.set(key, value);
      }
    }
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`GAS API error: ${res.status}`);
    return res.json();
  }

  // ── Slots ──

  async getSlots(yearMonth?: string): Promise<Slot[]> {
    const params: Record<string, string> = {};
    if (yearMonth) params.yearMonth = yearMonth;
    const data = await this.get<{ slots: Slot[] }>("getSlots", params);
    return data.slots || [];
  }

  async getSlotById(slotId: string): Promise<Slot | null> {
    const data = await this.get<{ slot: Slot | null }>("getSlotById", { slotId });
    return data.slot || null;
  }

  async addSlot(
    slotData: Omit<Slot, "slot_id" | "current_count" | "year_month">
  ): Promise<Slot> {
    const data = await this.post<{ slot: Slot }>("addSlot", slotData);
    return data.slot;
  }

  async updateSlot(
    slotId: string,
    slotData: Partial<Omit<Slot, "slot_id">>
  ): Promise<Slot | null> {
    const data = await this.post<{ slot?: Slot; error?: string }>(
      "updateSlot",
      slotData,
      { slotId }
    );
    if (data.error) return null;
    return data.slot || null;
  }

  async deleteSlot(slotId: string): Promise<boolean> {
    const data = await this.get<{ success?: boolean; error?: string }>(
      "deleteSlot",
      { slotId }
    );
    return !!data.success;
  }

  // ── Bookings ──

  async getBookings(filters?: {
    email?: string;
    slotId?: string;
  }): Promise<Booking[]> {
    const params: Record<string, string> = {};
    if (filters?.email) params.email = filters.email;
    if (filters?.slotId) params.slotId = filters.slotId;
    const data = await this.get<{ bookings: Booking[] }>("getBookings", params);
    return data.bookings || [];
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const data = await this.get<{ booking: Booking | null }>("getBookingById", {
      bookingId,
    });
    return data.booking || null;
  }

  async addBooking(bookingData: {
    slot_id: string;
    email: string;
    name: string;
    room_name: string;
  }): Promise<Booking> {
    const data = await this.post<{ booking: Booking }>("addBooking", bookingData);
    return data.booking;
  }

  async cancelBooking(bookingId: string): Promise<Booking | null> {
    const data = await this.get<{ booking?: Booking; error?: string }>(
      "cancelBooking",
      { bookingId }
    );
    if (data.error) return null;
    return data.booking || null;
  }

  async hasActiveBookingInPeriod(
    email: string,
    yearMonth: string,
    period: "week2" | "week4"
  ): Promise<boolean> {
    const data = await this.get<{ hasBooking: boolean }>(
      "hasActiveBookingInPeriod",
      { email, yearMonth, period }
    );
    return data.hasBooking;
  }

  // ── Instructors ──

  async getInstructors(): Promise<Instructor[]> {
    const data = await this.get<{ instructors: Instructor[] }>("getInstructors");
    return data.instructors || [];
  }

  async addInstructor(instructorData: {
    name: string;
    zoom_link: string;
  }): Promise<Instructor> {
    const data = await this.post<{ instructor: Instructor }>(
      "addInstructor",
      instructorData
    );
    return data.instructor;
  }

  async updateInstructor(
    instructorId: string,
    instructorData: Partial<Omit<Instructor, "instructor_id">>
  ): Promise<Instructor | null> {
    const data = await this.post<{ instructor?: Instructor; error?: string }>(
      "updateInstructor",
      instructorData,
      { instructorId }
    );
    if (data.error) return null;
    return data.instructor || null;
  }
}

export const sheetsClient = new GASClient();
