import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { WalkRequest } from '../types'

type AvailabilitySlot = { date: string; time: string; durations?: number[] }
type AvailabilityResponse =
  | { success: true; timeZone: string; slots: AvailabilitySlot[] }
  | { success: false; message: string }

type AvailabilityStatus = 'unconfigured' | 'loading' | 'ready' | 'error'

const availabilityEndpoint = import.meta.env.VITE_AVAILABILITY_ENDPOINT?.trim() ?? ''

function loadAvailability(endpoint: string) {
  return new Promise<Extract<AvailabilityResponse, { success: true }>>((resolve, reject) => {
    const callbackName = `bevosAvailability_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const callbackWindow = window as unknown as Record<string, (response: AvailabilityResponse) => void>
    const script = document.createElement('script')
    const url = new URL(endpoint)
    let timeoutId = 0

    function cleanup() {
      window.clearTimeout(timeoutId)
      delete callbackWindow[callbackName]
      script.remove()
    }

    callbackWindow[callbackName] = (response) => {
      cleanup()
      if (!response.success) {
        reject(new Error(response.message))
        return
      }
      resolve(response)
    }

    script.onerror = () => {
      cleanup()
      reject(new Error('Unable to contact the calendar service.'))
    }
    url.searchParams.set('callback', callbackName)
    script.src = url.toString()
    timeoutId = window.setTimeout(() => {
      cleanup()
      reject(new Error('Calendar service timed out.'))
    }, 15000)
    document.head.append(script)
  })
}

function formatTime(time: string) {
  const [hour, minute] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')}${hour < 12 ? 'am' : 'pm'}`
}

function getDays(weekOffset: number) {
  const start = new Date()
  start.setDate(start.getDate() + weekOffset * 7)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function getDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

function formatWeeklyStartDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(date)
  const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(date)
  const lastTwoDigits = day % 100
  const suffix = lastTwoDigits >= 11 && lastTwoDigits <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th')
  return `Every ${weekday} starting ${monthName} ${day}${suffix}`
}

type AvailabilitySectionProps = {
  onRequest: (request: WalkRequest) => void
}

function AvailabilitySection({ onRequest }: AvailabilitySectionProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({})
  const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({})
  const [repeatWeeklyByDate, setRepeatWeeklyByDate] = useState<Record<string, boolean>>({})
  const [activeDate, setActiveDate] = useState('')
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(availabilityEndpoint ? 'loading' : 'unconfigured')
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, Record<string, number[]>>>({})
  const days = getDays(weekOffset)
  const activeDateSlots = activeDate ? availabilityByDate[activeDate] ?? {} : {}
  const availableTimes = Object.keys(activeDateSlots).sort()
  const activeTime = activeDate ? selectedTimes[activeDate] : undefined
  const availableDurations = activeTime ? activeDateSlots[activeTime] ?? [] : []
  const requestedDays = [...selectedDates].sort().map((dateKey) => ({
    dateLabel: repeatWeeklyByDate[dateKey] ? formatWeeklyStartDate(dateKey) : formatDateKey(dateKey),
    time: selectedTimes[dateKey] ? formatTime(selectedTimes[dateKey]) : '',
    durationMinutes: selectedDurations[dateKey] ?? 0,
    repeatWeekly: repeatWeeklyByDate[dateKey] ?? false,
  }))
  const readyToRequest = requestedDays.length > 0 && requestedDays.every(({ time, durationMinutes }) => time && durationMinutes > 0)
  const requestPrompt = selectedDates.length === 0
    ? 'Choose at least one day'
    : requestedDays.some(({ time }) => !time)
      ? 'Choose a start time for each day'
      : requestedDays.some(({ durationMinutes }) => durationMinutes === 0)
        ? 'Choose a 30 or 60-minute walk for each day'
        : 'Ready to request'

  useEffect(() => {
    if (!availabilityEndpoint) return

    let isCurrent = true
    loadAvailability(availabilityEndpoint)
      .then((response) => {
        if (!isCurrent) return
        const nextAvailability: Record<string, Record<string, number[]>> = {}
        response.slots.forEach(({ date, time, durations }) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return
          const availableDurations = (durations ?? [30]).filter((duration) => duration === 30 || duration === 60)
          if (availableDurations.length === 0) return
          nextAvailability[date] ??= {}
          nextAvailability[date][time] = availableDurations
        })
        setAvailabilityByDate(nextAvailability)
        setAvailabilityStatus('ready')
      })
      .catch(() => {
        if (isCurrent) setAvailabilityStatus('error')
      })

    return () => {
      isCurrent = false
    }
  }, [])

  function selectDate(dateKey: string) {
    if (Object.keys(availabilityByDate[dateKey] ?? {}).length === 0) return
    if (selectedDates.includes(dateKey)) {
      const activeDateHasBooking = Boolean(selectedTimes[activeDate] || selectedDurations[activeDate])
      if (activeDate !== dateKey && selectedDates.includes(activeDate) && !activeDateHasBooking) {
        removeDate(activeDate)
      }
      const hasBookingSelection = Boolean(selectedTimes[dateKey] || selectedDurations[dateKey])
      if (activeDate === dateKey && !hasBookingSelection) {
        removeDate(dateKey)
      } else {
        setActiveDate(dateKey)
      }
      return
    }

    const activeDateHasBooking = Boolean(selectedTimes[activeDate] || selectedDurations[activeDate])
    if (activeDate && selectedDates.includes(activeDate) && !activeDateHasBooking) {
      removeDate(activeDate)
    }
    setSelectedDates((current) => current.includes(dateKey) ? current : [...current, dateKey])
    setActiveDate(dateKey)
  }

  function removeDate(dateKey: string) {
    setSelectedDates((current) => current.filter((selectedDate) => selectedDate !== dateKey))
    setSelectedTimes((current) => {
      const next = { ...current }
      delete next[dateKey]
      return next
    })
    setSelectedDurations((current) => {
      const next = { ...current }
      delete next[dateKey]
      return next
    })
    setRepeatWeeklyByDate((current) => {
      const next = { ...current }
      delete next[dateKey]
      return next
    })
    if (activeDate === dateKey) {
      setActiveDate(selectedDates.find((selectedDate) => selectedDate !== dateKey) ?? '')
    }
  }

  function changeWeek(direction: number) {
    const nextWeek = Math.max(0, weekOffset + direction)
    const visibleDates = getDays(nextWeek).map(getDateKey)
    setWeekOffset(nextWeek)
    setActiveDate(selectedDates.find((dateKey) => visibleDates.includes(dateKey)) ?? '')
  }

  return (
    <section className="availability-section" id="availability" aria-labelledby="availability-title">
      <div className="availability-head">
        <div><p className="eyebrow"><span /> Pick your walk days</p><h2 id="availability-title">Let’s find a <em>good time.</em></h2></div>
        <p>Open times are checked against my connected client calendars.</p>
      </div>
      <div className="booking-panel">
        <div className="calendar-column">
          <div className="calendar-topline">
            <div><CalendarDays size={19} /><span>{availabilityStatus === 'ready' ? 'Live availability' : 'Calendar availability'}</span></div>
            <div className="calendar-controls">
              <button type="button" aria-label="Previous week" onClick={() => changeWeek(-1)} disabled={weekOffset === 0}><ChevronLeft size={18} /></button>
              <button type="button" aria-label="Next week" onClick={() => changeWeek(1)}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="day-picker" role="group" aria-label="Choose one or more days">
            {days.map((day) => {
              const dateKey = getDateKey(day)
              const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(day)
              const hasOpenings = Object.keys(availabilityByDate[dateKey] ?? {}).length > 0
              const unavailable = availabilityStatus === 'ready' && !hasOpenings
              return (
                <button
                  className={`day-button${selectedDates.includes(dateKey) ? ' selected' : ''}${activeDate === dateKey ? ' active' : ''}${selectedDurations[dateKey] ? ' has-time' : ''}`}
                  type="button"
                  key={day.toISOString()}
                  disabled={availabilityStatus !== 'ready' || !hasOpenings}
                  title={unavailable ? 'No openings on this day' : undefined}
                  aria-pressed={selectedDates.includes(dateKey)}
                  aria-label={`${dateLabel}${unavailable ? ', no openings' : ''}${selectedTimes[dateKey] ? `, ${formatTime(selectedTimes[dateKey])}${selectedDurations[dateKey] ? ` for ${selectedDurations[dateKey]} minutes` : ''}` : ''}`}
                  onClick={() => selectDate(dateKey)}
                >
                  <span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(day)}</span><strong>{day.getDate()}</strong><i aria-hidden="true" />
                </button>
              )
            })}
          </div>
          <div className="slot-heading"><h3>Preferred time</h3><span>{activeDate ? `For ${formatDateKey(activeDate)}` : `${selectedDates.length} ${selectedDates.length === 1 ? 'day' : 'days'} selected`}</span></div>
          <div className="time-slots" role="group" aria-label={activeDate ? `Choose a time for ${formatDateKey(activeDate)}` : 'Choose a date to assign a time'}>
            {availableTimes.length > 0
              ? availableTimes.map((time) => {
                const durations = activeDateSlots[time] ?? []
                const thirtyOnly = durations.length === 1 && durations[0] === 30
                return <button type="button" key={time} className={`time-slot${selectedTimes[activeDate] === time ? ' selected' : ''}`} aria-pressed={selectedTimes[activeDate] === time} aria-label={`${formatTime(time)}${thirtyOnly ? ', 30 minutes only' : ''}`} onClick={() => {
                const deselecting = selectedTimes[activeDate] === time
                setSelectedTimes((current) => {
                  if (!deselecting) return { ...current, [activeDate]: time }
                  const next = { ...current }
                  delete next[activeDate]
                  return next
                })
                setSelectedDurations((current) => {
                  const next = { ...current }
                  if (deselecting || !thirtyOnly) delete next[activeDate]
                  else next[activeDate] = 30
                  return next
                })
              }}><span>{formatTime(time)}</span>{thirtyOnly && <span className="duration-hint">30 min only</span>}</button>
              })
              : <p className="time-slot-prompt" role="status">{availabilityStatus === 'unconfigured'
                ? 'Connect the Google Calendar availability endpoint to show open times.'
                : availabilityStatus === 'loading'
                  ? 'Checking connected calendars…'
                  : availabilityStatus === 'error'
                    ? 'Live availability could not be loaded. Please try again later.'
                    : activeDate
                      ? 'No open times for this date.'
                      : 'Select an available day to see its times.'}</p>}
          </div>
          {activeTime && availableDurations.length > 0 && <div className="duration-options" role="group" aria-label={`Choose walk length for ${formatDateKey(activeDate)}`}>
            <span>Walk length</span>
            <div className="duration-option-list">
              {availableDurations.map((duration) => <button className={selectedDurations[activeDate] === duration ? 'duration-option selected' : 'duration-option'} type="button" key={duration} aria-pressed={selectedDurations[activeDate] === duration} onClick={() => setSelectedDurations((current) => {
                if (current[activeDate] !== duration) return { ...current, [activeDate]: duration }
                const next = { ...current }
                delete next[activeDate]
                return next
              })}>{duration} minutes</button>)}
            </div>
          </div>}
        </div>
        <aside className="booking-summary" aria-live="polite">
          <span className="summary-kicker">Your walk request</span>
          <div className="summary-date"><CalendarDays size={20} /><div><strong>{selectedDates.length === 0 ? 'Choose days' : `${selectedDates.length} ${selectedDates.length === 1 ? 'day' : 'days'} selected`}</strong><span>{requestPrompt}</span></div></div>
          <div className="requested-days" aria-label="Selected dates and times">
            {requestedDays.map(({ dateLabel, time, repeatWeekly }, index) => {
              const dateKey = [...selectedDates].sort()[index]
              return (
                <div className="requested-day" key={dateKey}>
                  <span>{dateLabel}</span>
                  <span className="requested-day-time">{time ? `${time} · ${selectedDurations[dateKey] ? `${selectedDurations[dateKey]} min` : 'Choose length'}` : 'Choose a time'}</span>
                  <button type="button" aria-label={`Remove ${dateLabel}`} onClick={() => removeDate(dateKey)}><X size={17} /></button>
                  <label className="repeat-weekly-toggle">
                    <input type="checkbox" checked={repeatWeekly} onChange={(event) => setRepeatWeeklyByDate((current) => ({ ...current, [dateKey]: event.target.checked }))} />
                    <span>Repeat weekly</span>
                  </label>
                </div>
              )
            })}
          </div>
          <p>Walk length and details can be confirmed when we connect.</p>
          <button className="button button-amber" type="button" disabled={!readyToRequest} onClick={() => onRequest({ days: requestedDays })}>
            Request selected days <ArrowRight size={17} />
          </button>
          <small>No payment needed to request a time.</small>
        </aside>
      </div>
    </section>
  )
}

export default AvailabilitySection