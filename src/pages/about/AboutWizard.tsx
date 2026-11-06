import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { AddressStep, ContactStep, EmergencyStep, NameStep } from './BasicsSteps'
import { CertificationsStep, SchoolStep } from './SchoolSteps'
import { StrengthsStep, WorkStep } from './WorkSteps'

export function AboutWizard() {
  return (
    <Wizard
      page={pageInfo('about')}
      finishTo="home"
      steps={[
        { title: 'My name', intro: 'This info fills in every page of the packet, so you only type it once.', content: <NameStep /> },
        { title: 'Where I live', content: <AddressStep /> },
        { title: 'How to reach me', content: <ContactStep /> },
        { title: 'Emergency contacts', intro: 'People an employer can call if something happens to you at work.', content: <EmergencyStep /> },
        { title: 'School', content: <SchoolStep /> },
        { title: 'Work & volunteering', content: <WorkStep /> },
        { title: 'Certifications', content: <CertificationsStep /> },
        { title: 'My strengths', intro: 'These go into your cover letter, resume, and interview answers.', content: <StrengthsStep /> },
      ]}
    />
  )
}
