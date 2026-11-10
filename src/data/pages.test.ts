import { describe, expect, it } from 'vitest'
import { blankPacket } from './packet'
import { canSkip, isSkipped, nextPage, progress } from './pages'

describe('skipping pages', () => {
  it('passes over skipped pages when picking what is next', () => {
    const { status } = blankPacket()
    status.about.done = true
    status.availability.done = true
    status.resume.skipped = true
    expect(nextPage(status)?.id).toBe('appInfo')
    expect(nextPage(status, 'availability')?.id).toBe('appInfo')
  })

  it('leaves skipped pages out of the count', () => {
    const { status } = blankPacket()
    status.about.done = true
    status.benefits.skipped = true
    status.disclosure.skipped = true
    expect(progress(status)).toEqual({ done: 1, total: 11 })
  })

  it('finishes the road when everything left is skipped', () => {
    const { status } = blankPacket()
    for (const id of Object.keys(status) as (keyof typeof status)[]) {
      if (id === 'benefits') status[id].skipped = true
      else status[id].done = true
    }
    expect(nextPage(status)).toBeUndefined()
    expect(progress(status)).toEqual({ done: 12, total: 12 })
  })

  it('counts a finished page as done even if it was skipped before', () => {
    const { status } = blankPacket()
    Object.assign(status.benefits, { skipped: true, done: true })
    expect(isSkipped(status, 'benefits')).toBe(false)
  })

  it('never lets About Me or Weekly Availability be skipped', () => {
    expect(canSkip('about')).toBe(false)
    expect(canSkip('availability')).toBe(false)
    expect(canSkip('benefits')).toBe(true)
  })
})
