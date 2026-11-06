import { useEffect } from 'react'
import { pageInfo } from '../../data/pages'
import { useStore } from '../../data/store'
import { splitDuties } from '../../data/resume'
import { saveFile } from '../../data/saveLoad'
import { wordFileName } from '../../data/derive'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { WordButton } from '../../components/WordButton'
import { ExperienceStep, FinishStep, GoalStep, SkillsStep } from './ResumeSteps'

const page = pageInfo('resume')

// First visit: turn each job's "What I did" into bullet points.
function usePrefill() {
  const { packet, update } = useStore()
  const done = packet.pages.resume.prefilled
  useEffect(() => {
    if (done) return
    update((d) => {
      const r = d.pages.resume
      if (r.prefilled) return
      d.profile.jobs.forEach((j, i) => { r.bullets[i] ||= splitDuties(j.duties).join('\n') })
      r.prefilled = true
    })
  }, [done, update])
}

export function ResumeWizard() {
  usePrefill()
  return (
    <Wizard page={page} steps={[
      { title: 'My goal', intro: 'Your resume uses your About Me answers. Here you add a few more things.', content: <GoalStep /> },
      { title: 'My skills', content: <SkillsStep /> },
      { title: 'What I did at each job', content: <ExperienceStep /> },
      { title: 'Finishing touches', content: <FinishStep /> },
    ]} />
  )
}

export function ResumePrintView() {
  usePrefill()
  const { packet } = useStore()
  const downloadWord = async () => {
    // The Word library is big, so it only loads when someone asks for a Word file.
    // It loads after the Save As window opens (the window must open right after the click).
    saveFile(wordFileName(packet, 'Resume'), 'word', async () => (await import('../../docx/resume')).resumeBlob(packet))
  }
  return (
    <PrintShell
      page={page}
      sheets={PAGE_SHEETS.resume}
      extraButtons={<WordButton onClick={downloadWord} />}
    />
  )
}
