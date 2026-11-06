// "01 Resume Template": the paper version of page 01, made to match the Cover Letter Template.
// Page 1 is the resume with [bracket] blanks, page 2 is the Resume Builder, page 3 is an example.
import { AlignmentType, BorderStyle, Document, Footer, Paragraph, ShadingType, TextRun } from 'docx'
import type { Packet } from '../data/packet'
import { resumeContent, splitDuties } from '../data/resume'
import { samplePacket } from '../data/sample'
import { LETTER, PAGE_MARGIN, resumeBody, type ResumeContent } from './resume'
import { resumeBuilderPage } from './resumeBuilder'

const DOING = '[Action verb + task, e.g., '

const BLANK: ResumeContent = {
  name: '[Your Name]',
  contact: '[Street Address], [City, State ZIP]  |  [(555) 555-5555]  |  [you@email.com]',
  objective: 'To work as a [job title] where I can use my [skill] and [skill] skills.',
  skills: ['[Skill, e.g., Customer service]', '[Skill, e.g., Stocking shelves]', '[Skill]', '[Strength, e.g., Reliable]', '[Strength, e.g., Friendly]', '[Strength]'],
  jobs: [
    { title: '[Job Title]', employer: '[Employer]', dates: '[MM/YYYY] – [MM/YYYY or Present]',
      bullets: [`${DOING}Stocked shelves and faced products]`, `${DOING}Helped customers find items]`, '[Action verb + task]'] },
    { title: '[Job Title or Volunteer]', employer: '[TRACE work site or volunteer place]', dates: '[MM/YYYY] – [MM/YYYY]',
      bullets: [`${DOING}Sorted and packed donations]`, '[Action verb + task]'] },
  ],
  schools: [
    { name: 'TRACE, San Diego Unified', detail: "Transition program: [what you're working on, e.g., job skills, travel training]", dates: '[Month Year] – Present' },
    { name: '[High School Name]', detail: '[High School Diploma or Certificate of Completion]', dates: '[Year]' },
  ],
  certifications: ['[Certification, e.g., Food Handler Card] ([MM/YYYY])', '[Certification] ([MM/YYYY])'],
  languages: '[Languages you speak, e.g., English and Spanish]',
  availability: '[Days and times, e.g., Monday through Friday after 2:00 PM and weekends]',
}

function exampleContent() {
  const p: Packet = samplePacket()
  p.pages.resume.bullets = p.profile.jobs.map((j) => splitDuties(j.duties).join('\n'))
  return resumeContent(p)
}

const exampleNote = () =>
  new Paragraph({
    pageBreakBefore: true,
    spacing: { after: 160 },
    shading: { type: ShadingType.CLEAR, fill: 'EEF5FB', color: 'auto' },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: '1E88D2', space: 6 } },
    children: [
      new TextRun({ text: 'EXAMPLE.', font: 'Arial', size: 20, bold: true }),
      new TextRun({ text: ' This is a sample resume for a made-up student. Use it as a model, not a copy.', font: 'Arial', size: 20 }),
    ],
  })

const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'TRACE Job Readiness Packet  |  Resume Template', font: 'Arial', size: 16, color: '808080' })],
  })],
})

export function buildResumeTemplate() {
  return new Document({
    creator: 'TRACE',
    title: 'Resume Template',
    sections: [{
      properties: { page: { size: LETTER, margin: PAGE_MARGIN } },
      footers: { default: footer },
      children: [...resumeBody(BLANK), ...resumeBuilderPage(), exampleNote(), ...resumeBody(exampleContent())],
    }],
  })
}
