// The cover letter itself, laid out like the template on page 02.
import type { Packet } from '../../data/packet'
import { cityLine } from '../../data/format'
import { contactLine, fullName, greetingName, letterDate } from '../../data/derive'

interface LetterBodyProps {
  packet: Packet
  paragraphs: string[]
}

export function LetterBody({ packet, paragraphs }: LetterBodyProps) {
  const p = packet.profile
  const c = packet.pages.coverLetter
  const name = fullName(p) || '[Your Name]'
  const recipient = [c.hiringManager || 'Hiring Manager', c.company, c.companyStreet, cityLine(c.companyCity, c.companyState, c.companyZip)].filter(Boolean)
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[1.8em] leading-tight font-bold">{name}</p>
        <p className="text-[0.85em] text-slate-600">{contactLine(p)}</p>
      </div>
      <p>{letterDate(packet)}</p>
      <p>{recipient.map((line, i) => <span key={i}>{line}<br /></span>)}</p>
      <p>Dear {greetingName(c)},</p>
      {paragraphs.map((text, i) => <p key={i}>{text}</p>)}
      <p>Sincerely,<br /><br />{name}</p>
    </div>
  )
}
