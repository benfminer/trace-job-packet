// The Skills First look as a Word file: black and white, name in the middle, skills above the jobs.
import { AlignmentType, BorderStyle, Paragraph, ShadingType, type Table } from 'docx'
import { extrasLine, extrasTitle, type ResumeContent } from '../data/resume'
import { bullet, columns, plain, row, spacer, text, type TextOptions } from './resumeParts'

const ARIAL: TextOptions = { font: 'Arial' }

// A grey bar with the section name. The gap above it is its own empty line, so the grey doesn't spread into it.
const heading = (t: string) => [
  spacer(170),
  new Paragraph({
    spacing: { after: 70 },
    shading: { type: ShadingType.CLEAR, fill: 'ECECEC', color: 'auto' },
    children: [text(` ${t.toUpperCase()}`, { ...ARIAL, bold: true, size: 21, spacing: 28 })],
  }),
]

export function skillsFirstBody(r: ResumeContent) {
  const children: (Paragraph | Table)[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [text(r.name.toUpperCase(), { ...ARIAL, bold: true, size: 52, spacing: 10 })] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: '1F1F1F', space: 8 } },
      children: [text(r.contact, { ...ARIAL, size: 20, color: '333333' })],
    }),
  ]
  if (r.objective) children.push(...heading('My Goal'), plain(r.objective, ARIAL))
  if (r.skills.length) children.push(...heading('What I Can Do'), columns(r.skills, 3, ARIAL))
  if (extrasTitle(r)) children.push(...heading(extrasTitle(r)), plain(extrasLine(r), ARIAL))
  if (r.availability) children.push(...heading('When I Can Work'), plain(r.availability, ARIAL))
  if (r.jobs.length) {
    children.push(...heading('Experience'))
    r.jobs.forEach((j, i) => {
      children.push(row([text(`${j.title || 'Volunteer'}, ${j.employer}`, { ...ARIAL, bold: true })], j.dates, ARIAL))
      children.push(...j.bullets.map((b) => bullet(b, ARIAL)))
      if (i < r.jobs.length - 1) children.push(new Paragraph({ spacing: { after: 60 }, children: [] }))
    })
  }
  children.push(...heading('Education'))
  for (const s of r.schools) {
    children.push(row([text(s.name, { ...ARIAL, bold: true })], s.dates, ARIAL))
    if (s.detail) children.push(plain(s.detail, ARIAL))
  }
  children.push(new Paragraph({ spacing: { before: 200 }, children: [text('References available on request.', { ...ARIAL, italics: true, color: '444444' })] }))
  return children
}
