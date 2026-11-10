import { describe, expect, it } from 'vitest'
import { blankPacket } from './packet'
import { contactLine, coverLetterParagraphs, joinList, summarizeAvailability } from './derive'

describe('summarizeAvailability', () => {
  it('groups weekdays and weekends like the handout example', () => {
    const p = blankPacket().profile
    for (const d of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const) p.availability[d].earliest = '2:00 PM'
    for (const d of ['Saturday', 'Sunday'] as const) Object.assign(p.availability[d], { morning: true, afternoon: true, evening: true })
    expect(summarizeAvailability(p.availability)).toBe('Monday through Friday after 2:00 PM and Saturday and Sunday all day')
  })

  it('handles single days and slot names', () => {
    const p = blankPacket().profile
    p.availability.Tuesday.afternoon = true
    p.availability.Tuesday.evening = true
    p.availability.Thursday.morning = true
    p.availability.Saturday.earliest = '9:00 AM'
    p.availability.Saturday.latest = '5:00 PM'
    expect(summarizeAvailability(p.availability)).toBe(
      'Tuesday afternoons and evenings, Thursday mornings, and Saturday from 9:00 AM to 5:00 PM')
  })

  it('is empty when nothing is checked', () => {
    expect(summarizeAvailability(blankPacket().profile.availability)).toBe('')
  })
})

describe('joinList', () => {
  it('writes lists the way people do', () => {
    expect(joinList(['a'])).toBe('a')
    expect(joinList(['a', 'b'], 'or')).toBe('a or b')
    expect(joinList(['a', 'b', 'c'])).toBe('a, b, and c')
  })
})

describe('cover letter', () => {
  it('matches the Jordan Lee example from the handout', () => {
    const p = blankPacket()
    Object.assign(p.profile, { firstName: 'Jordan', lastName: 'Lee', cellPhone: '(619) 555-0142', email: 'jordan.lee@email.com',
      street: '1234 Main Street', city: 'San Diego', zip: '92105' })
    Object.assign(p.target, { title: 'Store Associate', company: 'Smart & Final', whereFound: 'the Smart & Final careers website.' })
    Object.assign(p.pages.coverLetter, {
      experienceWith: 'Working with customers', place1: 'CVS', did1: 'Stocked shelves and helped customers find products.',
      strengths: ['Reliable', 'Team player'], doWell: 'keep my work area clean and organized',
      why: 'I shop there with my family', whenCanWork: 'Monday through Friday after 2:00 PM',
    })
    const [p1, p2, p3, p4] = coverLetterParagraphs(p)
    expect(p1).toBe('My name is Jordan Lee, and I am applying for the Store Associate position at Smart & Final. I found this job on the Smart & Final careers website.')
    expect(p2).toBe('I have experience working with customers. At CVS, I stocked shelves and helped customers find products. I am reliable and a team player, and I keep my work area clean and organized.')
    expect(p3).toBe('I want to work at Smart & Final because I shop there with my family.')
    expect(p4).toBe('I am available to work Monday through Friday after 2:00 PM. Thank you for your time and consideration. I look forward to hearing from you. You can reach me at (619) 555-0142 or jordan.lee@email.com.')
    expect(contactLine(p.profile)).toBe('1234 Main Street, San Diego, CA 92105  |  (619) 555-0142  |  jordan.lee@email.com')
  })

  it('uses placeholders and skips empty parts for a brand-new packet', () => {
    const paras = coverLetterParagraphs(blankPacket())
    expect(paras[0]).toBe('My name is [Your Name], and I am applying for the [Job Title] position at [Company Name].')
    expect(paras).toHaveLength(2)
  })
})
