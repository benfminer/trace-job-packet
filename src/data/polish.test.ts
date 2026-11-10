import { describe, expect, it } from 'vitest'
import { blankJob, blankPacket } from './packet'
import { letterPrompt, resumeParts, resumePrompt } from './polish'

function student() {
  const p = blankPacket()
  Object.assign(p.profile, { firstName: 'Jordan', lastName: 'Lee', street: '1234 Main Street', cellPhone: '(619) 555-0142' })
  p.profile.jobs = [blankJob(), { ...blankJob(), employer: 'CVS', title: 'Store Associate', start: '01/2025', end: 'Present' }]
  p.pages.resume.bullets = ['', 'stocked shelfs\nhelped customers']
  p.pages.resume.objective = 'To get a part time job'
  return p
}

describe('resume prompt', () => {
  it('has nothing to copy until something is written', () => {
    expect(resumePrompt(blankPacket())).toBe('')
  })

  it('sends only the wording, labeled so it can be pasted back, and none of the contact info', () => {
    const prompt = resumePrompt(student())
    expect(prompt).toContain('[MY GOAL]\nTo get a part time job')
    expect(prompt).toContain('[JOB 1: Store Associate at CVS (01/2025 to Present)]\nstocked shelfs\nhelped customers')
    expect(prompt).not.toContain('1234 Main Street')
    expect(prompt).not.toContain('555-0142')
  })

  it('tells Gemini not to add anything and to say what it changed', () => {
    for (const prompt of [resumePrompt(student()), letterPrompt(student())]) {
      expect(prompt).toContain('Do NOT add anything new')
      expect(prompt).toContain('It has to sound like me')
      expect(prompt).toContain('WHAT I CHANGED')
    }
  })

  it('keeps each job tied to its own bullets box', () => {
    expect(resumeParts(student()).jobs).toMatchObject([{ index: 1, label: 'JOB 1: Store Associate at CVS' }])
  })
})

describe('cover letter prompt', () => {
  it('ends with the letter as it reads now', () => {
    const p = student()
    Object.assign(p.target, { title: 'Stocker', company: 'Target' })
    expect(letterPrompt(p)).toContain('[MY LETTER]\n\nMy name is Jordan Lee, and I am applying for the Stocker position at Target.')
  })
})
