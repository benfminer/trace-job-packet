import { describe, expect, it } from 'vitest'
import { Packer } from 'docx'
import { unzipSync, strFromU8 } from 'fflate'
import { samplePacket } from '../data/sample'
import { splitDuties } from '../data/resume'
import { buildResumeDoc, resumeFileName } from './resume'

describe('resume Word file', () => {
  it('contains the sample student resume (set DOCX_OUT=path to save a copy)', async () => {
    const p = samplePacket()
    p.pages.resume.bullets[0] = splitDuties(p.profile.jobs[0].duties).join('\n')
    const buf = await Packer.toBuffer(buildResumeDoc(p))
    if (process.env.DOCX_OUT) (await import('node:fs')).writeFileSync(process.env.DOCX_OUT.replace('.docx', ' Resume.docx'), buf)
    const xml = strFromU8(unzipSync(new Uint8Array(buf))['word/document.xml'])
    for (const text of ['Jordan Lee', 'WORK AND VOLUNTEER EXPERIENCE', 'Faced products', 'Hoover High School', 'Food Handler Card']) {
      expect(xml).toContain(text)
    }
    expect(resumeFileName(p)).toBe('Jordan Lee Resume.docx')
  })
})
