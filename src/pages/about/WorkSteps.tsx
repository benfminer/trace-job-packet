// About Me steps: work and volunteer history, strengths.
import { useState } from 'react'
import { useProfile } from '../../data/store'
import { blankJob, type Job } from '../../data/packet'
import { STRENGTHS } from '../../data/derive'
import { Card, Choice, Grid, Ideas, MultiChoice, TextArea, TextField, Tip } from '../../components/fields'
import { yesNo } from '../../data/options'
import { formatMonthYear } from '../../data/format'
import { AddressFields, type AddressPart } from '../../components/AddressFields'
import { KNOWN_EMPLOYERS, PLACE_KINDS, hasDuty, kindById, kindForJob, toggleDuty } from '../../data/jobSites'

const JOB_ADDRESS = { street: 'address', city: 'city', state: 'state', zip: 'zip' } as const satisfies Record<AddressPart, keyof Job>

const REASON_IDEAS = [
  'My program internship ended.', 'It was a seasonal job.', 'I went back to school.',
  "I'm looking for more hours.", 'I moved.',
]

interface PillRowProps {
  label: string
  options: string[]
  isOn: (option: string) => boolean
  onTap: (option: string) => void
}

// Small tap-on, tap-off buttons. Filled in means it's on.
function PillRow({ label, options, isOn, onTap }: PillRowProps) {
  return (
    <div className="mt-2">
      <p className="mb-1 text-sm text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={isOn(o)} onClick={() => onTap(o)}
            className={'rounded-full border px-3 py-1 text-sm transition-colors ' + (isOn(o)
              ? 'border-brand bg-brand text-white'
              : 'border-dashed border-slate-400 bg-slate-50 text-slate-700 hover:border-brand hover:text-brand')}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

interface JobCardProps {
  index: number
  job: Job
  onChange: (key: keyof Job, value: string) => void
  // Left out when this is the only job, so there's always one card to fill in.
  onRemove?: () => void
}

function JobCard({ index, job, onChange, onRemove }: JobCardProps) {
  // The boxes only applications ask for stay folded away until they're needed.
  // They start open when a saved packet already has something in them.
  const [more, setMore] = useState(() => !!(job.address || job.city || job.zip || job.phone || job.supervisor || job.startPay || job.endPay || job.reasonLeft || job.okToContact))
  // The kind of place comes from the employer's name. For a place that isn't on the list, the student picks it.
  const [pickedKind, setPickedKind] = useState('')
  const kind = kindById(pickedKind) ?? kindForJob(job)
  const listed = KNOWN_EMPLOYERS.some((e) => e === job.employer)
  return (
    <Card title={`Job #${index + 1}${index === 0 ? ' (most recent)' : ''}`}>
      <Grid>
        <div>
          <TextField label="Employer" value={job.employer} onChange={(v) => { setPickedKind(''); onChange('employer', v) }}
            placeholder="CVS, a TRACE work site, ..." />
          {!job.employer.trim() && (
            <Ideas label="Places students often work (tap one, or type your own):" ideas={KNOWN_EMPLOYERS}
              onPick={(v) => { setPickedKind(''); onChange('employer', v) }} />
          )}
          {job.employer.trim() && !listed && (
            <PillRow label="What kind of place is it? (tap one for ideas)" options={PLACE_KINDS.map((k) => k.label)}
              isOn={(label) => kind?.label === label}
              onTap={(label) => setPickedKind(kind?.label === label ? '' : PLACE_KINDS.find((k) => k.label === label)!.id)} />
          )}
        </div>
        <div>
          <TextField label="Job title" value={job.title} onChange={(v) => onChange('title', v)} placeholder="Store Associate, Volunteer, ..." />
          {kind && <Ideas label="Tap one to use it:" ideas={kind.titles} onPick={(v) => onChange('title', v)} />}
        </div>
        <TextField label="Start (month/year)" value={job.start} onChange={(v) => onChange('start', v)} placeholder="06/2025"
          format={formatMonthYear} />
        <TextField label='End (or "Present")' value={job.end} onChange={(v) => onChange('end', v)} placeholder="Present"
          format={formatMonthYear} />
      </Grid>
      <div>
        <TextArea label="What I did" value={job.duties} onChange={(v) => onChange('duties', v)} rows={2}
          hint={kind ? 'Tap below, type your own, or both.' : 'Start with an action word, like "Stocked shelves and helped customers find products."'} />
        {kind && (
          <PillRow label="Tap only the things you really did:" options={kind.duties}
            isOn={(d) => hasDuty(job.duties, d)} onTap={(d) => onChange('duties', toggleDuty(job.duties, d))} />
        )}
      </div>
      <details open={more} onToggle={(e) => setMore(e.currentTarget.open)} className="group rounded-lg border border-slate-200">
        <summary className="cursor-pointer px-4 py-3 font-semibold text-brand select-none">
          More details for applications <span className="font-normal text-slate-500">(address, supervisor, pay, why I left)</span>
        </summary>
        <div className="space-y-4 border-t border-slate-200 p-4">
          <AddressFields street={job.address} city={job.city} state={job.state} zip={job.zip}
            onChange={(part, v) => onChange(JOB_ADDRESS[part], v)} />
          <Grid>
            <TextField label="Phone" type="tel" value={job.phone} onChange={(v) => onChange('phone', v)} />
            <TextField label="Supervisor" value={job.supervisor} onChange={(v) => onChange('supervisor', v)} />
            <TextField label="Starting pay" value={job.startPay} onChange={(v) => onChange('startPay', v)} placeholder="$16.85/hr or Unpaid" />
            <TextField label="Ending pay" value={job.endPay} onChange={(v) => onChange('endPay', v)} />
          </Grid>
          <div>
            <TextField label="Reason I left" value={job.reasonLeft} onChange={(v) => onChange('reasonLeft', v)}
              hint="Keep it short and positive. Leave blank if you still work there." />
            <Ideas label="Good ways to say it:" ideas={REASON_IDEAS} onPick={(v) => onChange('reasonLeft', v)} />
          </div>
          <Choice label="OK to contact?" value={job.okToContact} onChange={(v) => onChange('okToContact', v)} options={yesNo} />
        </div>
      </details>
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-sm font-semibold text-slate-500 underline hover:text-red-700">
          Remove this job
        </button>
      )}
    </Card>
  )
}

export function WorkStep() {
  const { p, update } = useProfile()
  const setJob = (i: number, key: keyof Job, v: string) =>
    update((d) => { (d.profile.jobs[i] as Record<keyof Job, string>)[key] = v })
  // Resume bullets line up with jobs by position, so they go too.
  const remove = (i: number) => update((d) => {
    d.profile.jobs.splice(i, 1)
    d.pages.resume.bullets.splice(i, 1)
  })
  return (
    <>
      <Tip>Start with the most recent. <b>TRACE work sites and volunteering count.</b> Fill in only what you have.</Tip>
      {p.jobs.map((job, i) => (
        <JobCard key={i} index={i} job={job} onChange={(k, v) => setJob(i, k, v)}
          onRemove={p.jobs.length > 1 ? () => remove(i) : undefined} />
      ))}
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
