// "Applying now": every answer an online application asks for, each with a Copy button.
// Meant to sit next to the job application in another tab or window.
import { ArrowLeft, Pencil } from 'lucide-react'
import { useStore } from '../../data/store'
import { applySections } from '../../data/apply'
import { PageBand } from '../../components/PageBand'
import { CopyRow } from '../../components/CopyRow'
import { Card, Tip } from '../../components/fields'
import { btnSecondary } from '../../components/styles'

export function ApplyPage() {
  const { packet, go } = useStore()
  const sections = applySections(packet)
  return (
    <div>
      <PageBand eyebrow="Page 3  ·  Applying now" title="Copy my answers" width="max-w-6xl">
        Keep this open next to the job application. Tap Copy, then paste into the application.
      </PageBand>
      <div className="mx-auto -mt-14 max-w-6xl space-y-5 px-4 pb-10">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <button type="button" onClick={() => go({ view: 'home' })} className={btnSecondary}>
            <ArrowLeft aria-hidden className="size-5" />Home
          </button>
          <button type="button" onClick={() => go({ view: 'edit', page: 'appInfo' })} className={btnSecondary}>
            <Pencil aria-hidden className="size-5" />Edit answers
          </button>
          <p className="text-slate-600">
            To paste, click in the application box and press <kbd className="rounded border border-slate-300 px-1.5 font-mono text-sm">Ctrl</kbd> + <kbd className="rounded border border-slate-300 px-1.5 font-mono text-sm">V</kbd>.
          </p>
        </div>
        <Tip>
          <b>Never type your Social Security number into this app.</b> When an application asks for it, type it in from your
          card or from memory, with your teacher or job coach next to you.
        </Tip>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {sections.map((s) => (
            <Card key={s.title} title={s.title}>
              <div>{s.rows.map(([label, value]) => <CopyRow key={label} label={label} value={value} />)}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
