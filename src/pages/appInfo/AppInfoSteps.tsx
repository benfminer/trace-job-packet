// Page 03 steps. Most of this page comes from About Me; these are the extra questions.
import { useStore, usePageData } from '../../data/store'
import { availabilitySentence, fullName } from '../../data/derive'
import { Card, Check, Choice, Grid, TextField, Tip } from '../../components/fields'
import { HOURS_OPTIONS, yesNo } from '../../data/options'

export function JobWantedStep() {
  const { data: a, set } = usePageData('appInfo')
  const { packet, update } = useStore()
  return (
    <>
      <TextField label="Job(s) I want" value={a.jobsWanted} onChange={(v) => set('jobsWanted', v)} placeholder="Store associate, stocker, dishwasher" />
      <Grid>
        <TextField label="Pay I want ($ per hour)" value={a.payWanted} onChange={(v) => set('payWanted', v)} placeholder="18.00" />
        <TextField label="Can start on" value={a.startDate} onChange={(v) => set('startDate', v)} placeholder="Right away, June 1, ..." />
      </Grid>
      <Check label='Pay is "Open" (I&apos;m flexible)' checked={a.payOpen} onChange={(v) => set('payOpen', v)} />
      <Tip>If an application asks for pay and you're not sure, write "Open" or "Negotiable."</Tip>
      <Choice label="Type of job" value={a.jobType} onChange={(v) => set('jobType', v)}
        options={[{ value: 'part', label: 'Part time' }, { value: 'full', label: 'Full time' }, { value: 'either', label: 'Either' }]} />
      <Choice label="Hours per week" value={packet.profile.hoursWanted}
        onChange={(v) => update((d) => { d.profile.hoursWanted = v })}
        options={HOURS_OPTIONS.map((h) => ({ value: h, label: h }))} hint="Same answer as your Weekly Availability page." />
    </>
  )
}

export function QuestionsStep() {
  const { data: a, set } = usePageData('appInfo')
  return (
    <>
      <Tip>Decide your answers ahead of time with your teacher, so you're not guessing on the computer.</Tip>
      <Choice label="Are you legally allowed to work in the U.S.?" value={a.legalToWork} onChange={(v) => set('legalToWork', v)} options={yesNo} />
      <Choice label="Will you need visa sponsorship now or in the future?" value={a.sponsorship} onChange={(v) => set('sponsorship', v)} options={yesNo} />
      <Choice label="Have you ever worked for this company before?" value={a.workedHereBefore} onChange={(v) => set('workedHereBefore', v)} options={yesNo} />
      {a.workedHereBefore === 'yes' && <TextField label="When?" value={a.workedHereWhen} onChange={(v) => set('workedHereWhen', v)} width="short" />}
      <TextField label="Do you know anyone who works here?" value={a.knowAnyone} onChange={(v) => set('knowAnyone', v)} />
      <Choice label="Do you have reliable transportation?" value={a.reliableTransport} onChange={(v) => set('reliableTransport', v)} options={yesNo} />
      {a.reliableTransport === 'yes' && <TextField label="How?" value={a.transportHow} onChange={(v) => set('transportHow', v)} placeholder="Bus and trolley" />}
      <TextField label="Can you lift ____ lbs? Stand for a full shift?" value={a.liftStand} onChange={(v) => set('liftStand', v)} placeholder="Yes, up to 25 lbs. Yes, I can stand for a full shift." />
      <TextField label="How did you hear about this job?" value={a.heardAbout} onChange={(v) => set('heardAbout', v)} />
      <TextField label="Can you work weekends? Holidays?" value={a.weekendsHolidays} onChange={(v) => set('weekendsHolidays', v)} />
    </>
  )
}

// Shows what's missing from About Me so it can be fixed before printing.
export function CheckInfoStep() {
  const { packet, go } = useStore()
  const p = packet.profile
  const checks: [string, boolean][] = [
    ['Legal name', !!(p.firstName && p.lastName)],
    ['Address', !!(p.street && p.city && p.zip)],
    ['Cell phone', !!p.cellPhone],
    ['Email', !!p.email],
    ['Date of birth', !!p.dob],
    ['Emergency contact', !!p.emergency[0].name],
    ['High school', !!p.hsName],
    ['At least one job or volunteer place', p.jobs.some((j) => j.employer)],
    ['Days and times I can work', !!availabilitySentence(p)],
  ]
  const missing = checks.filter(([, ok]) => !ok)
  return (
    <>
      <p className="text-lg">Name on this sheet: <b>{fullName(p) || '(not entered yet)'}</b></p>
      <Card title={missing.length ? 'Still missing' : 'Everything is filled in'}>
        <ul className="space-y-1 text-lg">
          {checks.map(([label, ok]) => (
            <li key={label} className={ok ? 'text-green-700' : 'text-amber-700'}>{ok ? '✓' : '○'} {label}</li>
          ))}
        </ul>
      </Card>
      {missing.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => go({ view: 'edit', page: 'about' })}
            className="rounded-lg border-2 border-brand px-4 py-2 font-semibold text-brand hover:bg-brand/10">Fix in About Me</button>
          <button type="button" onClick={() => go({ view: 'edit', page: 'availability' })}
            className="rounded-lg border-2 border-brand px-4 py-2 font-semibold text-brand hover:bg-brand/10">Fix in Weekly Availability</button>
        </div>
      )}
    </>
  )
}
