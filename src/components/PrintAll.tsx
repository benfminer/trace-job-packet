// Prints the whole folder: the cover page, then every page picked below.
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Printer } from 'lucide-react'
import { useStore } from '../data/store'
import { PAGES } from '../data/pages'
import { fullName, shortDate, todayIso } from '../data/derive'
import { PAGE_SHEETS } from '../pages/sheets'
import { Box, Callout, FieldTable, HandoutFooter, HSection } from './handout'
import { PageBand } from './PageBand'
import { printedPageHeight, sheetClass, sheetLabelWidth, type Sheet } from './sheet'
import { btnPrimary, btnSecondary } from './styles'

const pick = 'flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-base transition-colors ' +
  'hover:border-slate-300 has-[:checked]:border-brand has-[:checked]:bg-brand-tint'

const PRINTABLE = PAGES.filter((p) => p.id !== 'about')

function CoverSheet() {
  const { packet } = useStore()
  return (
    <>
      <p className="h-subtitle">TRACE  |  San Diego Unified</p>
      <h1 className="h-title" style={{ fontSize: '30pt', marginTop: '4pt' }}>Job Readiness Packet</h1>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '13pt', color: '#444' }}>Everything I need to apply, interview, and start a job.</p>
      <div className="mt-4">
        <FieldTable rows={[
          [['Student name', fullName(packet.profile)]],
          [['Teacher', packet.teacher], ['Case manager', packet.caseManager]],
          [['Packet started', shortDate(packet.packetStarted)], ['Last reviewed', shortDate(todayIso())]],
        ]} />
      </div>
      <HSection title="What's in my folder" note="Check off each page as we finish it.">
        <table className="h-table">
          <thead><tr><th className="center" style={{ width: '6%' }}>#</th><th style={{ width: '32%' }}>Page</th><th>What it's for</th><th className="center" style={{ width: '8%' }}>Done</th><th style={{ width: '12%' }}>Date</th></tr></thead>
          <tbody>
            {PRINTABLE.map((p) => {
              const s = packet.status[p.id]
              return (
                <tr key={p.id}>
                  <td className="center">{p.num}</td><th>{p.title}</th><td>{p.purpose}</td>
                  <td className="center"><Box on={s.done} /></td><td>{shortDate(s.date)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HSection>
      <Callout>
        <b>Keep this folder safe.</b> Bring it when you apply for jobs. Update it when your phone, address, or schedule
        changes. Never put your Social Security number or passwords in it.
      </Callout>
      <HandoutFooter page="Cover" />
    </>
  )
}

// How many printed pages a hidden copy of a sheet takes. Table rows and .keep-together blocks don't split, and section titles
// stay with what follows them (index.css), so one that would cross a page edge moves down to the next page.
function countPages(el: HTMLElement, pageHeight: number) {
  const start = el.getBoundingClientRect().top
  let pushed = 0
  for (const part of el.querySelectorAll('tr, .keep-together, .h-section-title')) {
    const box = part.getBoundingClientRect()
    const top = box.top - start + pushed
    // A title needs room for a line of what follows it.
    const bottom = box.bottom - start + pushed + (part.matches('.h-section-title') ? 24 : 0)
    const pageEnd = (Math.floor(top / pageHeight) + 1) * pageHeight
    if (bottom > pageEnd && bottom - top < pageHeight) pushed += pageEnd - top
  }
  return Math.max(1, Math.ceil((el.offsetHeight + pushed - 1) / pageHeight))
}

// Counts how many printed pages each sheet takes, from hidden copies laid out at print width.
function usePageCounts(sheets: Sheet[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState<number[]>([])
  useEffect(() => {
    const box = ref.current
    if (!box) return
    const measure = () => {
      const next = [...box.children].map((el, i) => countPages(el as HTMLElement, printedPageHeight(sheets[i])))
      setCounts((old) => (old.join() === next.join() ? old : next))
    }
    const watch = new ResizeObserver(measure)
    for (const el of box.children) watch.observe(el)
    return () => watch.disconnect()
  }, [sheets])
  const measurer = (
    <div ref={ref} aria-hidden className="sheet-measure no-print">
      {sheets.map((s) => <article key={s.name} className={sheetClass(s)}>{s.content}</article>)}
    </div>
  )
  return { counts, measurer }
}

export function PrintAll() {
  const { packet, go } = useStore()
  const [cover, setCover] = useState(true)
  const [twoSided, setTwoSided] = useState(false)
  const [picked, setPicked] = useState(() => PRINTABLE.filter((p) => packet.status[p.id].done).map((p) => p.id))
  const sheets: Sheet[] = useMemo(() => [
    ...(cover ? [{ name: 'Cover page', content: <CoverSheet /> }] : []),
    ...PRINTABLE.filter((p) => picked.includes(p.id)).flatMap((p) => {
      const list = PAGE_SHEETS[p.id as keyof typeof PAGE_SHEETS]
      return list.map((s) => ({ ...s, name: `${p.num}. ${p.title}` + (list.length > 1 ? `: ${s.name}` : '') }))
    }),
  ], [cover, picked])
  const { counts, measurer } = usePageCounts(sheets)
  // Two-sided: a sheet with an odd page count gets a blank back, so every sheet starts on new paper.
  const blankAfter = (i: number) => twoSided && i < sheets.length - 1 && (counts[i] ?? 1) % 2 === 1
  const toggle = (id: (typeof picked)[number], on: boolean) => setPicked(on ? [...picked, id] : picked.filter((x) => x !== id))

  return (
    <div>
      <PageBand eyebrow="Print all" title="Print the whole folder" width="max-w-6xl">
        Pick the pages, then print them all at once or save them as one PDF.
      </PageBand>
      <div className="no-print mx-auto -mt-14 max-w-6xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => go({ view: 'home' })} className={btnSecondary}>
              <ArrowLeft aria-hidden className="size-5" />Home
            </button>
            <button type="button" onClick={() => window.print()} disabled={sheets.length === 0} className={btnPrimary}>
              <Printer aria-hidden className="size-5" />Print / Save as PDF
            </button>
            <label className="flex cursor-pointer items-center gap-2 font-semibold text-slate-700">
              <input type="checkbox" className="size-5 accent-brand" checked={twoSided} onChange={(e) => setTwoSided(e.target.checked)} />
              Printing two-sided
            </label>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 tabular-nums">
              {sheets.length} sheet{sheets.length === 1 ? '' : 's'} picked
            </span>
          </div>
          {twoSided && (
            <p className="mt-3 text-slate-600">
              Turn on two-sided in the print window too. One-page sheets get a blank back, so each sheet starts on its own paper.
            </p>
          )}
          <fieldset className="mt-5 border-t border-slate-100 pt-4">
            <legend className="sr-only">What to print</legend>
            <p className="font-semibold text-slate-800">What to print</p>
            <p className="text-slate-500">Pages marked done are picked for you.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <label className={pick}>
                <input type="checkbox" className="size-5 accent-brand" checked={cover} onChange={(e) => setCover(e.target.checked)} />
                Cover page
              </label>
              {PRINTABLE.map((p) => (
                <label key={p.id} className={pick}>
                  <input type="checkbox" className="size-5 accent-brand" checked={picked.includes(p.id)} onChange={(e) => toggle(p.id, e.target.checked)} />
                  <span className="flex-1">{p.num}. {p.title}</span>
                  {packet.status[p.id].done && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-800 ring-1 ring-green-200">
                      <Check aria-hidden className="size-3" />Done
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="sheets py-8">
        {sheets.map((s, i) => (
          <Fragment key={s.name}>
            <div className="sheet-wrap">
              <p className={`no-print mx-auto mb-2 px-1 text-sm font-semibold text-slate-500 ${sheetLabelWidth(s)}`}>{s.name}</p>
              <article className={sheetClass(s)}>{s.content}</article>
            </div>
            {blankAfter(i) && <div className="sheet-wrap duplex-blank" />}
          </Fragment>
        ))}
      </div>
      {measurer}
    </div>
  )
}
