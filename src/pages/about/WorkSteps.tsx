// About Me steps: work and volunteer history, strengths.
import { useProfile } from '../../data/store'
import { blankJob, type Job } from '../../data/packet'
import { STRENGTHS } from '../../data/derive'
import { Card, Choice, Grid, Ideas, MultiChoice, TextArea, TextField, Tip } from '../../components/fields'
import { yesNo } from '../../data/options'
import { formatMonthYear } from '../../data/format'
import { AddressFields, type AddressPart } from '../../components/AddressFields'

const JOB_ADDRESS = { street: 'address', city: 'city', state: 'state', zip: 'zip' } as const satisfies Record<AddressPart, keyof Job>

const REASON_IDEAS = [
  'My program internship ended.', 'It was a seasonal job.', 'I went back to school.',
  "I'm looking for more hours.", 'I moved.',
]

interface JobCardProps {
  index: number
  job: Job
  onChange: (key: keyof Job, value: string) => void
}

function JobCard({ index, job, onChange }: JobCardProps) {
  return (
    <Card title={`Job #${index + 1}${index === 0 ? ' (most recent)' : ''}`}>
      <Grid>
        <TextField label="Employer" value={job.employer} onChange={(v) => onChange('employer', v)} placeholder="CVS, a TRACE work site, ..." />
        <TextField label="Job title" value={job.title} onChange={(v) => onChange('title', v)} placeholder="Store Associate, Volunteer, ..." />
      </Grid>
      <AddressFields street={job.address} city={job.city} state={job.state} zip={job.zip}
        onChange={(part, v) => onChange(JOB_ADDRESS[part], v)} />
      <Grid>
        <TextField label="Phone" type="tel" value={job.phone} onChange={(v) => onChange('phone', v)} />
        <TextField label="Supervisor" value={job.supervisor} onChange={(v) => onChange('supervisor', v)} />
        <Grid>
          <TextField label="Start (month/year)" value={job.start} onChange={(v) => onChange('start', v)} placeholder="06/2025"
            format={formatMonthYear} />
          <TextField label='End (or "Present")' value={job.end} onChange={(v) => onChange('end', v)} placeholder="Present"
            format={formatMonthYear} />
        </Grid>
        <TextField label="Starting pay" value={job.startPay} onChange={(v) => onChange('startPay', v)} placeholder="$16.85/hr or Unpaid" />
        <TextField label="Ending pay" value={job.endPay} onChange={(v) => onChange('endPay', v)} />
      </Grid>
      <TextArea label="What I did" value={job.duties} onChange={(v) => onChange('duties', v)} rows={2}
        hint='Start with an action word, like "Stocked shelves and helped customers find products."' />
      <div>
        <TextField label="Reason I left" value={job.reasonLeft} onChange={(v) => onChange('reasonLeft', v)}
          hint="Keep it short and positive. Leave blank if you still work there." />
        <Ideas label="Good ways to say it:" ideas={REASON_IDEAS} onPick={(v) => onChange('reasonLeft', v)} />
      </div>
      <Choice label="OK to contact?" value={job.okToContact} onChange={(v) => onChange('okToContact', v)} options={yesNo} />
    </Card>
  )
}

export function WorkStep() {
  const { p, update } = useProfile()
  const setJob = (i: number, key: keyof Job, v: string) =>
    update((d) => { (d.profile.jobs[i] as Record<keyof Job, string>)[key] = v })
  return (
    <>
      <Tip>Start with the most recent. <b>TRACE work sites and volunteering count.</b> Fill in only what you have.</Tip>
      {p.jobs.map((job, i) => <JobCard key={i} index={i} job={job} onChange={(k, v) => setJob(i, k, v)} />)}
      <button type="button" onClick={() => update((d) => { d.profile.jobs.push(blankJob()) })}
        className="rounded-md border border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another job
      </button>
    </>
  )
}

const DO_WELL_IDEAS = [
  'follow directions carefully and learn new tasks quickly',
  'keep my work area clean and organized',
  'show up on time and ready to work',
  'stay calm and friendly with customers',
]

export function StrengthsStep() {
  const { p, set } = useProfile()
  return (
    <>
      <MultiChoice label="My strengths (pick 2 or more)" value={p.strengths} onChange={(v) => set('strengths', v)}
        options={STRENGTHS} allowOther />
      <div>
        <TextField label="Something I do well: I ..." value={p.doWell} onChange={(v) => set('doWell', v)}
          placeholder="follow directions carefully and learn new tasks quickly" />
        <Ideas ideas={DO_WELL_IDEAS} onPick={(v) => set('doWell', v)} />
      </div>
    </>
  )
}
