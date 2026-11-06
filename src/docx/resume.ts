// Builds an editable Word copy of the resume.
import { BorderStyle, Document, Packer, Paragraph, TabStopType, TextRun } from 'docx'
import type { Packet } from '../data/packet'
import { resumeContent } from '../data/resume'

const FONT = 'Georgia'
const BLUE = '1E88D2'
const RIGHT_EDGE = 10080 // 7 inches of text width, in twentieths of a point

const text = (t: string, opts: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {}) =>
  new TextRun({ text: t, font: FONT, size: opts.size ?? 22, bold: opts.bold, color: opts.color, italics: opts.italics })

const heading = (t: string) =>
  new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 2 } },
    children: [new TextRun({ text: t.toUpperCase(), font: 'Arial', size: 20, bold: true, color: BLUE })],
  })

const row = (left: TextRun[], right: string) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_EDGE }],
    children: [...left, text(`\t${right}`, { color: '444444' })],
  })

const bullet = (t: string) => new Paragraph({ bullet: { level: 0 }, children: [text(t)] })
const plain = (t: string) => new Paragraph({ children: [text(t)] })

export function buildResumeDoc(packet: Packet) {
  const r = resumeContent(packet)
  const children: Paragraph[] = [
    new Paragraph({ children: [text(r.name, { bold: true, size: 48 })] }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 4 } },
      children: [text(r.contact, { size: 20, color: '444444' })],
    }),
  ]
  if (r.objective) children.push(heading('Objective'), plain(r.objective))
  if (r.skills.length) children.push(heading('Skills'), ...r.skills.map(bullet))
  if (r.jobs.length) {
    children.push(heading('Work and Volunteer Experience'))
    r.jobs.forEach((j, i) => {
      children.push(row([text(j.title || 'Volunteer', { bold: true }), text(`, ${j.employer}`)], j.dates))
      children.push(...j.bullets.map(bullet))
      if (i < r.jobs.length - 1) children.push(new Paragraph({ spacing: { after: 60 }, children: [] }))
    })
  }
  children.push(heading('Education'))
  for (const s of r.schools) {
    children.push(row([text(s.name, { bold: true })], s.dates))
    if (s.detail) children.push(plain(s.detail))
  }
  if (r.certifications.length) children.push(heading('Certifications'), plain(r.certifications.join('  |  ')))
  if (r.languages) children.push(heading('Languages'), plain(r.languages))
  if (r.availability) children.push(heading('Availability'), plain(r.availability))
  children.push(new Paragraph({ spacing: { before: 320 }, children: [text('References available on request.', { italics: true, color: '444444' })] }))

  return new Document({
    creator: 'TRACE Job Packet',
    title: `${r.name} Resume`,
    sections: [{ properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } }, children }],
  })
}

export const resumeFileName = (packet: Packet) => `${resumeContent(packet).name.replace('[Your Name]', 'Student')} Resume.docx`

export const resumeBlob = (packet: Packet) => Packer.toBlob(buildResumeDoc(packet))
