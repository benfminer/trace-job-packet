// Page 12 steps.
import { usePageData } from '../../data/store'
import { HOW_APPLIED, JOB_RESULTS } from '../../data/options'
import { addDays, todayIso } from '../../data/derive'
import { blankApplication, type Application } from '../../data/packet'
import { Card, Choice, Grid, Ideas, TextField, Tip } from '../../components/fields'
import { DateField } from '../../components/DateField'

// Still waiting to hear back and the follow-up date has come.
const needsFollowUp = (r: Application) =>
  !!r.followUp && r.followUp <= todayIso() && (r.result === '' || r.result === 'waiting')

export function ApplicationsStep() {
  const { data, update } = usePageData('tracker')
  const set = <K extends keyof Application>(i: number, key: K, v: Application[K]) =>
    update((d) => {
      const row = d.pages.tracker.rows[i]
      // Picking the date applied suggests a follow-up 1 week later.
      if (key === 'date' && typeof v === 'string' && v && !row.followUp) row.followUp = addDays(v, 7)
      row[key] = v
    })
  const remove = (i: number) => update((d) => { d.pages.tracker.rows.splice(i, 1) })
  return (
    <>
      <Tip>Add every job you apply for. Follow up about <b>1 week</b> after you apply if you haven't heard back.</Tip>
      {data.rows.map((r, i) => (
        <Card key={i} title={r.company ? `${i + 1}. ${r.company}` : `Job ${i + 1}`}>
          {needsFollowUp(r) && (
            <p className="-mt-2 rounded-lg bg-amber-100 px-3 py-2 font-semibold text-amber-900">Time to follow up on this one.</p>
          )}
          <Grid>
            <TextField label="Company" value={r.company} onChange={(v) => set(i, 'company', v)} />
            <TextField label="Job title" value={r.title} onChange={(v) => set(i, 'title', v)} />
            <DateField label="Date applied" value={r.date} onChange={(v) => set(i, 'date', v)} />
            <DateField label="Follow-up date" value={r.followUp} onChange={(v) => set(i, 'followUp', v)} />
            <div>
              <TextField label="How I applied" value={r.how} onChange={(v) => set(i, 'how', v)} />
              <Ideas label="Tap one:" ideas={HOW_APPLIED} onPick={(v) => set(i, 'how', v)} />
            </div>
            <TextField label="Contact name / phone" value={r.contact} onChange={(v) => set(i, 'contact', v)} />
          </Grid>
          <Choice label="What happened" value={r.result} onChange={(v) => set(i, 'result', v)} options={JOB_RESULTS} />
          {data.rows.length > 1 && (
            <button type="button" onClick={() => remove(i)} className="text-sm font-semibold text-slate-500 underline hover:text-red-700">
              Remove this job
            </button>
          )}
        </Card>
      ))}
      <button type="button" onClick={() => update((d) => { d.pages.tracker.rows.push(blankApplication()) })}
        className="rounded-md border border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another job
      </button>
    </>
  )
}
