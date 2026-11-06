import { useEffect } from 'react'
import { pageInfo } from '../../data/pages'
import { useStore } from '../../data/store'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { TeamStep, WhoToCallStep } from './SupportTeamSteps'

const page = pageInfo('supportTeam')

// First visit: copy in people the student already named elsewhere.
function usePrefill() {
  const { packet, update } = useStore()
  const done = packet.pages.supportTeam.prefilled
  useEffect(() => {
    if (done) return
    update((d) => {
      const t = d.pages.supportTeam
      if (t.prefilled) return
      t.members.teacher.name ||= d.teacher
      t.members.caseManager.name ||= d.caseManager
      const family = d.profile.emergency[0]
      if (!t.members.family.name && family.name) Object.assign(t.members.family, { name: family.name, phone: family.phone })
      const job = d.profile.jobs.find((j) => /present/i.test(j.end) && j.supervisor)
      if (!t.members.supervisor.name && job) Object.assign(t.members.supervisor, { name: job.supervisor, phone: job.phone })
      t.prefilled = true
    })
  }, [done, update])
}

export function SupportTeamWizard() {
  usePrefill()
  return (
    <Wizard page={page} steps={[
      { title: 'My TRACE team', content: <TeamStep keys={['teacher', 'caseManager', 'jobCoach']} /> },
      { title: 'Agencies', content: <TeamStep keys={['dor', 'regionalCenter', 'benefits', 'conservator']} /> },
      { title: 'Family & work', content: <TeamStep keys={['family', 'supervisor', 'other']} /> },
      { title: 'Who do I call when...', content: <WhoToCallStep /> },
    ]} />
  )
}

export function SupportTeamPrintView() {
  usePrefill()
  return <PrintShell page={page} sheets={PAGE_SHEETS.supportTeam} />
}
