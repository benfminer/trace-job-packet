// Shows a page the way it will print, with buttons to print it and mark it done.
import { useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, Printer } from 'lucide-react'
import { useStore } from '../data/store'
import { nextPage, type PageInfo } from '../data/pages'
import { todayIso } from '../data/derive'
import { PageBand } from './PageBand'
import { sheetClass, sheetLabelWidth, type Sheet } from './sheet'
import { btnPrimary, btnSecondary } from './styles'

interface PrintShellProps {
  page: PageInfo
  sheets: Sheet[]
  extraButtons?: ReactNode
  // Shown under the buttons on screen only, like the Practice label.
  note?: ReactNode
}

export function PrintShell({ page, sheets, extraButtons, note }: PrintShellProps) {
  const { packet, update, go } = useStore()
  const status = packet.status[page.id]
  const [skipped, setSkipped] = useState<string[]>([])

  const toggleDone = (done: boolean) =>
    update((d) => {
      // Finishing a page brings it back if it was skipped.
      d.status[page.id] = { started: true, done, date: done ? todayIso() : '', skipped: done ? false : d.status[page.id].skipped }
    })

  // Marks this page done and moves on, so nobody has to hunt for what's next.
  const next = nextPage(packet.status, page.id)
  const finish = () => {
    if (!status.done) toggleDone(true)
    // The trip screen shows the road moving forward, then opens the next page.
    go({ view: 'trip', page: page.id })
  }

  return (
    <div>
      <PageBand eyebrow={`Page ${page.num}  ·  Ready to print`} title={page.title} width="max-w-6xl">
        Check it over, then print it or save it as a PDF.
      </PageBand>
      {/* Toolbar card overlaps the band, then sticks under the top bar while you scroll the sheets. */}
      <div className="no-print sticky top-20 z-10 mx-auto -mt-14 max-w-6xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => go({ view: 'edit', page: page.id })} className={btnSecondary}>
              <ArrowLeft aria-hidden className="size-5" />Edit answers
            </button>
            <button type="button" onClick={() => window.print()} className={btnPrimary}>
              <Printer aria-hidden className="size-5" />Print / Save as PDF
            </button>
            {extraButtons}
            <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            <label className={'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-semibold transition-colors ' +
              'has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ' +
              (status.done ? 'border-green-200 bg-green-50 text-green-800' : 'border-slate-300 text-slate-700 hover:border-green-600')}>
              <input type="checkbox" className="sr-only" checked={status.done} onChange={(e) => toggleDone(e.target.checked)} />
              <span aria-hidden className={'grid size-5 place-items-center rounded border-[1.5px] ' +
                (status.done ? 'border-green-600 bg-green-600 text-white' : 'border-slate-400 bg-white')}>
                {status.done && <Check className="size-3.5" />}
              </span>
              This page is done
            </label>
            <button type="button" onClick={finish} className={btnPrimary}>
              {status.done ? '' : 'Done, '}{next ? `${status.done ? 'Next' : 'next'}: ${next.title}` : `${status.done ? 'Back' : 'back'} to Home`}
              <ArrowRight aria-hidden className="size-5" />
            </button>
            </div>
          </div>
          {note && <div className="mt-3 border-t border-slate-100 pt-3">{note}</div>}
          {sheets.length > 1 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-slate-700">
              <span className="mr-1 font-semibold">Print:</span>
              {sheets.map((s) => (
                <label key={s.name} className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-1 has-[:checked]:border-brand has-[:checked]:bg-brand-tint">
                  <input type="checkbox" className="size-4 accent-brand" checked={!skipped.includes(s.name)}
                    onChange={(e) => setSkipped(e.target.checked ? skipped.filter((n) => n !== s.name) : [...skipped, s.name])} />
                  {s.name}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sheets py-8">
        {sheets.map((s) => (
          <div key={s.name} className={'sheet-wrap' + (skipped.includes(s.name) ? ' skip-print' : '')}>
            <p className={`no-print mx-auto mb-2 px-1 text-sm font-semibold text-slate-500 ${sheetLabelWidth(s)}`}>{s.name}</p>
            <article className={sheetClass(s)}>{s.content}</article>
          </div>
        ))}
      </div>
    </div>
  )
}
