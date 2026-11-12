// Turns the packet into resume content. The print view and the Word file both use this.
import type { Packet, ResumeLayout } from './packet'
import { availabilitySentence, contactLine, fullName } from './derive'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// "Stocked shelves, faced products, and helped customers" -> three bullet points.
export function splitDuties(duties: string) {
  const text = duties.trim().replace(/\.$/, '')
  if (!text) return []
  const parts = /[\n;]/.test(text) ? text.split(/[\n;]+/) : text.split(/,\s*/)
  return parts.map((p) => capitalize(p.trim().replace(/^and\s+/i, '').replace(/\.$/, ''))).filter(Boolean)
}

export const SKILL_IDEAS = [
  'Customer service', 'Stocking shelves', 'Cleaning and organizing', 'Cash register', 'Food prep',
  'Following a schedule', 'Working on a team', 'Computer and email', 'Sorting and packing', 'Safe lifting',
]

// The three looks a resume can print in. The first one is what a new packet starts with.
export const RESUME_LAYOUTS: { id: ResumeLayout; name: string; bestFor: string }[] = [
  { id: 'classic', name: 'Classic', bestFor: 'A traditional look. Good when you have two or more jobs to show.' },
  { id: 'skills', name: 'Skills First', bestFor: 'Your skills go on top. Good when you have one job, or work sites and volunteering.' },
  { id: 'side', name: 'Side Labels', bestFor: 'A modern look with a dark band for your name. Uses more ink.' },
]

// The look saved in the packet. A file with a look this app doesn't know prints as Classic.
export const resumeLayout = (packet: Packet): ResumeLayout =>
  RESUME_LAYOUTS.find((l) => l.id === packet.pages.resume.layout)?.id ?? 'classic'

export type ResumeJob = { title: string; employer: string; dates: string; bullets: string[] }
export type ResumeSchool = { name: string; detail: string; dates: string }

export function resumeContent(packet: Packet) {
  const p = packet.profile
  const r = packet.pages.resume

  const jobs: ResumeJob[] = p.jobs
    .map((j, i) => ({
      title: j.title,
      employer: j.employer,
      dates: [j.start, j.end].filter(Boolean).join(' – '),
      bullets: (r.bullets[i] ?? '').split('\n').map((b) => b.trim()).filter(Boolean),
    }))
    .filter((j) => j.employer)

  const schools: ResumeSchool[] = [
    {
      name: 'TRACE, San Diego Unified',
      detail: p.traceWorkingOn ? `Transition program: ${p.traceWorkingOn}` : 'Transition program',
      dates: p.traceStart ? `${p.traceStart} – Present` : '',
    },
  ]
  if (p.hsName) {
    const credential = p.hsCredential === 'diploma' ? 'High School Diploma' : p.hsCredential === 'certificate' ? 'Certificate of Completion' : ''
    schools.push({ name: p.hsName, detail: credential, dates: p.hsYear })
  }

  return {
    name: fullName(p) || '[Your Name]',
    contact: contactLine(p),
    objective: r.objective.trim(),
    skills: [...r.skills, ...p.strengths.filter((s) => !r.skills.includes(s))],
    jobs,
    schools,
    certifications: p.certifications.filter((c) => c.name).map((c) => (c.earned ? `${c.name} (${c.earned})` : c.name)),
    languages: r.languages.trim(),
    availability: r.showAvailability ? availabilitySentence(p) : '',
  }
}

export type ResumeContent = ReturnType<typeof resumeContent>

// Skills First puts certifications and languages on one line.
// "Certifications and Languages", or just the one the student has.
export const extrasTitle = (r: ResumeContent) =>
  [r.certifications.length > 0 && 'Certifications', r.languages && 'Languages'].filter(Boolean).join(' and ')

// "Food Handler Card (09/2025)  •  Speaks English and Spanish"
export const extrasLine = (r: ResumeContent) =>
  [...r.certifications, r.languages && `Speaks ${r.languages}`].filter(Boolean).join('  •  ')
