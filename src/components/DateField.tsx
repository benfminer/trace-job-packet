// A full date: type it (it formats as 11/06/2026) or pick it from a calendar.
// The packet saves 2026-11-06, the same as the calendar picker, so printouts read it the same way.
import { useId, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { formatFullDate, isoToUs, usToIso } from '../data/format'
import { inputClass } from './fields'

interface DateFieldProps {
  label: string
  value: string
  onChange: (iso: string) => void
  width?: 'full' | 'short'
}

export function DateField({ label, value, onChange, width = 'full' }: DateFieldProps) {
  const id = useId()
  const picker = useRef<HTMLInputElement>(null)
  // What's in the box. A half-typed date is kept here while the saved value stays blank.
  const [draft, setDraft] = useState(isoToUs(value))
  // The saved date changed from somewhere else (the calendar, or opening a file): show it.
  if (usToIso(draft) !== value && draft !== isoToUs(value)) setDraft(isoToUs(value))

  const type = (v: string) => {
    const next = formatFullDate(v)
    setDraft(next)
    onChange(usToIso(next))
  }
  const openCalendar = () => {
    const el = picker.current
    if (!el) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.click()
  }
  const badDate = draft.length === 10 && !usToIso(draft)

  return (
    <div className={width === 'short' ? 'max-w-xs' : ''}>
      <label htmlFor={id} className="mb-1 block text-base font-semibold text-slate-700">{label}</label>
      <div className="relative flex gap-2">
        <input id={id} className={inputClass} value={draft} inputMode="numeric" placeholder="MM/DD/YYYY"
          aria-invalid={badDate || undefined} onChange={(e) => type(e.target.value)} />
        <button type="button" onClick={openCalendar} aria-label={`Pick ${label.toLowerCase()} from a calendar`}
          className="shrink-0 rounded-md border border-slate-300 bg-white px-3 text-slate-600 shadow-sm transition-colors hover:border-brand hover:text-brand">
          <CalendarDays aria-hidden className="size-5" />
        </button>
        {/* The browser's own calendar, opened by the button. Hidden but sitting under it so the calendar pops up there. */}
        <input ref={picker} type="date" tabIndex={-1} aria-hidden value={value} onChange={(e) => onChange(e.target.value)}
          className="pointer-events-none absolute right-0 bottom-0 size-px opacity-0" />
      </div>
      {badDate && <p className="mt-1 text-sm font-medium text-red-700">That date doesn't look right. Check the month and day.</p>}
    </div>
  )
}
