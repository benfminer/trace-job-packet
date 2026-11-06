// Which wizard and print view belong to each page.
import type { ComponentType } from 'react'
import { AboutWizard } from './about/AboutWizard'
import { AppInfoPrintView, AppInfoWizard } from './appInfo/AppInfoPage'
import { AvailabilityPrintView, AvailabilityWizard } from './availability/AvailabilityPage'
import { CoverLetterPrintView, CoverLetterWizard } from './coverLetter/CoverLetterPage'
import { ReferencesPrintView, ReferencesWizard } from './references/ReferencesPage'
import { ResumePrintView, ResumeWizard } from './resume/ResumePage'
import { DocumentsPrintView, DocumentsWizard } from './documents/DocumentsPage'
import { DisclosurePrintView, DisclosureWizard } from './disclosure/DisclosurePage'
import { TransportationPrintView, TransportationWizard } from './transportation/TransportationPage'
import { SupportTeamPrintView, SupportTeamWizard } from './supportTeam/SupportTeamPage'
import { BenefitsPrintView, BenefitsWizard } from './benefits/BenefitsPage'
import { InterviewPrintView, InterviewWizard } from './interview/InterviewPage'
import { TrackerPrintView, TrackerWizard } from './tracker/TrackerPage'

interface PageViews {
  Edit: ComponentType
  Print?: ComponentType
}

export const PAGE_VIEWS: Record<string, PageViews> = {
  about: { Edit: AboutWizard },
  resume: { Edit: ResumeWizard, Print: ResumePrintView },
  coverLetter: { Edit: CoverLetterWizard, Print: CoverLetterPrintView },
  appInfo: { Edit: AppInfoWizard, Print: AppInfoPrintView },
  references: { Edit: ReferencesWizard, Print: ReferencesPrintView },
  availability: { Edit: AvailabilityWizard, Print: AvailabilityPrintView },
  documents: { Edit: DocumentsWizard, Print: DocumentsPrintView },
  disclosure: { Edit: DisclosureWizard, Print: DisclosurePrintView },
  transportation: { Edit: TransportationWizard, Print: TransportationPrintView },
  supportTeam: { Edit: SupportTeamWizard, Print: SupportTeamPrintView },
  benefits: { Edit: BenefitsWizard, Print: BenefitsPrintView },
  interview: { Edit: InterviewWizard, Print: InterviewPrintView },
  tracker: { Edit: TrackerWizard, Print: TrackerPrintView },
}
