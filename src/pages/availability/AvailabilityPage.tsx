import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { CommitmentsStep, HoursStep, SentenceStep, TimesStep } from './AvailabilitySteps'

const page = pageInfo('availability')

export function AvailabilityWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'Times I can work', intro: 'Tap every time that works. Pick start and end times if you know them.', content: <TimesStep /> },
      { title: 'Things that take my time', intro: 'TRACE classes, appointments, another job, family.', content: <CommitmentsStep /> },
      { title: 'Hours & getting there', content: <HoursStep /> },
      { title: 'What I\'ll write', intro: 'One sentence you can copy onto any job application.', content: <SentenceStep /> },
    ]} />
  )
}

export function AvailabilityPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.availability} />
}
