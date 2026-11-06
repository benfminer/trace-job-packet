import { describe, expect, it } from 'vitest'
import { blankPacket, loadPacket, PacketFileError } from './packet'
import { serializePacket, packetFileName } from './saveLoad'

function filledPacket() {
  const p = blankPacket()
  p.teacher = 'Ms. Rivera'
  p.profile.firstName = 'Jordan'
  p.profile.lastName = 'Lee'
  p.profile.cellPhone = '(619) 555-0142'
  p.profile.emergency[1].name = 'Pat Lee'
  p.profile.jobs[0].employer = 'CVS'
  p.profile.jobs[0].okToContact = 'yes'
  p.profile.jobs.push({ ...p.profile.jobs[0], employer: 'Food Bank' })
  p.profile.strengths = ['Reliable', 'Kind to animals']
  p.profile.availability.Monday.afternoon = true
  p.profile.availability.Monday.earliest = '2:00 PM'
  p.pages.references.people[2].saidYes = true
  p.pages.coverLetter.company = 'Smart & Final'
  p.status.references = { done: true, date: '2026-11-05' }
  return p
}

describe('save and open', () => {
  it('keeps every field through a save file round trip', () => {
    const p = filledPacket()
    const reopened = loadPacket(JSON.parse(serializePacket(p)))
    expect({ ...reopened, savedAt: '' }).toEqual({ ...p, savedAt: '' })
  })

  it('names the file after the student', () => {
    expect(packetFileName(filledPacket())).toBe('Jordan_Lee_packet.json')
    expect(packetFileName(blankPacket())).toBe('Student_packet.json')
  })

  it('fills in missing fields from an older or partial file', () => {
    const p = loadPacket({ app: 'trace-job-packet', schemaVersion: 1, profile: { firstName: 'Ana' } })
    expect(p.profile.firstName).toBe('Ana')
    expect(p.profile.lastName).toBe('')
    expect(p.profile.jobs).toHaveLength(3)
    expect(p.profile.availability.Sunday.evening).toBe(false)
    expect(p.pages.coverLetter.strengths).toEqual([])
    expect(p.status.tracker.done).toBe(false)
  })

  it('splits the old one-box cover letter city into city, state, and ZIP', () => {
    const p = loadPacket({ app: 'trace-job-packet', schemaVersion: 1, pages: { coverLetter: { companyCityStateZip: 'San Diego, CA 92115' } } })
    expect(p.pages.coverLetter).toMatchObject({ companyCity: 'San Diego', companyState: 'CA', companyZip: '92115' })
    expect('companyCityStateZip' in p.pages.coverLetter).toBe(false)
  })

  it('keeps an old job address as the street', () => {
    const p = loadPacket({ app: 'trace-job-packet', schemaVersion: 1, profile: { jobs: [{ address: '1 Main St, San Diego' }] } })
    expect(p.profile.jobs[0]).toMatchObject({ address: '1 Main St, San Diego', city: '', state: 'CA', zip: '' })
  })

  it('ignores wrong types and unknown fields instead of crashing', () => {
    const p = loadPacket({
      app: 'trace-job-packet',
      profile: { firstName: 42, jobs: 'oops', strengths: ['Reliable', 7], hacked: true },
      pages: null,
    })
    expect(p.profile.firstName).toBe('')
    expect(p.profile.jobs).toHaveLength(3)
    expect(p.profile.strengths).toEqual(['Reliable'])
    expect('hacked' in p.profile).toBe(false)
    expect(p.pages.references.people).toHaveLength(3)
  })

  it('rejects files that are not packets', () => {
    expect(() => loadPacket({ hello: 'world' })).toThrow(PacketFileError)
    expect(() => loadPacket(null)).toThrow(PacketFileError)
    expect(() => loadPacket({ app: 'trace-job-packet', schemaVersion: 99 })).toThrow(/newer version/)
  })
})

describe('privacy', () => {
  it('has no place to store a Social Security number, ID number, or password', () => {
    const keys: string[] = []
    const walk = (v: unknown) => {
      if (v && typeof v === 'object') for (const [k, child] of Object.entries(v)) { keys.push(k); walk(child) }
    }
    walk(blankPacket())
    expect(keys.filter((k) => /ssn|social|security|password|idnumber|license(number|num)/i.test(k))).toEqual([])
  })
})
