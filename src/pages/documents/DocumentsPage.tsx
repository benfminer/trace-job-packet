import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { DocListStep, FirstDayStep, I9Step } from './DocumentsSteps'

const page = pageInfo('documents')

export function DocumentsWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'The I-9 form', intro: 'Proving you can work.', content: <I9Step /> },
      { title: 'My IDs', content: <DocListStep keys={['stateId', 'ssCard', 'birthCert', 'passport', 'workPermit']} /> },
      { title: 'Certificates', content: <DocListStep keys={['diploma', 'foodHandler', 'otherCerts']} /> },
      { title: 'Getting paid & getting there', content: <DocListStep keys={['bank', 'busPass']} /> },
      { title: 'First day checklist', content: <FirstDayStep /> },
    ]} />
  )
}

export function DocumentsPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.documents} />
}
