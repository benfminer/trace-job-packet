// Builds an editable Word copy of the resume.
import { BorderStyle, Document, Packer, Paragraph, TabStopType, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'
import type { Packet } from '../data/packet'
import { resumeContent } from '../data/resume'

export type ResumeContent = ReturnType<typeof resumeContent>

const FONT = 'Georgia'
const BLUE = '1E88D2'
const MARGIN = 864 // 0.6 inch, in twentieths of a point
const RIGHT_EDGE = 10512 // 7.3 inches of text width

export const text = (t: string, opts: { bold?: boolean; size?: number; color?: string; italics?: boolean } = {}) =>
  new TextRun({ text: t, font: FONT, size: opts.size ?? 22, bold: opts.bold, color: opts.color, italics: opts.italics })

export const heading = (t: string) =>
  new Paragraph({
    spacing: { before: 180, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 2 } },
    children: [new TextRun({ text: t.toUpperCase(), font: 'Arial', size: 20, bold: true, color: BLUE })],
  })

const row = (left: TextRun[], right: string) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_EDGE }],
    children: [...left, text(`\t${right}`, { color: '444444' })],
  })

export const bullet = (t: string) => new Paragraph({ bullet: { level: 0 }, children: [text(t)] })
export const plain = (t: string) => new Paragraph({ children: [text(t)] })

export const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }

// Skills in two columns (top to bottom), as a table with no borders so it stays easy to edit.
const skillColumns = (skills: string[]) => {
  const half = Math.ceil(skills.length / 2)
  const cell = (items: string[]) =>
    new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, children: items.length ? items.map(bullet) : [plain('')] })
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER },
    rows: [new TableRow({ children: [cell(skills.slice(0, half)), cell(skills.slice(half))] })],
  })
}

// The resume itself. The blank template (01) uses this too, with [bracket] placeholders.
export function resumeBody(r: ResumeContent) {
  const children: (Paragraph | Table)[] = [
    new Paragraph({ children: [text(r.name, { bold: true, size: 44 })] }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 4 } },
      children: [text(r.contact, { size: 20, color: '444444' })],
    }),
  ]
  if (r.objective) children.push(heading('Objective'), plain(r.objective))
  if (r.skills.length) children.push(heading('Skills'), skillColumns(r.skills))
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
  children.push(new Paragraph({ spacing: { before: 200 }, children: [text('References available on request.', { italics: true, color: '444444' })] }))
  return children
}

export const PAGE_MARGIN = { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }
// US Letter. The docx library uses A4 unless told otherwise.
export const LETTER = { width: 12240, height: 15840 }

export function buildResumeDoc(packet: Packet) {
  const r = resumeContent(packet)
  return new Document({
    creator: 'TRACE Job Packet',
    title: `${r.name} Resume`,
    sections: [{ properties: { page: { size: LETTER, margin: PAGE_MARGIN } }, children: resumeBody(r) }],
  })
}

export const resumeFileName = (packet: Packet) => `${resumeContent(packet).name.replace('[Your Name]', 'Student')} Resume.docx`

export const resumeBlob = (packet: Packet) => Packer.toBlob(buildResumeDoc(packet))
