const CONFIG_SHEET_NAME = 'CalendarConfig'
const CONFIG_SPREADSHEET_ID_PROPERTY = 'CALENDAR_CONFIG_SPREADSHEET_ID'
const BOOKING_WINDOW_DAYS = 30
const SLOT_START_INTERVAL_MINUTES = 30
const BOOKING_DURATIONS_MINUTES = [30, 60]
const BOOKING_BUFFER_MINUTES = 15

// Times are generated in the Apps Script project's timezone.
const WEEKLY_TEMPLATE = {
  1: { start: '12:00', end: '17:00' },
  2: { start: '11:00', end: '19:00' },
  3: { start: '11:00', end: '19:00' },
  4: { start: '11:00', end: '19:00' },
  5: { start: '09:00', end: '16:00' },
  6: { start: '08:00', end: '13:00' },
}

// Run this once from the spreadsheet-bound Apps Script editor before deploying.
function initializeCalendarConfig() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (!spreadsheet) {
    throw new Error('Open this Apps Script project from the CalendarConfig spreadsheet before initializing it.')
  }

  const configSheet = getConfigSheet_(spreadsheet)
  if (!configSheet) {
    throw new Error(`Add a tab named ${CONFIG_SHEET_NAME}, or name the spreadsheet ${CONFIG_SHEET_NAME}.`)
  }

  PropertiesService.getScriptProperties()
    .setProperty(CONFIG_SPREADSHEET_ID_PROPERTY, spreadsheet.getId())
  return `Calendar configuration saved from ${spreadsheet.getName()}.`
}

function doGet(event) {
  const callback = event && event.parameter ? event.parameter.callback : ''
  let payload

  try {
    payload = {
      success: true,
      timeZone: Session.getScriptTimeZone(),
      slots: getAvailableSlots_(),
    }
  } catch (error) {
    console.error(error)
    payload = {
      success: false,
      message: 'Availability is temporarily unavailable.',
    }
  }

  const json = JSON.stringify(payload)
  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT)
  }

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON)
}

function getAvailableSlots_() {
  const timeZone = Session.getScriptTimeZone()
  const rangeStart = new Date()
  rangeStart.setHours(0, 0, 0, 0)
  const rangeEnd = new Date(rangeStart)
  rangeEnd.setDate(rangeEnd.getDate() + BOOKING_WINDOW_DAYS)
  rangeEnd.setHours(23, 59, 59, 999)

  const calendarIds = getCalendarIdsFromConfigSheet_()
  if (calendarIds.length === 0) {
    throw new Error('CalendarConfig contains no calendar IDs.')
  }

  const busyIntervals = []
  calendarIds.forEach((calendarId) => {
    const calendar = CalendarApp.getCalendarById(calendarId)
    if (!calendar) {
      throw new Error(`Unable to access configured calendar: ${calendarId}`)
    }
    calendar.getEvents(rangeStart, rangeEnd).forEach((event) => {
      const eventEnd = event.getEndTime()
      const eventStart = event.getStartTime()
      const bufferedStart = new Date(eventStart.getTime() - BOOKING_BUFFER_MINUTES * 60 * 1000)
      const bufferedEnd = new Date(eventEnd.getTime() + BOOKING_BUFFER_MINUTES * 60 * 1000)

      busyIntervals.push({ start: bufferedStart, end: bufferedEnd })
    })
  })

  return generateSlotsFromTemplate_(rangeStart, rangeEnd)
    .map((slot) => ({
      date: Utilities.formatDate(slot.start, timeZone, 'yyyy-MM-dd'),
      time: Utilities.formatDate(slot.start, timeZone, 'HH:mm'),
      durations: slot.durations.filter((duration) => {
        const slotEnd = new Date(slot.start.getTime() + duration * 60 * 1000)
        return !busyIntervals.some((busy) => slot.start < busy.end && slotEnd > busy.start)
      }),
    }))
    .filter((slot) => slot.durations.length > 0)
}

function generateSlotsFromTemplate_(rangeStart, rangeEnd) {
  const slots = []
  const cursor = new Date(rangeStart)
  cursor.setHours(0, 0, 0, 0)

  while (cursor <= rangeEnd) {
    const hours = WEEKLY_TEMPLATE[cursor.getDay()]
    if (hours) {
      const [startHour, startMinute] = hours.start.split(':').map(Number)
      const [endHour, endMinute] = hours.end.split(':').map(Number)
      const dayEnd = new Date(cursor)
      dayEnd.setHours(endHour, endMinute, 0, 0)
      let slotStart = new Date(cursor)
      slotStart.setHours(startHour, startMinute, 0, 0)

      while (slotStart < dayEnd) {
        const durations = BOOKING_DURATIONS_MINUTES.filter((duration) =>
          slotStart.getTime() + duration * 60 * 1000 <= dayEnd.getTime()
        )
        if (durations.length > 0) slots.push({ start: new Date(slotStart), durations })
        slotStart = new Date(slotStart.getTime() + SLOT_START_INTERVAL_MINUTES * 60 * 1000)
      }
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return slots
}

function getCalendarIdsFromConfigSheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty(CONFIG_SPREADSHEET_ID_PROPERTY)
  if (!spreadsheetId) {
    throw new Error('Run initializeCalendarConfig() from the bound spreadsheet before deploying the web app.')
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  const sheet = getConfigSheet_(spreadsheet)
  if (!sheet) throw new Error(`Missing tab: ${CONFIG_SHEET_NAME}`)

  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []

  return sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues()
    .flat()
    .map((calendarId) => calendarId.trim())
    .filter(Boolean)
}

function getConfigSheet_(spreadsheet) {
  const namedTab = spreadsheet.getSheetByName(CONFIG_SHEET_NAME)
  if (namedTab) return namedTab
  if (spreadsheet.getName() === CONFIG_SHEET_NAME) return spreadsheet.getSheets()[0] ?? null
  return null
}