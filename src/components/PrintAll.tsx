// Prints the whole folder: the cover page, then every page picked below.
import { useState } from 'react'
import { useStore } from '../data/store'
import { PAGES } from '../data/pages'
import { fullName, shortDate, todayIso } from '../data/derive'
import { PAGE_SHEETS } from '../pages/sheets'
import { Box, Callout, FieldTable, HandoutFooter, HSection } from './handout'

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

export function PrintAll() {
  const { packet, go } = useStore()
  const [cover, setCover] = useState(true)
  const [picked, setPicked] = useState(() => PRINTABLE.filter((p) => packet.status[p.id].done).map((p) => p.id))
  const sheets = [
    ...(cover ? [{ name: 'Cover page', content: <CoverSheet /> }] : []),
    ...PRINTABLE.filter((p) => picked.includes(p.id)).flatMap((p) => {
      const list = PAGE_SHEETS[p.id as keyof typeof PAGE_SHEETS]
      return list.map((s) => ({ ...s, name: `${p.num}. ${p.title}` + (list.length > 1 ? `: ${s.name}` : '') }))
    }),
  ]
  const toggle = (id: (typeof picked)[number], on: boolean) => setPicked(on ? [...picked, id] : picked.filter((x) => x !== id))

  return (
    <div>
      <div className="no-print border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => go({ view: 'home' })}
              className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-slate-400">
              ← Home
            </button>
            <button type="button" onClick={() => window.print()} disabled={sheets.length === 0}
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
              Print / Save as PDF
            </button>
            <span className="text-slate-600">{sheets.length} sheet{sheets.length === 1 ? '' : 's'} picked</span>
          </div>
          <fieldset className="mt-4">
            <legend className="font-semibold text-slate-800">What to print (pages marked done are picked for you):</legend>
            <div className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-lg">
                <input type="checkbox" className="size-5 accent-brand" checked={cover} onChange={(e) => setCover(e.target.checked)} />
                Cover page
              </label>
              {PRINTABLE.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-lg">
                  <input type="checkbox" className="size-5 accent-brand" checked={picked.includes(p.id)} onChange={(e) => toggle(p.id, e.target.checked)} />
                  {p.num}. {p.title}
                  {packet.status[p.id].done && <span className="text-sm font-semibold text-green-700">✓ done</span>}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="sheets py-6">
        {sheets.map((s) => (
          <div key={s.name} className="sheet-wrap">
            <p className="no-print mx-auto mb-2 max-w-[8.5in] px-1 text-sm font-semibold text-slate-500">{s.name}</p>
            <article className="sheet">{s.content}</article>
          </div>
        ))}
      </div>
    </div>
  )
}
