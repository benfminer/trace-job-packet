import { describe, expect, it } from 'vitest'
import { blankPacket } from './packet'
import { logTarget, startNewApplication } from './target'

function applying() {
  const p = blankPacket()
  Object.assign(p.target, { practice: false, title: 'Stocker', company: 'Target', whereFound: 'Indeed' })
  p.profile.strengths = ['Reliable']
  Object.assign(p.pages.coverLetter, { why: 'I shop there', experienceWith: 'stocking shelves' })
  p.pages.appInfo.knowAnyone = 'My cousin'
  p.pages.appInfo.legalToWork = 'yes'
  p.pages.interview.answers.whyHere = 'close to home'
  p.pages.interview.answers.strengths = 'reliable'
  p.pages.interview.interviewer = 'Ms. Diaz'
  p.status.coverLetter = { started: true, done: true, date: '2026-11-09' }
  return p
}

describe('logTarget', () => {
  it('puts a real job on the tracker once, using the empty first row', () => {
    const p = applying()
    logTarget(p)
    logTarget(p)
    expect(p.pages.tracker.rows).toHaveLength(1)
    expect(p.pages.tracker.rows[0]).toMatchObject({ company: 'Target', title: 'Stocker' })
  })

  it('leaves a practice job off the tracker', () => {
    const p = applying()
    p.target.practice = true
    logTarget(p)
    expect(p.pages.tracker.rows[0].company).toBe('')
  })
})

describe('startNewApplication', () => {
  it('clears only the answers about the old job and keeps it on the tracker', () => {
    const p = applying()
    startNewApplication(p)
    expect(p.target).toMatchObject({ practice: false, title: '', company: '', whereFound: '' })
    expect(p.pages.coverLetter).toMatchObject({ why: '', experienceWith: 'stocking shelves' })
    expect(p.pages.appInfo).toMatchObject({ knowAnyone: '', legalToWork: 'yes' })
    expect(p.pages.interview.answers).toMatchObject({ whyHere: '', strengths: 'reliable' })
    expect(p.pages.interview.interviewer).toBe('')
    expect(p.profile.strengths).toEqual(['Reliable'])
    expect(p.status.coverLetter).toEqual({ started: true, done: false, date: '' })
    expect(p.pages.tracker.rows[0].company).toBe('Target')
  })

  it('turns a practice packet into a real application without logging the practice job', () => {
    const p = applying()
    p.target.practice = true
    startNewApplication(p)
    expect(p.target.practice).toBe(false)
    expect(p.pages.tracker.rows[0].company).toBe('')
  })
})
