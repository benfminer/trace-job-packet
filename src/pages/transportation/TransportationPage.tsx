import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { HowStep, RouteStep, WrongStep } from './TransportationSteps'

const page = pageInfo('transportation')

export function TransportationWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'How I travel', content: <HowStep /> },
      { title: 'Route to work #1', intro: 'Plan the trip with Google Maps or the Transit app, then practice it before your first day.', content: <RouteStep index={0} /> },
      { title: 'Route to work #2', intro: 'For a second job or interview. Skip it if you only have one.', content: <RouteStep index={1} /> },
      { title: 'If something goes wrong', content: <WrongStep /> },
    ]} />
  )
}

export function TransportationPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.transportation} />
}
