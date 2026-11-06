import { describe, expect, it } from 'vitest'
import { addDays, introText, thankYouText } from './derive'
import { samplePacket } from './sample'
import { blankPacket } from './packet'

describe('interview prep text', () => {
  it('reads the introduction as one paragraph', () => {
    expect(introText(samplePacket().pages.interview)).toBe(
      "Hi, my name is Jordan. Right now I am in the TRACE program, where I'm building my job skills. " +
      'I have experience stocking shelves and helping customers at CVS. ' +
      "I am good at keeping things organized, and I'm always on time. " +
      'I want this job because I like helping customers and working on a team.',
    )
  })

  it("doesn't repeat the starter words if the student typed them", () => {
    const i = blankPacket().pages.interview
    i.introWhy = 'I want this job because I like people.'
    expect(introText(i)).toBe('I want this job because I like people.')
  })

  it('fills the thank-you note and leaves [brackets] for blanks', () => {
    const p = samplePacket()
    expect(thankYouText(p)).toContain('Hi Ms. Garcia,')
    expect(thankYouText(p)).toContain('the Store Associate position')
    expect(thankYouText(p)).toContain('Jordan Lee\n(619) 555-0142')
    expect(thankYouText(blankPacket())).toContain("Hi [Interviewer's Name],")
  })
})

describe('job search tracker', () => {
  it('suggests a follow-up 1 week after applying', () => {
    expect(addDays('2026-11-01', 7)).toBe('2026-11-08')
    expect(addDays('2026-12-28', 7)).toBe('2027-01-04')
    expect(addDays('', 7)).toBe('')
  })
})
