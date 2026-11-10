import { ClipboardCopy } from 'lucide-react'
import { pageInfo } from '../../data/pages'
import { useStore } from '../../data/store'
import { btnSecondary } from '../../components/styles'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { CheckInfoStep, JobWantedStep, QuestionsStep, ThisJobStep } from './AppInfoSteps'

const page = pageInfo('appInfo')

export function AppInfoWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'Check my info', intro: 'Your contact info, school, and work history come from About Me.', content: <CheckInfoStep /> },
      { title: 'The job I want', content: <JobWantedStep /> },
      { title: 'Application questions', content: <QuestionsStep /> },
      { title: 'About this job', intro: 'These answers change with each company.', content: <ThisJobStep /> },
    ]} />
  )
}

export function AppInfoPrintView() {
  const { go } = useStore()
  return (
    <PrintShell page={page} sheets={PAGE_SHEETS.appInfo} extraButtons={
      <button type="button" onClick={() => go({ view: 'apply' })} className={btnSecondary}>
        <ClipboardCopy aria-hidden className="size-5" />Applying now: copy my answers
      </button>
    } />
  )
}
