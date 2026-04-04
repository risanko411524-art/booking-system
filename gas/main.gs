// =============================================
// グループコンサル予約システム - GAS Web API
// =============================================
// スプレッドシートの「拡張機能 > Apps Script」に
// このコードを貼り付けてWebアプリとしてデプロイする
// =============================================

var SHEET_SLOTS = 'slots';
var SHEET_BOOKINGS = 'bookings';
var SHEET_INSTRUCTORS = 'instructors';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var action = e.parameter.action;
  var result;

  try {
    switch (action) {
      case 'getSlots':
        result = getSlots(e.parameter.yearMonth);
        break;
      case 'getSlotById':
        result = getSlotById(e.parameter.slotId);
        break;
      case 'addSlot':
        result = addSlot(JSON.parse(e.postData.contents));
        break;
      case 'updateSlot':
        result = updateSlot(e.parameter.slotId, JSON.parse(e.postData.contents));
        break;
      case 'deleteSlot':
        result = deleteSlot(e.parameter.slotId);
        break;
      case 'getBookings':
        result = getBookings(e.parameter.email, e.parameter.slotId);
        break;
      case 'getBookingById':
        result = getBookingById(e.parameter.bookingId);
        break;
      case 'addBooking':
        result = addBooking(JSON.parse(e.postData.contents));
        break;
      case 'cancelBooking':
        result = cancelBooking(e.parameter.bookingId);
        break;
      case 'hasActiveBookingInPeriod':
        result = hasActiveBookingInPeriod(
          e.parameter.email,
          e.parameter.yearMonth,
          e.parameter.period
        );
        break;
      case 'getInstructors':
        result = getInstructors();
        break;
      case 'addInstructor':
        result = addInstructor(JSON.parse(e.postData.contents));
        break;
      case 'updateInstructor':
        result = updateInstructor(e.parameter.instructorId, JSON.parse(e.postData.contents));
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateId(prefix) {
  return prefix + '-' + new Date().getTime().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Helper ──

function getSheetRows(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
}

function isDateObj(val) {
  return val && typeof val.getFullYear === 'function';
}

function toDateStr(val) {
  if (isDateObj(val)) {
    var y = val.getFullYear();
    var m = ('0' + (val.getMonth() + 1)).slice(-2);
    var d = ('0' + val.getDate()).slice(-2);
    return y + '-' + m + '-' + d;
  }
  return String(val);
}

function toTimeStr(val) {
  if (isDateObj(val)) {
    var h = ('0' + val.getHours()).slice(-2);
    var m = ('0' + val.getMinutes()).slice(-2);
    return h + ':' + m;
  }
  return String(val);
}

function toYearMonthStr(val) {
  if (isDateObj(val)) {
    var y = val.getFullYear();
    var m = ('0' + (val.getMonth() + 1)).slice(-2);
    return y + '-' + m;
  }
  return String(val);
}

// ── Slots ──

function parseSlotRow(row) {
  return {
    slot_id: String(row[0]),
    date: toDateStr(row[1]),
    start_time: toTimeStr(row[2]),
    end_time: toTimeStr(row[3]),
    instructor_name: String(row[4]),
    zoom_link: String(row[5]),
    zoom_id: String(row[6] || ''),
    zoom_passcode: String(row[7] || ''),
    year_month: toYearMonthStr(row[8]),
    period: String(row[9]),
    max_capacity: Number(row[10]),
    current_count: Number(row[11])
  };
}

function getSlots(yearMonth) {
  var rows = getSheetRows(SHEET_SLOTS);
  var slots = rows.map(parseSlotRow);

  if (yearMonth) {
    slots = slots.filter(function(s) { return s.year_month === yearMonth; });
  }

  return { slots: slots };
}

function getSlotById(slotId) {
  var rows = getSheetRows(SHEET_SLOTS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === slotId) {
      return { slot: parseSlotRow(rows[i]) };
    }
  }
  return { slot: null };
}

function addSlot(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SLOTS);
  var slotId = generateId('slot');
  var yearMonth = data.date.slice(0, 7);
  var maxCapacity = data.max_capacity || 12;

  // 書式を書式なしテキストに設定してから値を入れる
  var lastRow = sheet.getLastRow() + 1;
  var range = sheet.getRange(lastRow, 1, 1, 12);
  range.setNumberFormat('@'); // テキスト形式
  range.setValues([[
    slotId,
    data.date,
    data.start_time,
    data.end_time,
    data.instructor_name,
    data.zoom_link,
    data.zoom_id || '',
    data.zoom_passcode || '',
    yearMonth,
    data.period,
    String(maxCapacity),
    '0'
  ]]);

  return {
    slot: {
      slot_id: slotId,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      instructor_name: data.instructor_name,
      zoom_link: data.zoom_link,
      zoom_id: data.zoom_id || '',
      zoom_passcode: data.zoom_passcode || '',
      year_month: yearMonth,
      period: data.period,
      max_capacity: maxCapacity,
      current_count: 0
    }
  };
}

function updateSlot(slotId, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SLOTS);
  var rows = getSheetRows(SHEET_SLOTS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === slotId) {
      var row = i + 2; // +2: ヘッダー行+0始まり
      if (data.date !== undefined) { sheet.getRange(row, 2).setNumberFormat('@').setValue(data.date); }
      if (data.start_time !== undefined) { sheet.getRange(row, 3).setNumberFormat('@').setValue(data.start_time); }
      if (data.end_time !== undefined) { sheet.getRange(row, 4).setNumberFormat('@').setValue(data.end_time); }
      if (data.instructor_name !== undefined) { sheet.getRange(row, 5).setValue(data.instructor_name); }
      if (data.zoom_link !== undefined) { sheet.getRange(row, 6).setValue(data.zoom_link); }
      if (data.zoom_id !== undefined) { sheet.getRange(row, 7).setNumberFormat('@').setValue(data.zoom_id); }
      if (data.zoom_passcode !== undefined) { sheet.getRange(row, 8).setNumberFormat('@').setValue(data.zoom_passcode); }
      if (data.date !== undefined) { sheet.getRange(row, 9).setNumberFormat('@').setValue(data.date.slice(0, 7)); }
      if (data.period !== undefined) { sheet.getRange(row, 10).setValue(data.period); }
      if (data.max_capacity !== undefined) { sheet.getRange(row, 11).setValue(data.max_capacity); }

      var updated = sheet.getRange(row, 1, 1, 12).getDisplayValues()[0];
      return { slot: parseSlotRow(updated) };
    }
  }
  return { error: '枠が見つかりません' };
}

