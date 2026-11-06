// Shows a page the way it will print, with buttons to print it and mark it done.
import { useState, type ReactNode } from 'react'
import { useStore } from '../data/store'
import type { PageInfo } from '../data/pages'
import { todayIso } from '../data/derive'

export interface Sheet {
  name: string
  content: ReactNode
}

interface PrintShellProps {
  page: PageInfo
  sheets: Sheet[]
  extraButtons?: ReactNode
}

export function PrintShell({ page, sheets, extraButtons }: PrintShellProps) {
  const { packet, update, go } = useStore()
  const status = packet.status[page.id]
  const [skipped, setSkipped] = useState<string[]>([])

  const toggleDone = (done: boolean) =>
    update((d) => {
      d.status[page.id] = { done, date: done ? todayIso() : '' }
    })

  return (
    <div>
      <div className="no-print sticky top-[64px] z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <button type="button" onClick={() => go({ view: 'edit', page: page.id })}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50">
            ← Edit answers
          </button>
          <button type="button" onClick={() => window.print()}
            className="rounded-md bg-brand px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
            Print / Save as PDF
          </button>
          {extraButtons}
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-lg font-semibold text-slate-800">
            <input type="checkbox" className="size-6 accent-green-600" checked={status.done}
              onChange={(e) => toggleDone(e.target.checked)} />
            This page is done
          </label>
        </div>
        {sheets.length > 1 && (
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 pb-3 text-slate-700">
            <span className="font-semibold">Print:</span>
            {sheets.map((s) => (
              <label key={s.name} className="flex items-center gap-2">
                <input type="checkbox" className="size-5 accent-brand" checked={!skipped.includes(s.name)}
                  onChange={(e) => setSkipped(e.target.checked ? skipped.filter((n) => n !== s.name) : [...skipped, s.name])} />
                {s.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="sheets py-6">
        {sheets.map((s) => (
          <div key={s.name} className={'sheet-wrap' + (skipped.includes(s.name) ? ' skip-print' : '')}>
            <p className="no-print mx-auto mb-2 max-w-[8.5in] px-1 text-sm font-semibold text-slate-500">{s.name}</p>
            <article className="sheet">{s.content}</article>
          </div>
        ))}
      </div>
    </div>
  )
}
