import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { ReferenceStep, UsesStep } from './ReferencesSteps'

const page = pageInfo('references')

export function ReferencesWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'Reference #1', content: <ReferenceStep index={0} /> },
      { title: 'Reference #2', content: <ReferenceStep index={1} /> },
      { title: 'Reference #3', content: <ReferenceStep index={2} /> },
      { title: 'When I use them', intro: 'Each time you list your references on an application, write it here and tell them.', content: <UsesStep /> },
    ]} />
  )
}

export function ReferencesPrintView() {
  return (
    <PrintShell page={page} sheets={PAGE_SHEETS.references} />
  )
}
