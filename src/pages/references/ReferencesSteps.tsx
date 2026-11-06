// Page 04 steps.
import { usePageData } from '../../data/store'
import { blankReferenceUse, type Reference, type ReferenceUse } from '../../data/packet'
import { Card, Check, Grid, Ideas, TextField, Tip } from '../../components/fields'

export function ReferenceTip() {
  return (
    <Tip>
      <b>Who makes a good reference?</b> A teacher, job coach, case manager, past supervisor, coach, or volunteer leader.
      <b> Not</b> family members or friends.<br />
      <b>Always ask first.</b> Say: <i>"Would you be a reference for me when I apply for jobs?"</i> Then let them know
      when you apply, so they expect a call.
    </Tip>
  )
}

const HOW_IDEAS = ['My teacher at TRACE', 'My case manager at TRACE', 'My job coach', 'My supervisor at work']

interface ReferenceStepProps {
  index: number
}

export function ReferenceStep({ index }: ReferenceStepProps) {
  const { data, update } = usePageData('references')
  const r = data.people[index]
  const set = <K extends keyof Reference>(key: K, v: Reference[K]) =>
    update((d) => { d.pages.references.people[index][key] = v })
  return (
    <>
      {index === 0 && <ReferenceTip />}
      <Grid>
        <TextField label="Name" value={r.name} onChange={(v) => set('name', v)} />
        <TextField label="Job title" value={r.jobTitle} onChange={(v) => set('jobTitle', v)} placeholder="Teacher, Job Coach, Store Manager" />
        <TextField label="Where they work" value={r.workplace} onChange={(v) => set('workplace', v)} placeholder="TRACE, San Diego Unified" />
        <TextField label="Known me for" value={r.knownFor} onChange={(v) => set('knownFor', v)} placeholder="2 years" />
        <TextField label="Phone" type="tel" value={r.phone} onChange={(v) => set('phone', v)} />
        <TextField label="Email" type="email" value={r.email} onChange={(v) => set('email', v)} />
      </Grid>
      <div>
        <TextField label="How they know me" value={r.howTheyKnowMe} onChange={(v) => set('howTheyKnowMe', v)} />
        <Ideas ideas={HOW_IDEAS} onPick={(v) => set('howTheyKnowMe', v)} />
      </div>
      <Card title="I asked them">
        <Check label="They said yes" checked={r.saidYes} onChange={(v) => set('saidYes', v)} />
        <TextField label="Date" type="date" width="short" value={r.askedDate} onChange={(v) => set('askedDate', v)} />
      </Card>
    </>
  )
}

export function UsesStep() {
  const { data, update } = usePageData('references')
  const set = <K extends keyof ReferenceUse>(i: number, key: K, v: ReferenceUse[K]) =>
    update((d) => { d.pages.references.uses[i][key] = v })
  return (
    <>
      {data.uses.map((u, i) => (
        <Card key={i}>
          <Grid cols={3}>
            <TextField label="Date" type="date" value={u.date} onChange={(v) => set(i, 'date', v)} />
            <TextField label="Job / company" value={u.job} onChange={(v) => set(i, 'job', v)} />
            <TextField label="References I listed" value={u.listed} onChange={(v) => set(i, 'listed', v)} placeholder="#1, #2, #3" />
          </Grid>
          <Check label="I told them" checked={u.toldThem} onChange={(v) => set(i, 'toldThem', v)} />
        </Card>
      ))}
      <button type="button" onClick={() => update((d) => { d.pages.references.uses.push(blankReferenceUse()) })}
        className="rounded-lg border-2 border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another
      </button>
    </>
  )
}
