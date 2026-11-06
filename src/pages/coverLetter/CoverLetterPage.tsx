import { useEffect } from 'react'
import { pageInfo } from '../../data/pages'
import { useStore } from '../../data/store'
import { availabilitySentence } from '../../data/derive'
import { downloadBlob } from '../../data/saveLoad'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import { WordButton } from '../../components/WordButton'
import { ExperienceStep, JobStep, ReadItStep, StrengthsStep, WhenStep, WhyStep } from './CoverLetterSteps'

const page = pageInfo('coverLetter')

// First visit: copy matching About Me answers in so the student starts with a head start.
function usePrefill() {
  const { packet, update } = useStore()
  const done = packet.pages.coverLetter.prefilled
  useEffect(() => {
    if (done) return
    update((d) => {
      const c = d.pages.coverLetter
      if (c.prefilled) return
      const [job1, job2] = d.profile.jobs
      c.place1 ||= job1.employer
      c.did1 ||= job1.duties
      c.place2 ||= job2.employer
      c.did2 ||= job2.duties
      if (!c.strengths.length) c.strengths = d.profile.strengths.slice(0, 2)
      c.doWell ||= d.profile.doWell
      c.whenCanWork ||= availabilitySentence(d.profile)
      c.prefilled = true
    })
  }, [done, update])
}

export function CoverLetterWizard() {
  usePrefill()
  return (
    <Wizard page={page} steps={[
      { title: 'The job', content: <JobStep /> },
      { title: 'My experience', content: <ExperienceStep /> },
      { title: 'My strengths', content: <StrengthsStep /> },
      { title: 'Why this company', content: <WhyStep /> },
      { title: 'When I can work', content: <WhenStep /> },
      { title: 'Read it over', intro: 'Read your letter out loud. Go back to any step to change it.', content: <ReadItStep /> },
    ]} />
  )
}

export function CoverLetterPrintView() {
  usePrefill()
  const { packet } = useStore()
  const downloadWord = async () => {
    // The Word library is big, so it only loads when someone asks for a Word file.
    const { coverLetterBlob, coverLetterFileName } = await import('../../docx/coverLetter')
    downloadBlob(await coverLetterBlob(packet), coverLetterFileName(packet))
  }
  return (
    <PrintShell
      page={page}
      sheets={PAGE_SHEETS.coverLetter}
      extraButtons={<WordButton onClick={downloadWord} />}
    />
  )
}
