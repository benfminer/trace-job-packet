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

export const pageInfo = (id: PageId) => PAGES.find((p) => p.id === id)!
