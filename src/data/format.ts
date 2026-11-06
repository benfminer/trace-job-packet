// Tidies what students type: phone numbers, dates, state, and ZIP code.
// Formatters only add a separator once the next digit is typed, so backspacing never gets stuck.

const digits = (v: string) => v.replace(/\D/g, '')
const hasLetters = (v: string) => /[a-z]/i.test(v)

// 6195550142 -> (619) 555-0142. Anything with letters or more than 10 digits is left alone.
export function formatPhone(v: string) {
  const d = digits(v)
  if (hasLetters(v) || d.length > 10) return v
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

// Joins typed pieces into digits. A one-digit piece the student closed with "/" gets a 0: "6/" -> "06".
function datePieces(v: string) {
  const parts = v.split('/')
  return parts.map((p, i) => {
    const d = digits(p)
    return i < parts.length - 1 && d.length === 1 ? '0' + d : d
  }).join('')
}

// 062025 -> 06/2025. Words like "Present" are left alone.
export function formatMonthYear(v: string) {
  if (hasLetters(v)) return v
  const d = datePieces(v).slice(0, 6)
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`
}

// 11062026 -> 11/06/2026
export function formatFullDate(v: string) {
  const d = datePieces(v).slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

// Full dates are saved as 2026-11-06 (what the calendar picker uses). These convert to and from 11/06/2026.
export const isoToUs = (iso: string) => {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[2]}/${m[3]}/${m[1]}` : ''
}

// Returns '' until the date is complete and real (no 02/30).
export function usToIso(us: string) {
  const m = us.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return ''
  const [, mm, dd, yyyy] = m
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  const real = d.getFullYear() === Number(yyyy) && d.getMonth() === Number(mm) - 1 && d.getDate() === Number(dd)
  return real ? `${yyyy}-${mm}-${dd}` : ''
}

export const formatState = (v: string) => v.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase()

// 92107 or 92107-1234
export function formatZip(v: string) {
  const d = digits(v).slice(0, 9)
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`
}

// "San Diego, CA 92107". Blank when only the state is filled in.
export function cityLine(city: string, state: string, zip: string) {
  if (!city && !zip) return ''
  return [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')
}

// "4821 Orchard Ave, San Diego, CA 92107"
export const fullAddress = (street: string, city: string, state: string, zip: string) =>
  [street, cityLine(city, state, zip)].filter(Boolean).join(', ')

// Splits old "San Diego, CA 92115" text into its parts. Anything it can't read goes into city.
export function splitCityStateZip(v: string) {
  const m = v.trim().match(/^(.+?),?\s+([a-z]{2})\.?,?\s*(\d{5}(?:-\d{4})?)?$/i)
  if (!m) return { city: v.trim(), state: '', zip: '' }
  return { city: m[1].trim(), state: m[2].toUpperCase(), zip: m[3] ?? '' }
}