function deleteSlot(slotId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SLOTS);
  var rows = getSheetRows(SHEET_SLOTS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === slotId) {
      sheet.deleteRow(i + 2);
      return { success: true };
    }
  }
  return { error: '枠が見つかりません' };
}

// ── Bookings ──

function parseBookingRow(row) {
  return {
    booking_id: String(row[0]),
    slot_id: String(row[1]),
    email: String(row[2]),
    name: String(row[3]),
    room_name: String(row[4]),
    status: String(row[5]),
    booked_at: String(row[6]),
    cancelled_at: String(row[7] || '')
  };
}

function getBookings(email, slotId) {
  var rows = getSheetRows(SHEET_BOOKINGS);
  var bookings = rows.map(parseBookingRow);

  if (email) {
    bookings = bookings.filter(function(b) { return b.email === email; });
  }
  if (slotId) {
    bookings = bookings.filter(function(b) { return b.slot_id === slotId; });
  }

  return { bookings: bookings };
}

function getBookingById(bookingId) {
  var rows = getSheetRows(SHEET_BOOKINGS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === bookingId) {
      return { booking: parseBookingRow(rows[i]) };
    }
  }
  return { booking: null };
}

function addBooking(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_BOOKINGS);
  var bookingId = generateId('bk');
  var now = new Date().toISOString();

  var lastRow = sheet.getLastRow() + 1;
  var range = sheet.getRange(lastRow, 1, 1, 8);
  range.setNumberFormat('@');
  range.setValues([[
    bookingId,
    data.slot_id,
    data.email,
    data.name,
    data.room_name,
    'active',
    now,
    ''
  ]]);

  updateSlotCount(data.slot_id, 1);

  return {
    booking: {
      booking_id: bookingId,
      slot_id: data.slot_id,
      email: data.email,
      name: data.name,
      room_name: data.room_name,
      status: 'active',
      booked_at: now,
      cancelled_at: ''
    }
  };
}

function cancelBooking(bookingId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_BOOKINGS);
  var rows = getSheetRows(SHEET_BOOKINGS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === bookingId) {
      if (String(rows[i][5]) !== 'active') {
        return { error: 'この予約はすでにキャンセルされています' };
      }
      var row = i + 2;
      var now = new Date().toISOString();
      sheet.getRange(row, 6).setValue('cancelled');
      sheet.getRange(row, 8).setNumberFormat('@').setValue(now);

      updateSlotCount(String(rows[i][1]), -1);

      return {
        booking: {
          booking_id: String(rows[i][0]),
          slot_id: String(rows[i][1]),
          email: String(rows[i][2]),
          name: String(rows[i][3]),
          room_name: String(rows[i][4]),
          status: 'cancelled',
          booked_at: String(rows[i][6]),
          cancelled_at: now
        }
      };
    }
  }
  return { error: '予約が見つかりません' };
}

