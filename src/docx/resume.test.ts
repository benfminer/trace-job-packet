import { describe, expect, it } from 'vitest'
import { Packer } from 'docx'
import { unzipSync, strFromU8 } from 'fflate'
import { samplePacket } from '../data/sample'
import { RESUME_LAYOUTS, splitDuties } from '../data/resume'
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

  it('builds every look on US Letter with the same information (set DOCX_OUT=path to save copies)', async () => {
    for (const layout of RESUME_LAYOUTS) {
      const p = samplePacket()
      p.pages.resume.bullets = p.profile.jobs.map((j) => splitDuties(j.duties).join('\n'))
      p.pages.resume.layout = layout.id
      const buf = await Packer.toBuffer(buildResumeDoc(p))
      if (process.env.DOCX_OUT) (await import('node:fs')).writeFileSync(process.env.DOCX_OUT.replace('.docx', ` Resume ${layout.name}.docx`), buf)
      const xml = strFromU8(unzipSync(new Uint8Array(buf))['word/document.xml'])
      // Skills First prints the name in capitals.
      expect(xml.toLowerCase()).toContain('jordan lee')
      for (const text of ['1234 Main Street', 'Store Associate', 'Faced products', 'Sorted and packed food donations', 'Hoover High School',
        'Certificate of Completion', 'Food Handler Card', 'English and Spanish', 'Monday through Friday after 2:00 PM']) {
        expect(xml, `${layout.name}: ${text}`).toContain(text)
      }
      expect(xml).toMatch(/<w:pgSz[^>]*w:w="12240"[^>]*w:h="15840"/)
    }
  })
})
