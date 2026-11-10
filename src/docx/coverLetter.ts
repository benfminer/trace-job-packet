// Builds an editable Word copy of the cover letter.
import { Document, Packer, Paragraph, TextRun } from 'docx'
import type { Packet } from '../data/packet'
import { LETTER } from './resume'
import { contactLine, coverLetterParagraphs, fullName, greetingName, letterDate, recipientLines, wordFileName } from '../data/derive'

const FONT = 'Georgia'
const line = (text: string, opts: { size?: number; bold?: boolean; color?: string; after?: number } = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 0 },
    children: [new TextRun({ text, font: FONT, size: opts.size ?? 22, bold: opts.bold, color: opts.color })],
  })

export function buildCoverLetterDoc(packet: Packet) {
  const p = packet.profile
  const t = packet.target
  const name = fullName(p) || '[Your Name]'
  const recipient = recipientLines(t)

  return new Document({
    creator: 'TRACE Job Packet',
    title: `${name} Cover Letter`,
    sections: [{
      properties: { page: { size: LETTER, margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 } } },
      children: [
        line(name, { size: 40, bold: true }),
        line(contactLine(p), { size: 19, color: '444444', after: 360 }),
        line(letterDate(packet), { after: 240 }),
        ...recipient.map((r, i) => line(r, { after: i === recipient.length - 1 ? 240 : 0 })),
        line(`Dear ${greetingName(t)},`, { after: 200 }),
        ...coverLetterParagraphs(packet).map((text) => line(text, { after: 200 })),
        line('Sincerely,', { after: 480 }),
        line(name),
      ],
    }],
  })
}

export const coverLetterFileName = (packet: Packet) => wordFileName(packet, 'Cover Letter')

export const coverLetterBlob = (packet: Packet) => Packer.toBlob(buildCoverLetterDoc(packet))
