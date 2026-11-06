import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { CheckInfoStep, JobWantedStep, QuestionsStep } from './AppInfoSteps'

const page = pageInfo('appInfo')

export function AppInfoWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'Check my info', intro: 'Your contact info, school, and work history come from About Me.', content: <CheckInfoStep /> },
      { title: 'The job I want', content: <JobWantedStep /> },
      { title: 'Application questions', content: <QuestionsStep /> },
    ]} />
  )
}

export function AppInfoPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.appInfo} />
}
