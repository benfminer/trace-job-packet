import { describe, expect, it } from 'vitest'
import { loadPacket } from './packet'
import { serializePacket } from './saveLoad'
import { samplePacket } from './sample'

describe('sample student', () => {
  it('is a valid save file (set SAMPLE_OUT=path to write it out)', async () => {
    const json = serializePacket(samplePacket())
    if (process.env.SAMPLE_OUT) (await import('node:fs')).writeFileSync(process.env.SAMPLE_OUT, json)
    expect(loadPacket(JSON.parse(json)).profile.firstName).toBe('Jordan')
  })

  it('keeps every answer on every page through save and open', () => {
    const p = samplePacket()
    expect({ ...loadPacket(JSON.parse(serializePacket(p))), savedAt: '' }).toEqual({ ...p, savedAt: '' })
  })
})
