// Text that is built from the packet answers (names, availability sentence, cover letter).
import { DAYS, type DayAvailability, type Packet, type Target } from './packet'
import { cityLine } from './format'

type Profile = Packet['profile']

export const fullName = (p: Profile) => [p.firstName, p.lastName].filter(Boolean).join(' ')

// "Jordan Lee Resume.docx"
export const wordFileName = (packet: Packet, kind: 'Resume' | 'Cover Letter') =>
  `${fullName(packet.profile) || 'Student'} ${kind}.docx`

export const cityStateZip = (p: Profile) =>
  [p.city, [p.state, p.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')

export const streetLine = (p: Profile) => [p.street, p.apt && `#${p.apt.replace(/^#/, '')}`].filter(Boolean).join(' ')

export const formatDate = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export const shortDate = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })
}

// Joins a list the way people write it: "A", "A and B", "A, B, and C".
export function joinList(items: string[], word = 'and') {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} ${word} ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, ${word} ${items[items.length - 1]}`
}

function slotPhrase(d: DayAvailability) {
  if (d.earliest && d.latest) return `from ${d.earliest} to ${d.latest}`
  if (d.earliest) return `after ${d.earliest}`
  if (d.latest) return `until ${d.latest}`
  const slots = (['morning', 'afternoon', 'evening'] as const).filter((s) => d[s])
  if (slots.length === 3) return 'all day'
  return joinList(slots.map((s) => s + 's'))
}

// "Monday through Friday after 2:00 PM, and Saturday and Sunday all day"
export function summarizeAvailability(availability: Profile['availability']) {
  const groups: { days: string[]; phrase: string }[] = []
  for (const day of DAYS) {
    const d = availability[day]
    if (!d.morning && !d.afternoon && !d.evening && !d.earliest && !d.latest) continue
    const phrase = slotPhrase(d)
    const last = groups[groups.length - 1]
    const prevDay = DAYS[DAYS.indexOf(day) - 1]
    if (last && last.phrase === phrase && last.days[last.days.length - 1] === prevDay) last.days.push(day)
    else groups.push({ days: [day], phrase })
  }
  const parts = groups.map(({ days, phrase }) => {
    const label = days.length >= 3 ? `${days[0]} through ${days[days.length - 1]}` : joinList(days)
    return `${label} ${phrase}`
  })
  return joinList(parts)
}

export const availabilitySentence = (p: Profile) => p.availabilityText || summarizeAvailability(p.availability)

// Strengths from the handout, written so they fit "I am ___".
export const STRENGTHS = [
  'Reliable', 'Punctual', 'Team player', 'Hard worker', 'Friendly', 'Fast learner',
  'Organized', 'Patient', 'Follows directions',
]
const STRENGTH_PHRASES: Record<string, string> = {
  'team player': 'a team player',
  'hard worker': 'a hard worker',
  'fast learner': 'a fast learner',
  'follows directions': 'good at following directions',
}
export const strengthPhrase = (s: string) => STRENGTH_PHRASES[s.trim().toLowerCase()] ?? s.trim().toLowerCase()

// For phrases that follow "I ..." (verbs like "Stocked shelves"). Leaves "I" and acronyms alone.
const lowerFirst = (s: string) => s.trim().replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase())
const noEndPeriod = (s: string) => s.trim().replace(/[.\s]+$/, '')

// Wording pasted back after polishing, split into paragraphs. Only the body is kept: a label, greeting,
// sign-off, or Gemini's notes pasted along with it are dropped.
export function finalLetterParagraphs(text: string) {
  const clean = text.replace(/\*\*/g, '').replace(/^\s*\[?MY LETTER\]?:?\s*$/im, '').trim()
  if (!clean) return []
  const blocks = (/\n\s*\n/.test(clean) ? clean.split(/\n\s*\n/) : clean.split('\n'))
    .map((b) => b.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean)
  const isEnd = (b: string) => b.length < 60 && /^\[?(sincerely|best regards|regards|thank you|what i changed|questions)\b/i.test(b)
  const end = blocks.findIndex(isEnd)
  return (end === -1 ? blocks : blocks.slice(0, end)).filter((b) => !(b.length < 60 && /^dear\b/i.test(b)))
}

// "being reliable", "being a team player": strengths written to follow "My strengths are".
const beingPhrase = (s: string) => `being ${strengthPhrase(s)}`

// The body paragraphs of the cover letter. They start from the template on page 02, with the sentence
// openings varied so they don't all begin with "I". A final letter the student pasted in wins.
export function coverLetterParagraphs(packet: Packet) {
  const p = packet.profile
  const c = packet.pages.coverLetter
  const final = finalLetterParagraphs(c.finalText)
  if (final.length) return final
  const t = packet.target
  const name = fullName(p) || '[Your Name]'
  const job = t.title || '[Job Title]'
  const company = t.company || '[Company Name]'

  const p1 = `My name is ${name}, and I am applying for the ${job} position at ${company}.` +
    (t.whereFound ? ` I found this job on ${noEndPeriod(t.whereFound)}.` : '')

  const p2parts: string[] = []
  if (c.experienceWith) p2parts.push(`I have experience ${lowerFirst(noEndPeriod(c.experienceWith))}.`)
  if (c.place1 && c.did1) p2parts.push(`At ${c.place1}, I ${lowerFirst(noEndPeriod(c.did1))}.`)
  if (c.place2 && c.did2) {
    // After a first place, the second one turns around so two sentences in a row don't match.
    p2parts.push(c.place1 && c.did1 ? `I also ${lowerFirst(noEndPeriod(c.did2))} at ${c.place2}.` : `At ${c.place2}, I ${lowerFirst(noEndPeriod(c.did2))}.`)
  }
  const picked = c.strengths.filter(Boolean)
  const strengths = picked.length === 1 ? `One of my strengths is ${beingPhrase(picked[0])}` : `My strengths are ${joinList(picked.map(beingPhrase))}`
  if (picked.length && c.doWell) {
    p2parts.push(`${strengths}, and I ${lowerFirst(noEndPeriod(c.doWell))}.`)
  } else if (picked.length) {
    p2parts.push(`${strengths}.`)
  } else if (c.doWell) {
    p2parts.push(`I ${lowerFirst(noEndPeriod(c.doWell))}.`)
  }

  const p3 = c.why ? `I want to work at ${company} because ${noEndPeriod(c.why)}.` : ''

  const when = c.whenCanWork || availabilitySentence(p)
  const reach = joinList([p.cellPhone, p.email].filter(Boolean), 'or')
  const p4 = (when ? `I am available to work ${noEndPeriod(when)}. ` : '') +
    'Thank you for your time and consideration. I look forward to hearing from you.' +
    (reach ? ` You can reach me at ${reach}.` : '')

  return [p1, p2parts.join(' '), p3, p4].filter(Boolean)
}

export const greetingName = (t: Target) => t.hiringManager.trim() || 'Hiring Team'

// The address block at the top of the cover letter.
export const recipientLines = (t: Target) =>
  [t.hiringManager.trim() || 'Hiring Manager', t.company, t.street, cityLine(t.city, t.state, t.zip)].filter(Boolean)

// "Store Associate at Smart & Final"
export const targetLabel = (t: Pick<Target, 'title' | 'company'>) => [t.title, t.company].filter(Boolean).join(' at ')

// "1234 Main Street, San Diego, CA 92105  |  (619) 555-0142  |  jordan@email.com"
export const contactLine = (p: Profile) =>
  [[streetLine(p), cityStateZip(p)].filter(Boolean).join(', '), p.cellPhone, p.email].filter(Boolean).join('  |  ')

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const letterDate = (packet: Packet) => formatDate(packet.pages.coverLetter.letterDate || todayIso())

// "2026-11-01" plus 7 days is "2026-11-08". Used for the tracker's follow-up date.
export function addDays(iso: string, days: number) {
  const d = new Date(iso + 'T12:00:00')
  if (isNaN(d.getTime())) return ''
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const withStart = (start: string, rest: string) => {
  const r = noEndPeriod(rest)
  if (!r) return ''
  return r.toLowerCase().startsWith(start.toLowerCase()) ? `${r}.` : `${start} ${lowerFirst(r)}.`
}

// The 30-second introduction from page 11, read as one paragraph.
export function introText(i: Packet['pages']['interview']) {
  return [
    i.introName && `Hi, my name is ${noEndPeriod(i.introName)}.`,
    withStart('Right now I am', i.introNow),
    withStart('I have experience', i.introExperience),
    withStart('I am good at', i.introGoodAt),
    withStart('I want this job because', i.introWhy),
  ].filter(Boolean).join(' ')
}

// The thank-you note from page 11, with blanks left as [brackets] so the student sees what's missing.
export function thankYouText(packet: Packet) {
  const i = packet.pages.interview
  const p = packet.profile
  const t = packet.target
  const lines = [
    `Hi ${i.interviewer || "[Interviewer's Name]"},`,
    `Thank you for meeting with me today about the ${t.title || '[Job Title]'} position. ` +
      `I enjoyed learning about ${i.talkedAbout ? noEndPeriod(i.talkedAbout) : '[something you talked about]'}. ` +
      `I am excited about the chance to work at ${t.company || '[Company Name]'}.`,
    'Have a great day!',
    [fullName(p) || '[Your Name]', p.cellPhone || '[Your Phone Number]'].join('\n'),
  ]
  return lines.join('\n\n')
}
