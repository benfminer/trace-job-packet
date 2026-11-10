// The job the packet is aimed at. Typed once here, used by the cover letter, application answers,
// thank-you note, and tracker.
import { Briefcase } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../data/store'
import type { Target } from '../data/packet'
import { targetLabel } from '../data/derive'
import { PRACTICE_JOBS, startNewApplication } from '../data/target'
import { AddressFields } from './AddressFields'
import { ConfirmDialog } from './ConfirmDialog'
import { Grid, Ideas, TextField } from './fields'
import { btnPrimary, btnSecondary } from './styles'

export function PracticeBadge() {
  return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">Practice</span>
}

// On-screen reminder that a page is using the practice job. Never printed.
export function PracticeNote() {
  const { packet, go } = useStore()
  const t = packet.target
  if (!t.practice) return null
  return (
    <p className="flex flex-wrap items-center gap-2 text-slate-700">
      <PracticeBadge />
      <span>
        {targetLabel(t) ? <>This uses your practice job, <b>{targetLabel(t)}</b>.</> : <>You haven't picked a practice job yet.</>}
      </span>
      <button type="button" onClick={() => go({ view: 'job' })} className="font-semibold text-brand underline">
        {targetLabel(t) ? 'Change it' : 'Pick one'}
      </button>
    </p>
  )
}

export function JobFields() {
  const { packet, update } = useStore()
  const t = packet.target
  const set = <K extends keyof Target>(key: K, v: Target[K]) => update((d) => { d.target[key] = v })
  return (
    <>
      <div>
        <Grid>
          <TextField label="Job title" value={t.title} onChange={(v) => set('title', v)} placeholder="Store Associate" />
          <TextField label="Company name" value={t.company} onChange={(v) => set('company', v)} placeholder="Smart & Final" />
        </Grid>
        {t.practice && (
          <Ideas label="Practice jobs (tap one to use it):" ideas={PRACTICE_JOBS.map(targetLabel)}
            onPick={(v) => update((d) => { Object.assign(d.target, PRACTICE_JOBS.find((j) => targetLabel(j) === v)) })} />
        )}
      </div>
      <AddressFields streetLabel="Company street address" street={t.street} city={t.city} state={t.state} zip={t.zip}
        onChange={(part, v) => set(part, v)} />
      <div>
        <TextField label="Where I found the job" value={t.whereFound} onChange={(v) => set('whereFound', v)} />
        <Ideas ideas={['Indeed', 'the company website', 'a TRACE job fair']} onPick={(v) => set('whereFound', v)} />
      </div>
      <TextField label="Hiring manager's name (check the job post)" value={t.hiringManager} onChange={(v) => set('hiringManager', v)}
        hint={'Leave blank if you can\'t find it. The letter will say "Hiring Manager" and "Dear Hiring Team."'} />
    </>
  )
}

// "I'm applying for a real job" in practice mode, "Start a new application" after that.
// Asks first, because it clears the answers that were about the old job.
export function NewApplicationButton({ primary }: { primary?: boolean }) {
  const { packet, update, go } = useStore()
  const [asking, setAsking] = useState(false)
  const t = packet.target
  const start = () => {
    update(startNewApplication)
    setAsking(false)
    go({ view: 'job' })
  }
  return (
    <>
      <button type="button" onClick={() => setAsking(true)} className={primary ? btnPrimary : btnSecondary}>
        <Briefcase aria-hidden className="size-5" />{t.practice ? "I'm applying for a real job" : 'Start a new application'}
      </button>
      {asking && (
        <ConfirmDialog title={t.practice ? 'Switch to a real job?' : 'Start a new application?'}
          confirmLabel={t.practice ? 'Yes, type in the real job' : 'Yes, start a new one'} onConfirm={start} onCancel={() => setAsking(false)}>
          {t.practice ? (
            <p>The practice job is cleared so you can type in the real one, along with "why this company" and the thank-you note.</p>
          ) : (
            <>
              <p>{targetLabel(t) ? <><b>{targetLabel(t)}</b> stays on your Job Search Tracker.</> : 'The job on this card is cleared.'} The answers about that job are cleared for the next one.</p>
              <p>Want to keep the old cover letter? Go back and download it first.</p>
            </>
          )}
          <p><b>Your experience, strengths, and every other page stay the same.</b></p>
        </ConfirmDialog>
      )}
    </>
  )
}
