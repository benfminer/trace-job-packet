// Pieces shared by the Word versions of the three resume looks.
import { BorderStyle, LineRuleType, Paragraph, ShadingType, TabStopType, Table, TableCell, TableLayoutType, TableRow, TextRun, WidthType } from 'docx'

export const MARGIN = 864 // 0.6 inch, in twentieths of a point
export const RIGHT_EDGE = 10512 // 7.3 inches of text width

export const PAGE_MARGIN = { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }
// US Letter. The docx library uses A4 unless told otherwise.
export const LETTER = { width: 12240, height: 15840 }

export type TextOptions = { bold?: boolean; size?: number; color?: string; italics?: boolean; font?: string; spacing?: number }

export const text = (t: string, opts: TextOptions = {}) =>
  new TextRun({
    text: t, font: opts.font ?? 'Georgia', size: opts.size ?? 22, bold: opts.bold, color: opts.color, italics: opts.italics,
    characterSpacing: opts.spacing,
  })

export const bullet = (t: string, opts: TextOptions = {}) => new Paragraph({ bullet: { level: 0 }, children: [text(t, opts)] })
export const plain = (t: string, opts: TextOptions = {}) => new Paragraph({ children: [text(t, opts)] })

// Something on the left and the dates pushed to the right edge.
export const row = (left: TextRun[], right: string, opts: TextOptions = {}) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_EDGE }],
    children: [...left, text(`\t${right}`, { ...opts, color: '444444' })],
  })

// An empty line of an exact height (in twentieths of a point). Used for padding, because Word, Google Docs,
// and Pages don't agree on table cell margins or on shading the space around a paragraph.
export const spacer = (height: number, fill?: string) =>
  new Paragraph({
    spacing: { before: 0, after: 0, line: height, lineRule: LineRuleType.EXACT },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: 'auto' } : undefined,
    children: [],
  })

// Two lists side by side without a table: each line holds one item from each half, lined up with a tab.
export function pairedBullets(items: string[], tabAt: number, opts: TextOptions = {}) {
  const half = Math.ceil(items.length / 2)
  return items.slice(0, half).map((left, i) => {
    const right = items[half + i]
    return new Paragraph({
      tabStops: [{ type: TabStopType.LEFT, position: tabAt }],
      children: [text(`\u2022  ${left}` + (right ? `\t\u2022  ${right}` : ''), opts)],
    })
  })
}

export const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
export const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER }

// Table sizes are set in twentieths of a point, not percent. Google Docs and Quick Look ignore percent widths.
export const fixedWidth = (size: number) => ({ size, type: WidthType.DXA })

// A list in columns that read top to bottom, as a table with no borders so it stays easy to edit.
// `total` is how wide the table is.
export function columns(items: string[], count: number, opts: TextOptions = {}, total = RIGHT_EDGE) {
  const per = Math.ceil(items.length / count)
  const each = Math.floor(total / count)
  const cell = (list: string[]) =>
    new TableCell({ width: fixedWidth(each), children: list.length ? list.map((i) => bullet(i, opts)) : [plain('', opts)] })
  return new Table({
    width: fixedWidth(each * count),
    columnWidths: Array.from({ length: count }, () => each),
    layout: TableLayoutType.FIXED,
    borders: NO_BORDERS,
    rows: [new TableRow({ children: Array.from({ length: count }, (_, i) => cell(items.slice(i * per, (i + 1) * per))) })],
  })
}
