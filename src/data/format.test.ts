import { describe, expect, it } from 'vitest'
import {
  formatFullDate, formatMonthYear, formatPhone, formatState, formatZip, fullAddress, isoToUs,
  splitCityStateZip, usToIso,
} from './format'

describe('typing helpers', () => {
  it('formats phone numbers as they are typed', () => {
    expect(formatPhone('619')).toBe('619')
    expect(formatPhone('6195')).toBe('(619) 5')
    expect(formatPhone('6195550142')).toBe('(619) 555-0142')
    expect(formatPhone('619.555.0142')).toBe('(619) 555-0142')
    // Backspacing past the ") " still works.
    expect(formatPhone('(619) ')).toBe('619')
    expect(formatPhone('555-0142 ext 12')).toBe('555-0142 ext 12')
  })

  it('formats month and year', () => {
    expect(formatMonthYear('06')).toBe('06')
    expect(formatMonthYear('062025')).toBe('06/2025')
    expect(formatMonthYear('6/2025')).toBe('06/2025')
    expect(formatMonthYear('06/20251')).toBe('06/2025')
    expect(formatMonthYear('Present')).toBe('Present')
  })

  it('formats full dates and converts them for saving', () => {
    expect(formatFullDate('1106')).toBe('11/06')
    expect(formatFullDate('11062026')).toBe('11/06/2026')
    expect(formatFullDate('6/5/2026')).toBe('06/05/2026')
    expect(usToIso('11/06/2026')).toBe('2026-11-06')
    expect(usToIso('02/30/2026')).toBe('')
    expect(usToIso('11/06')).toBe('')
    expect(isoToUs('2026-11-06')).toBe('11/06/2026')
  })

  it('cleans up state and ZIP', () => {
    expect(formatState('ca')).toBe('CA')
    expect(formatState('Calif')).toBe('CA')
    expect(formatZip('92107')).toBe('92107')
    expect(formatZip('921071234')).toBe('92107-1234')
  })

  it('builds and splits addresses', () => {
    expect(fullAddress('1 Main St', 'San Diego', 'CA', '92107')).toBe('1 Main St, San Diego, CA 92107')
    expect(fullAddress('', '', 'CA', '')).toBe('')
    expect(splitCityStateZip('San Diego, CA 92115')).toEqual({ city: 'San Diego', state: 'CA', zip: '92115' })
    expect(splitCityStateZip('La Mesa CA')).toEqual({ city: 'La Mesa', state: 'CA', zip: '' })
    expect(splitCityStateZip('somewhere')).toEqual({ city: 'somewhere', state: '', zip: '' })
  })
})
