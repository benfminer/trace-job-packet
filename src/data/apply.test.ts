import { describe, expect, it } from 'vitest'
import { blankPacket } from './packet'
import { applySections } from './apply'

describe('applySections', () => {
  it('leaves out blank answers and empty groups', () => {
    const p = blankPacket()
    p.profile.firstName = 'Ana'
    const titles = applySections(p).map((s) => s.title)
    expect(titles).toContain('My name')
    expect(titles).not.toContain('How to reach me')
    expect(titles.some((t) => t.startsWith('Job #'))).toBe(false)
    expect(applySections(p).find((s) => s.title === 'My name')?.rows).toEqual([['Legal first name', 'Ana']])
  })

  it('numbers only the jobs that are filled in', () => {
    const p = blankPacket()
    p.profile.jobs[1].employer = 'CVS'
    const jobs = applySections(p).filter((s) => s.title.startsWith('Job #'))
    expect(jobs.map((s) => s.title)).toEqual(['Job #1 (most recent)'])
    expect(jobs[0].rows[0]).toEqual(['Employer', 'CVS'])
  })

  it('puts the apartment in the one-line address', () => {
    const p = blankPacket()
    Object.assign(p.profile, { street: '1 Main St', apt: '4', city: 'San Diego', zip: '92105' })
    const where = applySections(p).find((s) => s.title === 'Where I live')!
    expect(where.rows).toContainEqual(['Whole address on one line', '1 Main St #4, San Diego, CA 92105'])
  })
})
