// The job the packet is aimed at: starting a new application, and keeping the tracker in step.
import { blankApplication, blankTarget, type Packet } from './packet'

// Places from jobSites.ts, so practice looks like the jobs students really get.
export const PRACTICE_JOBS = [
  { title: 'Store Associate', company: 'Smart & Final' },
  { title: 'Store Associate', company: 'CVS' },
  { title: 'Courtesy Clerk', company: 'Grocery Outlet' },
  { title: 'Park Services Attendant', company: 'SeaWorld' },
]

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Makes sure a real job is on the Job Search Tracker. Uses an empty row before adding one.
export function logTarget(d: Packet) {
  const t = d.target
  if (t.practice || !t.company.trim()) return
  const rows = d.pages.tracker.rows
  if (rows.some((r) => same(r.company, t.company) && same(r.title, t.title))) return
  const row = rows.find((r) => !Object.values(r).some(Boolean)) ?? rows[rows.push(blankApplication()) - 1]
  Object.assign(row, { company: t.company.trim(), title: t.title.trim() })
}

// Clears the answers that are about one job, so the next real job starts fresh.
// Experience, strengths, and everything else stay.
export function startNewApplication(d: Packet) {
  logTarget(d)
  d.target = { ...blankTarget(), practice: false }
  Object.assign(d.pages.coverLetter, { why: '', whenCanWork: '', letterDate: '', checklist: [], finalText: '' })
  Object.assign(d.pages.appInfo, { workedHereBefore: '', workedHereWhen: '', knowAnyone: '' })
  Object.assign(d.pages.interview, { interviewer: '', talkedAbout: '', howCompanyDate: '', wentWell: '', practiceNext: '' })
  d.pages.interview.answers.whyHere = ''
  // The new job needs its own letter.
  Object.assign(d.status.coverLetter, { done: false, date: '' })
}
