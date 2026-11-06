import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { ApplicationsStep } from './TrackerSteps'

const page = pageInfo('tracker')

export function TrackerWizard() {
  return <Wizard page={page} steps={[{ title: 'Every job I apply for', content: <ApplicationsStep /> }]} />
}

export function TrackerPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.tracker} />
}
