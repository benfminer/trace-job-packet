// Page 07 steps.
import { usePageData } from '../../data/store'
import { ACCOMMODATION_IDEAS, REASONS_TELL, REASONS_WAIT, SAY_EXAMPLE, WHEN_TELL } from '../../data/options'
import type { HelpRow } from '../../data/packet'
import { Card, Check, Grid, Ideas, MultiChoice, TextField, Tip } from '../../components/fields'

export function RightsText() {
  return (
    <>
      <b>My rights.</b> It is my choice whether to tell an employer about my disability. I don't have to share my
      diagnosis. If I need a change at work to do my job (an accommodation), I can ask for it at any time, even after
      I'm hired. Employers must keep this information private and cannot treat me unfairly because of a disability.
    </>
  )
}

export function RightsStep() {
  return (
    <>
      <Tip><RightsText /></Tip>
      <p className="text-lg">Talk these pages through with your teacher or job coach. There are no wrong answers.</p>
    </>
  )
}

export function ShouldTellStep() {
  const { data, set } = usePageData('disclosure')
  return (
    <>
      <MultiChoice label="Reasons I might tell" value={data.reasonsTell} onChange={(v) => set('reasonsTell', v)} options={REASONS_TELL} allowOther />
      <MultiChoice label="Reasons I might wait or not tell" value={data.reasonsWait} onChange={(v) => set('reasonsWait', v)} options={REASONS_WAIT} allowOther />
    </>
  )
}

export function WhenStep() {
  const { data, set } = usePageData('disclosure')
  return (
    <div className="space-y-2">
      {WHEN_TELL.map((w) => (
        <Card key={w.value}>
          <Check label={<b>{w.label}</b>} checked={data.whenTell.includes(w.value)}
            onChange={(on) => set('whenTell', on ? [...data.whenTell, w.value] : data.whenTell.filter((x) => x !== w.value))} />
          <p className="text-slate-600">{w.note}</p>
        </Card>
      ))}
    </div>
  )
}

export function HelpsStep() {
  const { data, update } = usePageData('disclosure')
  const setRow = (i: number, key: keyof HelpRow, v: string) => update((d) => { d.pages.disclosure.helps[i][key] = v })
  return (
    <>
      <Tip>Describe what helps, not your diagnosis.</Tip>
      {data.helps.map((h, i) => (
        <Card key={i}>
          <Grid>
            <TextField label="Something that can be hard for me" value={h.hard} onChange={(v) => setRow(i, 'hard', v)}
              placeholder="Remembering a lot of steps" />
            <TextField label="What helps me (my accommodation)" value={h.helps} onChange={(v) => setRow(i, 'helps', v)} />
          </Grid>
          <Ideas ideas={ACCOMMODATION_IDEAS} onPick={(v) => setRow(i, 'helps', h.helps ? `${h.helps}; ${v.toLowerCase()}` : v)} />
        </Card>
      ))}
      <button type="button" onClick={() => update((d) => { d.pages.disclosure.helps.push({ hard: '', helps: '' }) })}
        className="rounded-md border border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another
      </button>
    </>
  )
}

export function SayStep() {
  const { data, set } = usePageData('disclosure')
  const said = [data.sayHardWorker && `I'm a hard worker who ${data.sayHardWorker}.`,
    data.sayWorkBest && `I work best when ${data.sayWorkBest}.`, data.sayHelps && `It helps me if ${data.sayHelps}.`]
    .filter(Boolean).join(' ').replace(/\.\./g, '.')
  return (
    <>
      <TextField label="I'm a hard worker who ..." value={data.sayHardWorker} onChange={(v) => set('sayHardWorker', v)} placeholder="likes to get things right" />
      <TextField label="I work best when ..." value={data.sayWorkBest} onChange={(v) => set('sayWorkBest', v)} placeholder="I have a checklist for my tasks" />
      <TextField label="It helps me if ..." value={data.sayHelps} onChange={(v) => set('sayHelps', v)} placeholder="someone shows me a new task first" />
      <Card title={said ? 'Practice saying it out loud' : 'Example'}>
        <p className="text-lg italic">{said ? `"${said}"` : SAY_EXAMPLE}</p>
      </Card>
    </>
  )
}
