// Page 05 steps.
import { useProfile } from '../../data/store'
import { blankCommitment, DAYS, type Commitment, type DayAvailability } from '../../data/packet'
import { summarizeAvailability } from '../../data/derive'
import { Card, Grid, MultiChoice, Select, TextArea, TextField, Tip } from '../../components/fields'
import { ALSO_WORK, HOURS_OPTIONS, SLOTS, TIMES, TRAVEL_MODES } from '../../data/options'

export function TimesStep() {
  const { p, update } = useProfile()
  const setDay = <K extends keyof DayAvailability>(day: (typeof DAYS)[number], key: K, v: DayAvailability[K]) =>
    update((d) => { d.profile.availability[day][key] = v })
  const sameAsMonday = (day: (typeof DAYS)[number]) =>
    update((d) => { d.profile.availability[day] = { ...d.profile.availability.Monday } })
  const mondaySet = Object.values(p.availability.Monday).some(Boolean)
  return (
    <>
      <Tip>
        <b>Be honest.</b> If you say you can work a time, the employer may schedule you then.
        Check the times you can really work, including travel time.
      </Tip>
      <div className="space-y-3">
        {DAYS.map((day) => {
          const a = p.availability[day]
          return (
            <div key={day} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-lg font-bold">{day}</p>
                {day !== 'Monday' && mondaySet && (
                  <button type="button" onClick={() => sameAsMonday(day)}
                    className="rounded-full border border-dashed border-slate-400 bg-slate-50 px-3 py-1 text-sm text-slate-700 hover:border-brand hover:text-brand">
                    Same as Monday
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button key={s.key} type="button" aria-pressed={a[s.key]} onClick={() => setDay(day, s.key, !a[s.key])}
                    className={'rounded-md border px-3 py-2 text-left ' +
                      (a[s.key] ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-brand')}>
                    <span className="block font-semibold">{a[s.key] ? '✓ ' : ''}{s.label}</span>
                    <span className="text-sm opacity-80">{s.hours}</span>
                  </button>
                ))}
                <div className="flex gap-2">
                  <Select label="Earliest I can start" value={a.earliest} options={TIMES} onChange={(v) => setDay(day, 'earliest', v)} />
                  <Select label="Latest I can stay" value={a.latest} options={TIMES} onChange={(v) => setDay(day, 'latest', v)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function CommitmentsStep() {
  const { p, update } = useProfile()
  const setRow = (i: number, key: keyof Commitment, v: string) =>
    update((d) => { d.profile.commitments[i][key] = v })
  return (
    <>
      {p.commitments.map((c, i) => (
        <Card key={i}>
          <Grid cols={3}>
            <TextField label="Day(s)" value={c.days} onChange={(v) => setRow(i, 'days', v)} placeholder="Mon - Thu" />
            <TextField label="Time" value={c.time} onChange={(v) => setRow(i, 'time', v)} placeholder="8 AM - 1 PM" />
            <TextField label="What" value={c.what} onChange={(v) => setRow(i, 'what', v)} placeholder="TRACE classes" />
          </Grid>
        </Card>
      ))}
      <button type="button" onClick={() => update((d) => { d.profile.commitments.push(blankCommitment()) })}
        className="rounded-md border border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another
      </button>
    </>
  )
}

export function HoursStep() {
  const { p, set } = useProfile()
  return (
    <>
      <MultiChoice label="Hours per week I want" value={p.hoursWanted ? [p.hoursWanted] : []} max={1}
        onChange={(v) => set('hoursWanted', v[v.length - 1] ?? '')} options={HOURS_OPTIONS} />
      <MultiChoice label="I can also work" value={p.canAlsoWork} onChange={(v) => set('canAlsoWork', v)} options={ALSO_WORK} />
      <MultiChoice label="How I get there" value={p.travelModes} onChange={(v) => set('travelModes', v)} options={TRAVEL_MODES} />
      <Grid>
        <TextField label="Travel time (one way)" value={p.travelTime} onChange={(v) => set('travelTime', v)} placeholder="45 minutes" />
        <TextField label="Last bus/trolley home" value={p.lastBusHome} onChange={(v) => set('lastBusHome', v)} placeholder="10:15 PM" />
      </Grid>
    </>
  )
}

export function SentenceStep() {
  const { p, set } = useProfile()
  const suggestion = summarizeAvailability(p.availability)
  return (
    <>
      {suggestion && (
        <Card title="Suggested from your answers">
          <p className="text-lg">{suggestion}</p>
          <button type="button" onClick={() => set('availabilityText', suggestion)}
            className="rounded-md bg-brand px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">Use this</button>
        </Card>
      )}
      <TextArea label="What I'll write on applications" value={p.availabilityText} onChange={(v) => set('availabilityText', v)}
        rows={2} placeholder="Monday through Friday after 2:00 PM, and all day Saturday and Sunday."
        hint="This sentence also goes into your cover letter. Change the words so they sound like you." />
    </>
  )
}
