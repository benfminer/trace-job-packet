// Page 01 steps. Most of the resume comes from About Me; these add the resume-only parts.
import { usePageData } from '../../data/store'
import { SKILL_IDEAS } from '../../data/resume'
import { Card, Check, Ideas, MultiChoice, TextArea, TextField, Tip } from '../../components/fields'

export function GoalStep() {
  const { data: r, set, packet } = usePageData('resume')
  const want = packet.pages.appInfo.jobsWanted.split(',')[0]?.trim()
  const ideas = [
    `To get a part-time job as a ${want || 'store associate'} where I can use my customer service skills`,
    'To get a job where I can learn new skills and be part of a team',
    'To work in a busy, friendly place where I can keep things clean and organized',
  ]
  return (
    <div>
      <TextArea label="My goal (objective)" value={r.objective} onChange={(v) => set('objective', v)} rows={2}
        hint="One sentence about the job you want. You can change it for each job you apply to." />
      <Ideas ideas={ideas} onPick={(v) => set('objective', v)} />
    </div>
  )
}

export function SkillsStep() {
  const { data: r, set, packet } = usePageData('resume')
  return (
    <>
      <MultiChoice label="Skills I have" value={r.skills} onChange={(v) => set('skills', v)} options={SKILL_IDEAS} allowOther
        hint="Pick things you have really done at a job, a TRACE work site, or in class." />
      {packet.profile.strengths.length > 0 && (
        <Tip>Your strengths from About Me get added too: <b>{packet.profile.strengths.join(', ')}</b>.</Tip>
      )}
      <TextField label="Languages I speak (optional)" value={r.languages} onChange={(v) => set('languages', v)}
        placeholder="English and Spanish" />
    </>
  )
}

export function ExperienceStep() {
  const { data: r, update, packet } = usePageData('resume')
  const jobs = packet.profile.jobs.map((j, i) => ({ j, i })).filter(({ j }) => j.employer)
  if (!jobs.length) return <Tip>Add your jobs and volunteer work in <b>About Me</b> first. They show up here.</Tip>
  return (
    <>
      <Tip>Write one thing you did on each line. Start each line with an action word: <i>Stocked, Helped, Cleaned, Sorted</i>.</Tip>
      {jobs.map(({ j, i }) => (
        <Card key={i} title={`${j.title || 'Job'} at ${j.employer}`}>
          <TextArea label="What I did (one per line)" rows={4} value={r.bullets[i] ?? ''}
            onChange={(v) => update((d) => { d.pages.resume.bullets[i] = v })} />
        </Card>
      ))}
    </>
  )
}

export function FinishStep() {
  const { data: r, set } = usePageData('resume')
  return (
    <>
      <Check label="Show my availability at the bottom of my resume" checked={r.showAvailability} onChange={(v) => set('showAvailability', v)} />
      <Card title="Before you send it">
        <ul className="list-disc space-y-1 pl-6 text-lg">
          <li>Keep it to one page.</li>
          <li>Read it out loud and check the spelling.</li>
          <li>Have your teacher or job coach look at it.</li>
          <li>Save it as a PDF named "First Last Resume".</li>
        </ul>
      </Card>
    </>
  )
}
