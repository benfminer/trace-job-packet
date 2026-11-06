import { describe, expect, it } from 'vitest'
import { Packer } from 'docx'
import { blankPacket } from '../data/packet'
import { buildCoverLetterDoc, coverLetterFileName } from './coverLetter'

describe('cover letter Word file', () => {
  it('builds a .docx that contains the letter', async () => {
    const p = blankPacket()
    Object.assign(p.profile, { firstName: 'Jordan', lastName: 'Lee' })
    Object.assign(p.pages.coverLetter, { jobTitle: 'Store Associate', company: 'Smart & Final' })
    const buf = await Packer.toBuffer(buildCoverLetterDoc(p))
    expect(buf.subarray(0, 2).toString()).toBe('PK') // a .docx is a zip file
    const { unzipSync, strFromU8 } = await import('fflate')
    const xml = strFromU8(unzipSync(new Uint8Array(buf))['word/document.xml'])
    expect(xml).toContain('Store Associate position at Smart &amp; Final')
    expect(xml).toContain('Dear Hiring Team,')
    expect(coverLetterFileName(p)).toBe('Jordan Lee Cover Letter.docx')
  })
})

describe('sample student', () => {
  it('builds a full cover letter (set DOCX_OUT=path to save a copy for checking by hand)', async () => {
    const { samplePacket } = await import('../data/sample')
    const buf = await Packer.toBuffer(buildCoverLetterDoc(samplePacket()))
    if (process.env.DOCX_OUT) (await import('node:fs')).writeFileSync(process.env.DOCX_OUT, buf)
    expect(buf.length).toBeGreaterThan(5000)
  })
})
