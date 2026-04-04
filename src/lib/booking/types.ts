export interface Slot {
  slot_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  instructor_name: string;
  zoom_link: string;
  zoom_id: string;
  zoom_passcode: string;
  year_month: string; // YYYY-MM
  period: "week2" | "week4";
  max_capacity: number;
  current_count: number;
}

export interface Booking {
  booking_id: string;
  slot_id: string;
  email: string;
  name: string;
  room_name: string;
  status: "active" | "cancelled";
  booked_at: string; // ISO8601
  cancelled_at: string; // ISO8601 or empty
}

export interface Instructor {
  instructor_id: string;
  name: string;
  zoom_link: string;
  zoom_id: string;
  zoom_passcode: string;
}

export interface BookingFormData {
  slot_id: string;
  email: string;
  name: string;
  room_name: string;
}

export interface SlotFormData {
  date: string;
  start_time: string;
  end_time: string;
  instructor_name: string;
  zoom_link: string;
  period: "week2" | "week4";
  max_capacity?: number;
}
