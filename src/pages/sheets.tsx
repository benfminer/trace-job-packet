// The printed sheets for each page. Used by each page's print view and by Print all.
import type { Sheet } from '../components/sheet'
import type { PageId } from '../data/packet'
import { ResumeSheet } from './resume/ResumePrint'
import { BuilderSheet, LetterSheet } from './coverLetter/CoverLetterPrint'
import { AppInfoSheet } from './appInfo/AppInfoPrint'
import { EmployerReferencesSheet, ReferencesSheet } from './references/ReferencesPrint'
import { AvailabilitySheet } from './availability/AvailabilityPrint'
import { DocumentsSheet } from './documents/DocumentsPrint'
import { DisclosureSheet } from './disclosure/DisclosurePrint'
import { TransportationSheet } from './transportation/TransportationPrint'
import { SupportTeamSheet } from './supportTeam/SupportTeamPrint'
import { BenefitsSheet } from './benefits/BenefitsPrint'
import { InterviewDaySheet, IntroSheet, PracticeQuestionsSheet, QuizSheet } from './interview/InterviewPrint'
import { TrackerSheet } from './tracker/TrackerPrint'

export const PAGE_SHEETS: Record<Exclude<PageId, 'about'>, Sheet[]> = {
  resume: [{ name: 'Resume', content: <ResumeSheet /> }],
  coverLetter: [
    { name: 'Cover letter', content: <LetterSheet /> },
    { name: 'Builder worksheet', content: <BuilderSheet /> },
  ],
  appInfo: [{ name: 'Application Info Sheet', content: <AppInfoSheet /> }],
  references: [
    { name: 'Packet page', content: <ReferencesSheet /> },
    { name: 'Copy for employers', content: <EmployerReferencesSheet /> },
  ],
  availability: [{ name: 'Weekly Availability', content: <AvailabilitySheet /> }],
  documents: [{ name: 'Important Documents Checklist', content: <DocumentsSheet /> }],
  disclosure: [{ name: 'Disclosure and Accommodations', content: <DisclosureSheet /> }],
  transportation: [{ name: 'Transportation Plan', content: <TransportationSheet /> }],
  supportTeam: [{ name: 'My Support Team', content: <SupportTeamSheet /> }],
  benefits: [{ name: 'Benefits and Work', content: <BenefitsSheet /> }],
  interview: [
    { name: 'My introduction', content: <IntroSheet /> },
    { name: 'Practice questions', content: <PracticeQuestionsSheet /> },
    { name: 'Agree or disagree quiz', content: <QuizSheet /> },
    { name: 'Interview day', content: <InterviewDaySheet /> },
  ],
  tracker: [{ name: 'Job Search Tracker', content: <TrackerSheet />, landscape: true }],
}
