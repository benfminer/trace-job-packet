// The Side Labels look as a Word file: a navy band for the name, then a two-column table with the
// section names on the left and the details on the right.
import { BorderStyle, Paragraph, ShadingType, Table, TableCell, TableLayoutType, TableRow } from 'docx'
import type { ResumeContent } from '../data/resume'
import { bullet, fixedWidth, NO_BORDER, NO_BORDERS, pairedBullets, RIGHT_EDGE, spacer, text, type TextOptions } from './resumeParts'

const NAVY = '17324D'
const VERDANA: TextOptions = { font: 'Verdana', size: 19 }
const LINE = { style: BorderStyle.SINGLE, size: 6, color: 'D3DDE8' }
// The section names get a narrow column on the left. The details get the rest.
const LABEL_WIDTH = 2300
const DETAIL_WIDTH = RIGHT_EDGE - LABEL_WIDTH

const para = (t: string, opts: TextOptions = {}) => new Paragraph({ children: [text(t, { ...VERDANA, ...opts })] })

// A full-width colored box. Empty lines above and below and an indent give the words room.
const box = (fill: string, pad: number, children: Paragraph[]) =>
  new TableRow({
    children: [new TableCell({
      width: fixedWidth(RIGHT_EDGE),
      shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
      children: [spacer(pad), ...children, spacer(pad)],
    })],
  })

const INDENT = { left: 240, right: 240 }

type CellContent = Paragraph | Table

const PAD = 130
const sectionBorders = (last: boolean) => ({ top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, bottom: last ? NO_BORDER : LINE })

// One section: its name on the left, its details on the right, and a thin line under it.
const section = (label: string, content: CellContent[], last = false) =>
  new TableRow({
    children: [
      new TableCell({
        width: fixedWidth(LABEL_WIDTH),
        borders: sectionBorders(last),
        children: [spacer(PAD), para(label.toUpperCase(), { bold: true, size: 17, color: NAVY, spacing: 16 })],
      }),
      new TableCell({
        width: fixedWidth(DETAIL_WIDTH),
        borders: sectionBorders(last),
        children: [spacer(PAD), ...content, spacer(PAD)],
      }),
    ],
  })

const gap = () => new Paragraph({ spacing: { after: 80 }, children: [] })

export function sideLabelsBody(r: ResumeContent) {
  const band = new Table({
    width: fixedWidth(RIGHT_EDGE),
    columnWidths: [RIGHT_EDGE],
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [
      box(NAVY, 260, [
        new Paragraph({ indent: INDENT, children: [text(r.name, { font: 'Verdana', bold: true, size: 46, color: 'FFFFFF' })] }),
        ...(r.objective ? [new Paragraph({ indent: INDENT, spacing: { before: 80 }, children: [text(r.objective, { ...VERDANA, color: 'D5E2EF' })] })] : []),
      ]),
      box('E8EFF6', 90, [new Paragraph({ indent: INDENT, children: [text(r.contact, { ...VERDANA, size: 18, color: NAVY })] })]),
    ],
  })

  const sections: [string, CellContent[]][] = []
  // No table inside the table for the two skill columns: Pages and some online application sites scramble those.
  if (r.skills.length) sections.push(['Skills', pairedBullets(r.skills, Math.floor(DETAIL_WIDTH / 2), VERDANA)])
  if (r.jobs.length) {
    sections.push(['Experience', r.jobs.flatMap((j, i) => [
      new Paragraph({ children: [text(j.title || 'Volunteer', { ...VERDANA, bold: true }), text(`, ${j.employer}`, VERDANA)] }),
      ...(j.dates ? [para(j.dates, { size: 18, color: '555555' })] : []),
      ...j.bullets.map((b) => bullet(b, VERDANA)),
      ...(i < r.jobs.length - 1 ? [gap()] : []),
    ])])
  }
  sections.push(['Education', r.schools.flatMap((s, i) => [
    para(s.name, { bold: true }),
    ...(s.dates ? [para(s.dates, { size: 18, color: '555555' })] : []),
    ...(s.detail ? [para(s.detail)] : []),
    ...(i < r.schools.length - 1 ? [gap()] : []),
  ])])
  if (r.certifications.length) sections.push(['Certifications', [para(r.certifications.join('  |  '))]])
  if (r.languages) sections.push(['Languages', [para(r.languages)]])
  if (r.availability) sections.push(['Availability', [para(r.availability)]])
  sections.push(['References', [para('Available on request.')]])

  return [
    band,
    spacer(60),
    new Table({
      width: fixedWidth(RIGHT_EDGE),
      columnWidths: [LABEL_WIDTH, DETAIL_WIDTH],
      layout: TableLayoutType.FIXED,
      borders: NO_BORDERS,
      rows: sections.map(([label, content], i) => section(label, content, i === sections.length - 1)),
    }),
  ]
}
