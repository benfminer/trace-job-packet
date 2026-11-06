import { describe, expect, it } from 'vitest'
import { Packer } from 'docx'
import { unzipSync, strFromU8 } from 'fflate'
import { buildResumeTemplate } from './resumeTemplate'

describe('blank resume template (01)', () => {
  it('has the blank resume, the builder, and the example (set TEMPLATE_OUT=path to save it)', async () => {
    const buf = await Packer.toBuffer(buildResumeTemplate())
    if (process.env.TEMPLATE_OUT) (await import('node:fs')).writeFileSync(process.env.TEMPLATE_OUT, buf)
    const files = unzipSync(new Uint8Array(buf))
    const xml = strFromU8(files['word/document.xml'])
    for (const text of ['[Your Name]', 'Resume Builder', 'BEFORE YOU SEND IT', 'EXAMPLE.', 'Jordan Lee']) {
      expect(xml).toContain(text)
    }
    expect(strFromU8(files['docProps/core.xml'])).not.toMatch(/Miner|Benjamin/)
  })
})
