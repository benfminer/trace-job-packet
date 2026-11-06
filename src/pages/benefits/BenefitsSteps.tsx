// Page 10 steps.
import { usePageData } from '../../data/store'
import { BENEFITS, BENEFITS_INTRO, BENEFITS_NOT_SURE, FREE_HELP, GOOD_TO_KNOW, REPORT_WAYS } from '../../data/options'
import { blankPayReport, TEAM_KEYS, type PayReport } from '../../data/packet'
import { Card, Grid, Ideas, MultiChoice, TextField, Tip } from '../../components/fields'
import { DateField } from '../../components/DateField'

export function GetNowStep() {
  const { data, set } = usePageData('benefits')
  return (
    <>
      <Tip>{BENEFITS_INTRO}</Tip>
      <MultiChoice label="Benefits I get now" value={data.getNow} onChange={(v) => set('getNow', v)}
        options={[...BENEFITS, BENEFITS_NOT_SURE]} allowOther hint="Pick all that you get." />
    </>
  )
}

export function GoodToKnowStep() {
  return (
    <>
      {GOOD_TO_KNOW.map((g) => (
        <Card key={g.title} title={g.title}>
          <p className="text-lg">{g.text}</p>
        </Card>
      ))}
      <Card title="Where to get free help">
        <ul className="list-disc space-y-1 pl-6 text-lg">
          {FREE_HELP.map((h) => <li key={h.name}><b>{h.name}</b>{h.detail && `: ${h.detail}`}</li>)}
        </ul>
      </Card>
    </>
  )
}

export function ReportingStep() {
  const { data, set, update, packet } = usePageData('benefits')
  const team = packet.pages.supportTeam.members
  const helpers = TEAM_KEYS.map((k) => team[k].name).filter(Boolean)
  const setRow = (i: number, key: keyof PayReport, v: string) => update((d) => { d.pages.benefits.log[i][key] = v })
  return (
    <>
      <Tip><b>SSI:</b> report each month's pay by the <b>6th of the next month</b>. Keep your pay stubs. Also report job
        changes to Medi-Cal and CalFresh if you get them.</Tip>
      <MultiChoice label="How I report" value={data.howReport} onChange={(v) => set('howReport', v)} options={REPORT_WAYS} />
      <div>
        <TextField label="Who helps me report" value={data.whoHelps} onChange={(v) => set('whoHelps', v)} />
        {helpers.length > 0 && <Ideas label="Tap a person from My Support Team:" ideas={helpers} onPick={(v) => set('whoHelps', v)} />}
      </div>
      <h3 className="text-xl font-bold text-slate-900">My pay log</h3>
      <p className="-mt-4 text-slate-600">Fill this in each month after you report. You can leave it blank and write on the printed page.</p>
      {data.log.map((r, i) => (
        <Card key={i}>
          <Grid cols={3}>
            <TextField label="Month" value={r.month} onChange={(v) => setRow(i, 'month', v)} placeholder="November" />
            <TextField label="Paydays" value={r.paydays} onChange={(v) => setRow(i, 'paydays', v)} placeholder="11/7, 11/21" />
            <TextField label="Total pay (before taxes)" value={r.total} onChange={(v) => setRow(i, 'total', v)} placeholder="$420.00" />
            <DateField label="Date I reported" value={r.reported} onChange={(v) => setRow(i, 'reported', v)} />
            <TextField label="Confirmation #" value={r.confirmation} onChange={(v) => setRow(i, 'confirmation', v)} />
          </Grid>
        </Card>
      ))}
      <button type="button" onClick={() => update((d) => { d.pages.benefits.log.push(blankPayReport()) })}
        className="rounded-md border border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another month
      </button>
    </>
  )
}
