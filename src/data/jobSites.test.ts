import { describe, expect, it } from 'vitest'
import { PLACE_KINDS, hasDuty, joinDuties, kindForEmployer, kindForJob, skillIdeasFor, toggleDuty } from './jobSites'
import { splitDuties } from './resume'

describe('job sites list', () => {
  it('has no commas or periods inside a duty, so duties split cleanly into resume bullets', () => {
    for (const k of PLACE_KINDS) for (const d of k.duties) expect(d).not.toMatch(/[,;.\n]/)
  })
})

describe('kindForEmployer', () => {
  it('knows the places on the list, however they are typed', () => {
    expect(kindForEmployer('Smart & Final')?.id).toBe('store')
    expect(kindForEmployer('smart and final #412')?.id).toBe('store')
    expect(kindForEmployer('CVS Pharmacy')?.id).toBe('store')
    expect(kindForEmployer('SeaWorld San Diego')?.id).toBe('park')
    expect(kindForEmployer('San Diego Humane Society and SPCA')?.id).toBe('shelter')
  })
  it('does not guess for other places', () => {
    expect(kindForEmployer('Vons')).toBeUndefined()
    expect(kindForEmployer('')).toBeUndefined()
  })
})

describe('kindForJob', () => {
  it('falls back to duties already tapped', () => {
    expect(kindForJob({ employer: "Denny's", duties: 'Cleared and wiped tables and washed dishes.' })?.id).toBe('restaurant')
    expect(kindForJob({ employer: "Denny's", duties: '' })).toBeUndefined()
  })
})

describe('toggleDuty', () => {
  it('builds a sentence one tap at a time', () => {
    let text = toggleDuty('', 'Stocked shelves')
    expect(text).toBe('Stocked shelves.')
    text = toggleDuty(text, 'Bagged groceries')
    expect(text).toBe('Stocked shelves and bagged groceries.')
    text = toggleDuty(text, 'Cleaned and swept the aisles')
    expect(text).toBe('Stocked shelves, bagged groceries, and cleaned and swept the aisles.')
    expect(splitDuties(text)).toEqual(['Stocked shelves', 'Bagged groceries', 'Cleaned and swept the aisles'])
  })
  it('takes a duty back out on a second tap', () => {
    const text = 'Stocked shelves, bagged groceries, and broke down boxes.'
    expect(toggleDuty(text, 'Bagged groceries')).toBe('Stocked shelves and broke down boxes.')
    expect(toggleDuty('Stocked shelves and broke down boxes.', 'Stocked shelves')).toBe('Broke down boxes.')
    expect(toggleDuty('Broke down boxes.', 'Broke down boxes')).toBe('')
  })
  it('keeps what the student typed', () => {
    expect(toggleDuty('Helped at the TRACE coffee cart', 'Greeted customers')).toBe('Helped at the TRACE coffee cart and greeted customers.')
    expect(toggleDuty('Ran the register, TRACE cart duty', 'Greeted customers')).toBe('Ran the register, TRACE cart duty, and greeted customers.')
  })
  it('still knows what was tapped after the student types another sentence', () => {
    const text = 'Cleared and wiped tables and washed dishes. I also folded napkins.'
    expect(hasDuty(text, 'Washed dishes')).toBe(true)
    expect(toggleDuty(text, 'Washed dishes')).toBe('Cleared and wiped tables and I also folded napkins.')
    expect(toggleDuty(text, 'Set tables for the next guests')).toBe('Cleared and wiped tables, washed dishes, I also folded napkins, and set tables for the next guests.')
  })
  it('does not break a duty that has "and" in it', () => {
    expect(hasDuty('Cleaned cages and kennels.', 'Cleaned cages and kennels')).toBe(true)
    expect(toggleDuty('Cleaned cages and kennels.', 'Fed the animals')).toBe('Cleaned cages and kennels and fed the animals.')
    expect(hasDuty('Cleaned cages and kennels and fed the animals.', 'Fed the animals')).toBe(true)
    expect(hasDuty('Cleaned cages and kennels and fed the animals.', 'Cleaned cages and kennels')).toBe(true)
  })
})

describe('joinDuties', () => {
  it('handles none', () => expect(joinDuties([])).toBe(''))
})

describe('skillIdeasFor', () => {
  it('offers skills for the kinds of places worked, once each', () => {
    const skills = skillIdeasFor([
      { employer: 'CVS', duties: '' }, { employer: 'Grocery Outlet', duties: '' }, { employer: 'SPCA', duties: '' }, { employer: 'Somewhere', duties: '' },
    ])
    expect(skills).toContain('Animal care')
    expect(skills.filter((s) => s === 'Customer service')).toHaveLength(1)
  })
})
