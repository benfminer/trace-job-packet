import type { PageId } from './packet'

export type PageInfo = { id: PageId; num: string; title: string; purpose: string; ready: boolean }

// Same order and wording as the cover page contents table.
export const PAGES: PageInfo[] = [
  { id: 'about', num: '', title: 'About Me', purpose: 'My info, school, and work history. Used on every page.', ready: true },
  { id: 'resume', num: '1', title: 'Resume', purpose: 'My work history and skills on one page', ready: true },
  { id: 'coverLetter', num: '2', title: 'Cover Letter', purpose: 'A letter that goes with my resume', ready: true },
  { id: 'appInfo', num: '3', title: 'Online Application Info Sheet', purpose: 'All my info for filling out applications', ready: true },
  { id: 'references', num: '4', title: 'References', purpose: "People who can say I'm a good worker", ready: true },
  { id: 'availability', num: '5', title: 'Weekly Availability', purpose: 'The days and times I can work', ready: true },
  { id: 'documents', num: '6', title: 'Important Documents Checklist', purpose: 'IDs and papers I need when I get hired', ready: true },
  { id: 'disclosure', num: '7', title: 'Disclosure and Accommodations', purpose: 'What helps me do my best work', ready: true },
  { id: 'transportation', num: '8', title: 'Transportation Plan', purpose: 'How I get to work and back', ready: true },
  { id: 'supportTeam', num: '9', title: 'My Support Team', purpose: 'People and agencies who help me', ready: true },
  { id: 'benefits', num: '10', title: 'Benefits and Work', purpose: 'Working and keeping my benefits', ready: true },
  { id: 'interview', num: '11', title: 'Interview Prep', purpose: 'Practice for interviews and online quizzes', ready: true },
  { id: 'tracker', num: '12', title: 'Job Search Tracker', purpose: 'Every job I apply for', ready: true },
]

// Home shows the pages in the order that works best, not in handout-number order.
export const GROUPS: { title: string; note: string; ids: PageId[] }[] = [
  { title: 'Start here', note: 'These two fill in the rest of the packet.', ids: ['about', 'availability'] },
  { title: 'Get ready', note: 'Do these once. They work for any job.',
    ids: ['resume', 'appInfo', 'references', 'documents', 'disclosure', 'transportation', 'supportTeam', 'benefits', 'interview'] },
  { title: 'For this job', note: 'These change with each job you apply for.', ids: ['coverLetter', 'tracker'] },
]

export const pageInfo = (id: PageId) => PAGES.find((p) => p.id === id)!

export const WORK_ORDER = GROUPS.flatMap((g) => g.ids).map(pageInfo)

// The next page that isn't done yet, starting after `after` and wrapping around. Undefined when all are done.
export function nextPage(status: Record<PageId, { done: boolean }>, after?: PageId) {
  const start = after ? WORK_ORDER.findIndex((p) => p.id === after) + 1 : 0
  return [...WORK_ORDER.slice(start), ...WORK_ORDER.slice(0, start)].find((p) => p.id !== after && !status[p.id].done)
}