function hasActiveBookingInPeriod(email, yearMonth, period) {
  var slotsResult = getSlots(yearMonth);
  var periodSlotIds = slotsResult.slots
    .filter(function(s) { return s.period === period; })
    .map(function(s) { return s.slot_id; });

  var bookingsResult = getBookings(email, null);
  var hasBooking = bookingsResult.bookings.some(function(b) {
    return b.status === 'active' && periodSlotIds.indexOf(b.slot_id) !== -1;
  });

  return { hasBooking: hasBooking };
}

// ── Slot count helper ──

function updateSlotCount(slotId, delta) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SLOTS);
  var rows = getSheetRows(SHEET_SLOTS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === slotId) {
      var currentCount = Number(rows[i][11]) + delta;
      if (currentCount < 0) currentCount = 0;
      sheet.getRange(i + 2, 12).setValue(currentCount);
      return;
    }
  }
}

// ── Instructors ──

function getInstructors() {
  var rows = getSheetRows(SHEET_INSTRUCTORS);

  var instructors = rows.map(function(row) {
    return {
      instructor_id: String(row[0]),
      name: String(row[1]),
      zoom_link: String(row[2]),
      zoom_id: String(row[3] || ''),
      zoom_passcode: String(row[4] || '')
    };
  });

  return { instructors: instructors };
}

function addInstructor(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INSTRUCTORS);
  var instructorId = generateId('inst');

  var lastRow = sheet.getLastRow() + 1;
  var range = sheet.getRange(lastRow, 1, 1, 5);
  range.setNumberFormat('@');
  range.setValues([[instructorId, data.name, data.zoom_link, data.zoom_id || '', data.zoom_passcode || '']]);

  return {
    instructor: {
      instructor_id: instructorId,
      name: data.name,
      zoom_link: data.zoom_link,
      zoom_id: data.zoom_id || '',
      zoom_passcode: data.zoom_passcode || ''
    }
  };
}

function updateInstructor(instructorId, data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INSTRUCTORS);
  var rows = getSheetRows(SHEET_INSTRUCTORS);

  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === instructorId) {
      var row = i + 2;
      if (data.name !== undefined) sheet.getRange(row, 2).setValue(data.name);
      if (data.zoom_link !== undefined) sheet.getRange(row, 3).setValue(data.zoom_link);
      if (data.zoom_id !== undefined) sheet.getRange(row, 4).setNumberFormat('@').setValue(data.zoom_id);
      if (data.zoom_passcode !== undefined) sheet.getRange(row, 5).setNumberFormat('@').setValue(data.zoom_passcode);

      var updated = sheet.getRange(row, 1, 1, 5).getDisplayValues()[0];
      return {
        instructor: {
          instructor_id: String(updated[0]),
          name: String(updated[1]),
          zoom_link: String(updated[2]),
          zoom_id: String(updated[3] || ''),
          zoom_passcode: String(updated[4] || '')
        }
      };
    }
  }
  return { error: '講師が見つかりません' };
}

// ── 初期セットアップ ──

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var slots = ss.getSheetByName('slots');
  if (!slots) { slots = ss.insertSheet('slots'); }
  slots.getRange(1, 1, 1, 12).setValues([[
    'slot_id', 'date', 'start_time', 'end_time', 'instructor_name',
    'zoom_link', 'zoom_id', 'zoom_passcode', 'year_month', 'period', 'max_capacity', 'current_count'
  ]]);

  var bookings = ss.getSheetByName('bookings');
  if (!bookings) { bookings = ss.insertSheet('bookings'); }
  bookings.getRange(1, 1, 1, 8).setValues([[
    'booking_id', 'slot_id', 'email', 'name', 'room_name',
    'status', 'booked_at', 'cancelled_at'
  ]]);

  var instructors = ss.getSheetByName('instructors');
  if (!instructors) { instructors = ss.insertSheet('instructors'); }
  instructors.getRange(1, 1, 1, 5).setValues([[
    'instructor_id', 'name', 'zoom_link', 'zoom_id', 'zoom_passcode'
  ]]);
}
