// Builds an editable Word copy of the resume, in the look the student picked.
import { BorderStyle, Document, Packer, Paragraph, Table, TextRun } from 'docx'
import type { Packet } from '../data/packet'
import { resumeContent, resumeLayout } from '../data/resume'
import { wordFileName } from '../data/derive'
import { bullet, columns, LETTER, PAGE_MARGIN, plain, row, text } from './resumeParts'
import { skillsFirstBody } from './resumeSkillsFirst'
import { sideLabelsBody } from './resumeSideLabels'

export { LETTER, PAGE_MARGIN } from './resumeParts'
export type ResumeContent = ReturnType<typeof resumeContent>

const BLUE = '1E88D2'

const heading = (t: string) =>
  new Paragraph({
    spacing: { before: 180, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 2 } },
    children: [new TextRun({ text: t.toUpperCase(), font: 'Arial', size: 20, bold: true, color: BLUE })],
  })

// The Classic look. The blank template (01) uses this too, with [bracket] placeholders.
export function resumeBody(r: ResumeContent) {
  const children: (Paragraph | Table)[] = [
    new Paragraph({ children: [text(r.name, { bold: true, size: 44 })] }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE, space: 4 } },
      children: [text(r.contact, { size: 20, color: '444444' })],
    }),
  ]
  if (r.objective) children.push(heading('Objective'), plain(r.objective))
  if (r.skills.length) children.push(heading('Skills'), columns(r.skills, 2))
  if (r.jobs.length) {
    children.push(heading('Work and Volunteer Experience'))
    r.jobs.forEach((j, i) => {
      children.push(row([text(j.title || 'Volunteer', { bold: true }), text(`, ${j.employer}`)], j.dates))
      children.push(...j.bullets.map((b) => bullet(b)))
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

const BODIES = { classic: resumeBody, skills: skillsFirstBody, side: sideLabelsBody }

export function buildResumeDoc(packet: Packet) {
  const r = resumeContent(packet)
  return new Document({
    creator: 'TRACE Job Packet',
    title: `${r.name} Resume`,
    sections: [{ properties: { page: { size: LETTER, margin: PAGE_MARGIN } }, children: BODIES[resumeLayout(packet)](r) }],
  })
}

export const resumeFileName = (packet: Packet) => wordFileName(packet, 'Resume')

export const resumeBlob = (packet: Packet) => Packer.toBlob(buildResumeDoc(packet))
