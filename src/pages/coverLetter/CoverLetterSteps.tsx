// Page 02 steps: plan the letter, then read it over.
import { usePageData } from '../../data/store'
import { STRENGTHS, availabilitySentence, coverLetterParagraphs } from '../../data/derive'
import { Card, Check, Ideas, MultiChoice, TextArea, TextField, Tip } from '../../components/fields'
import { LetterBody } from './LetterBody'
import { SEND_CHECKLIST } from '../../data/options'
import { JobFields, PracticeNote } from '../../components/JobFields'
import { AvailabilityNote } from '../../components/AvailabilityNote'

// The job is typed once and shared (Home has the same card).
export function JobStep() {
  return (
    <>
      <PracticeNote />
      <JobFields />
    </>
  )
}

export function ExperienceStep() {
  const { data: c, set, update, packet } = usePageData('coverLetter')
  const jobs = packet.profile.jobs.filter((j) => j.employer)
  const pickJob = (slot: 1 | 2, employer: string) => {
    const job = jobs.find((j) => j.employer === employer)
    update((d) => {
      const cl = d.pages.coverLetter
      if (slot === 1) { cl.place1 = employer; cl.did1 = job?.duties ?? '' } else { cl.place2 = employer; cl.did2 = job?.duties ?? '' }
    })
  }
  return (
    <>
      <div>
        <TextField label="I have experience ..." value={c.experienceWith} onChange={(v) => set('experienceWith', v)}
          placeholder="working with customers" />
        <Ideas ideas={['working with customers', 'stocking shelves', 'cleaning and organizing']} onPick={(v) => set('experienceWith', v)} />
      </div>
      <Tip>Jobs, volunteer work, TRACE work sites, or classes all count.</Tip>
      {([1, 2] as const).map((slot) => (
        <Card key={slot} title={`Place #${slot}${slot === 2 ? ' (optional)' : ''}`}>
          {jobs.length > 0 && <Ideas label="From About Me (tap to use):" ideas={jobs.map((j) => j.employer)} onPick={(v) => pickJob(slot, v)} />}
          <TextField label="Place" value={slot === 1 ? c.place1 : c.place2} onChange={(v) => set(slot === 1 ? 'place1' : 'place2', v)} />
          <TextArea label="At this place, I ..." rows={2} value={slot === 1 ? c.did1 : c.did2}
            onChange={(v) => set(slot === 1 ? 'did1' : 'did2', v)} placeholder="kept shelves stocked and helped customers find products" />
        </Card>
      ))}
    </>
  )
}

export function StrengthsStep() {
  const { data: c, set, packet } = usePageData('coverLetter')
  const options = [...new Set([...STRENGTHS, ...packet.profile.strengths])]
  return (
    <>
      <MultiChoice label="Pick 2 strengths" value={c.strengths} onChange={(v) => set('strengths', v)} options={options} max={2} allowOther
        hint="Tap one to turn it off." />
      <TextField label="Something I do well: I ..." value={c.doWell} onChange={(v) => set('doWell', v)}
        placeholder="follow directions carefully and learn new tasks quickly" />
    </>
  )
}

export function WhyStep() {
  const { data: c, set, packet } = usePageData('coverLetter')
  return (
    <div>
      <TextArea label={`I want to work at ${packet.target.company || 'this company'} because ...`} value={c.why} onChange={(v) => set('why', v)} rows={3} />
      <Ideas ideas={['I shop there and like how friendly the team is', 'I enjoy working with my hands', 'I want to grow my customer service skills']}
        onPick={(v) => set('why', v)} />
    </div>
  )
}

// Left blank, the letter uses the Weekly Availability page as it is now.
export function WhenStep() {
  const { data: c, set, packet } = usePageData('coverLetter')
  return (
    <>
      <AvailabilityNote />
      <TextArea label="I am available to work ..." value={c.whenCanWork} onChange={(v) => set('whenCanWork', v)} rows={2}
        placeholder={availabilitySentence(packet.profile)}
        hint="Leave it blank to use your Weekly Availability page. Type here only to change it for this job." />
    </>
  )
}

export function ReadItStep() {
  const { data: c, set, packet } = usePageData('coverLetter')
  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-5 font-serif text-lg leading-relaxed">
        <LetterBody packet={packet} paragraphs={coverLetterParagraphs(packet)} />
      </div>
      <Card title="Before you send it">
        {SEND_CHECKLIST.map((item) => (
          <Check key={item} label={item} checked={c.checklist.includes(item)}
            onChange={(on) => set('checklist', on ? [...c.checklist, item] : c.checklist.filter((x) => x !== item))} />
        ))}
      </Card>
    </>
  )
}
