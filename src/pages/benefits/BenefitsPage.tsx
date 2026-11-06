import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { GetNowStep, GoodToKnowStep, ReportingStep } from './BenefitsSteps'

const page = pageInfo('benefits')

export function BenefitsWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'Benefits I get now', content: <GetNowStep /> },
      { title: 'Good things to know', intro: 'General information only. A benefits counselor can explain your own situation.', content: <GoodToKnowStep /> },
      { title: 'Reporting my pay', content: <ReportingStep /> },
    ]} />
  )
}

export function BenefitsPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.benefits} />
}
