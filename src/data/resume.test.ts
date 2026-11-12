import { describe, expect, it } from 'vitest'
import { extrasLine, extrasTitle, resumeContent, resumeLayout, splitDuties } from './resume'
import { samplePacket } from './sample'

describe('splitDuties', () => {
  it('turns a list sentence into bullets', () => {
    expect(splitDuties('Stocked shelves, faced products, and helped customers find what they needed.')).toEqual(
      ['Stocked shelves', 'Faced products', 'Helped customers find what they needed'])
  })
  it('keeps a single task whole and respects line breaks', () => {
    expect(splitDuties('Sorted and packed food donations')).toEqual(['Sorted and packed food donations'])
    expect(splitDuties('cleaned tables\nwashed dishes, pots, and pans')).toEqual(['Cleaned tables', 'Washed dishes, pots, and pans'])
    expect(splitDuties('  ')).toEqual([])
  })
})

describe('resumeContent', () => {
  it('builds the sample student resume from packet answers', () => {
    const p = samplePacket()
    p.pages.resume.bullets[0] = 'Stocked shelves\nHelped customers'
    p.pages.resume.skills = ['Customer service', 'Reliable']
    const r = resumeContent(p)
    expect(r.name).toBe('Jordan Lee')
    expect(r.jobs.map((j) => j.employer)).toEqual(['CVS', 'San Diego Food Bank'])
    expect(r.jobs[0]).toMatchObject({ dates: '01/2025 – Present', bullets: ['Stocked shelves', 'Helped customers'] })
    expect(r.skills).toEqual(['Customer service', 'Reliable', 'Punctual', 'Team player'])
    expect(r.schools.map((s) => s.name)).toEqual(['TRACE, San Diego Unified', 'Hoover High School'])
    expect(r.schools[1].detail).toBe('Certificate of Completion')
    expect(r.certifications).toEqual(['Food Handler Card (09/2025)'])
    p.pages.resume.showAvailability = false
    expect(resumeContent(p).availability).toBe('')
  })
})

describe('resumeLayout', () => {
  it('starts as Classic and keeps the look that was picked', () => {
    const p = samplePacket()
    expect(resumeLayout(p)).toBe('classic')
    p.pages.resume.layout = 'side'
    expect(resumeLayout(p)).toBe('side')
  })
  it('prints as Classic when a file holds a look this app does not know', () => {
    const p = samplePacket()
    p.pages.resume.layout = 'fancy' as never
    expect(resumeLayout(p)).toBe('classic')
  })
})

describe('Skills First extras line', () => {
  it('puts certifications and languages on one line, or just the one the student has', () => {
    const p = samplePacket()
    const r = resumeContent(p)
    expect(extrasTitle(r)).toBe('Certifications and Languages')
    expect(extrasLine(r)).toBe('Food Handler Card (09/2025)  \u2022  Speaks English and Spanish')
    p.pages.resume.languages = ''
    expect(extrasTitle(resumeContent(p))).toBe('Certifications')
    p.profile.certifications = [{ name: '', earned: '', expires: '' }]
    expect(extrasTitle(resumeContent(p))).toBe('')
  })
})
