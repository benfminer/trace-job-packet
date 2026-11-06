import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { HelpsStep, RightsStep, SayStep, ShouldTellStep, WhenStep } from './DisclosureSteps'

const page = pageInfo('disclosure')

export function DisclosureWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'My rights', content: <RightsStep /> },
      { title: 'Should I tell?', intro: 'Pick any that fit you. You can pick from both lists.', content: <ShouldTellStep /> },
      { title: 'When could I tell?', content: <WhenStep /> },
      { title: 'What helps me', content: <HelpsStep /> },
      { title: 'What I can say', intro: 'Words you can use with an employer. Practice them out loud.', content: <SayStep /> },
    ]} />
  )
}

export function DisclosurePrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.disclosure} />
}
