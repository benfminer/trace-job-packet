// Page 2 of the blank resume template: a worksheet to plan the resume on paper,
// laid out like the Cover Letter Builder.
import { BorderStyle, HeightRule, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType } from 'docx'
import { SKILL_IDEAS } from '../data/resume'

const BLUE = '1E88D2'
const LINE = { style: BorderStyle.SINGLE, size: 4, color: 'B8CDE0' }
const BORDERS = { top: LINE, bottom: LINE, left: LINE, right: LINE, insideHorizontal: LINE, insideVertical: LINE }

const arial = (t: string, opts: { bold?: boolean; size?: number; color?: string } = {}) =>
  new TextRun({ text: t, font: 'Arial', size: opts.size ?? 20, bold: opts.bold, color: opts.color ?? '1F1F1F' })

const section = (num: string, title: string, note = '') =>
  new Paragraph({
    spacing: { before: 200, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: BLUE, space: 2 } },
    children: [arial(num ? `${num}  ${title}` : title, { bold: true, size: 22, color: BLUE }), arial(note ? `  ${note}` : '', { size: 18, color: '444444' })],
  })

// A label on the left in light blue, an empty box to write in on the right.
const writeIn = (rows: [string, string?][], height = 460) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: BORDERS,
    rows: rows.map(([label, sub]) => new TableRow({
      height: { value: height, rule: HeightRule.ATLEAST },
      children: [
        new TableCell({
          width: { size: 32, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: 'EEF5FB', color: 'auto' },
          children: [new Paragraph({ children: [arial(label, { bold: true, color: '444444' })] }),
            ...(sub ? [new Paragraph({ children: [arial(sub, { size: 17, color: '6B6B6B' })] })] : [])],
        }),
        new TableCell({ width: { size: 68, type: WidthType.PERCENTAGE }, children: [new Paragraph('')] }),
      ],
    })),
  })

const skillGrid = () => {
  const cells = [...SKILL_IDEAS, 'Reliable', 'Friendly', 'Hard worker', 'On time', 'Other: ________']
  const rows = [cells.slice(0, 5), cells.slice(5, 10), cells.slice(10, 15)]
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: BORDERS,
    rows: rows.map((r) => new TableRow({
      height: { value: 400, rule: HeightRule.ATLEAST },
      children: r.map((c) => new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [arial(c, { size: 19 })] })] })),
    })),
  })
}

const CHECKLIST = [
  'It fits on one page', 'My phone number and email are correct', 'Every bullet starts with an action word',
  'Dates are written like 06/2025', 'Spell check is done', 'My teacher or job coach checked it',
  'Saved as a PDF named "First Last Resume"',
]

export function resumeBuilderPage() {
  return [
    new Paragraph({ pageBreakBefore: true, children: [new TextRun({ text: 'Resume Builder', font: 'Georgia', size: 48, bold: true, color: '1F1F1F' })] }),
    new Paragraph({
      spacing: { after: 60 },
      children: [arial('PLAN IT FIRST, THEN TYPE IT INTO THE TEMPLATE', { bold: true, size: 18, color: BLUE }),
        arial('     Name: ______________________   Date: ___________', { size: 18, color: '444444' })],
    }),
    section('1', 'MY GOAL', 'This becomes your Objective.'),
    writeIn([['The job I want'], ['Skills I want to use']], 420),
    section('2', 'MY SKILLS', 'Circle 4 or more, or write your own.'),
    skillGrid(),
    section('3', 'MY JOBS', 'Jobs, volunteer work, and TRACE work sites all count. Start with the most recent.'),
    writeIn([['Job #1', 'title, place, dates'], ['What I did', '3 things, each starting with an action word'], ['Job #2', 'title, place, dates'], ['What I did', '3 things, each starting with an action word']], 520),
    section('4', 'SCHOOL AND MORE'),
    writeIn([['High school and year'], ['Diploma or certificate?'], ['Certifications', 'and the month/year earned'], ['Languages I speak']], 400),
    section('', 'BEFORE YOU SEND IT'),
    ...CHECKLIST.map((c, i) => new Paragraph({
      shading: { type: ShadingType.CLEAR, fill: 'FFF7E0', color: 'auto' },
      border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'F2B632', space: 6 } },
      spacing: { before: i === 0 ? 80 : 0 },
      children: [arial(`☐ ${c}`)],
    })),
  ]
}
