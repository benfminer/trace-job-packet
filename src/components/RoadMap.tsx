// Home's map: one winding road with a stop for every packet page, in working order.
// Done stops are checked, the road is filled in up to "you are here", and the rest is still ahead.
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Check, ClipboardCopy, Flag, MailCheck, MapPin, Minus, Printer, type LucideIcon } from 'lucide-react'
import { useStore, type Route } from '../data/store'
import { GROUPS, canSkip, isSkipped, nextPage, pageInfo, type PageInfo } from '../data/pages'
import type { PageStatus } from '../data/packet'
import { shortDate } from '../data/derive'
import { PAGE_ICONS } from './icons'
import { btnPrimary, btnSecondary } from './styles'

type Stop =
  | { kind: 'page'; page: PageInfo }
  | { kind: 'tool'; icon: LucideIcon; title: string; text: string; button: string; to: Route }
  | { kind: 'finish' }
type Row = Stop | { kind: 'sign'; n: number; title: string; note: string }

const TOOLS: Stop[] = [
  { kind: 'tool', icon: ClipboardCopy, title: 'Applying now', text: 'Filling out an application on the computer? Copy each answer and paste it in.', button: 'Copy my answers', to: { view: 'apply' } },
  { kind: 'tool', icon: MailCheck, title: 'After the interview', text: 'Send a thank-you note and write down how it went.', button: 'Open', to: { view: 'after' } },
]

// Signposts for the three stages, then every stop, ending at the finish flag.
const ROWS: Row[] = [
  ...GROUPS.flatMap((g, n): Row[] => [
    { kind: 'sign', n: n + 1, title: g.title, note: g.note },
    ...g.ids.map((id): Row => ({ kind: 'page', page: pageInfo(id) })),
  ]),
  ...TOOLS,
  { kind: 'finish' },
]

const STOPS = ROWS.filter((r): r is Stop => r.kind !== 'sign')

type Point = { x: number; y: number }

// A smooth line through the stops: each bend leaves and arrives going straight down.
function roadPath(points: Point[]) {
  return points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const mid = (points[i - 1].y + p.y) / 2
    return `C ${points[i - 1].x} ${mid} ${p.x} ${mid} ${p.x} ${p.y}`
  }).join(' ')
}

const chip = 'rounded-full px-2.5 py-0.5 text-sm font-semibold '

function StatusChip({ status }: { status: PageStatus }) {
  if (status.skipped && !status.done) return <span className={chip + 'bg-slate-100 text-slate-600'}>Skipped</span>
  if (status.done) {
    return <span className={chip + 'inline-flex items-center gap-1 bg-green-50 text-green-800 ring-1 ring-green-200'}><Check aria-hidden className="size-3.5" />Done {shortDate(status.date)}</span>
  }
  if (status.started) return <span className={chip + 'bg-brand-tint text-brand-dark'}>In progress</span>
  return <span className={chip + 'bg-slate-100 text-slate-600'}>Not started</span>
}

interface StopRowProps {
  index: number
  // The round marker on the road. Clicking it opens the stop.
  node: ReactNode
  nodeLabel: string
  onOpen: () => void
  nodeRef: (el: HTMLElement | null) => void
  here?: boolean
  children: ReactNode
}

// One stop: its marker on the road and its card beside it. Cards switch sides so the road winds.
function StopRow({ index, node, nodeLabel, onOpen, nodeRef, here, children }: StopRowProps) {
  const left = index % 2 === 0
  return (
    <li id={here ? 'here' : undefined} className="relative grid grid-cols-[4.5rem_1fr] items-center gap-x-3 py-3 lg:grid-cols-[1fr_9rem_1fr] lg:gap-x-6">
      <div className={'col-start-1 row-start-1 flex justify-center lg:col-start-2 ' + (left ? '-translate-x-1.5 lg:-translate-x-9' : 'translate-x-1.5 lg:translate-x-9')}>
        <button ref={nodeRef} type="button" onClick={onOpen} aria-label={nodeLabel} className="road-node relative rounded-full">
          {here && <span aria-hidden className="road-pulse absolute inset-0 rounded-full" />}
          {node}
        </button>
      </div>
      <div className={'anim-rise col-start-2 row-start-1 w-full max-w-md ' + (left ? 'lg:col-start-1 lg:justify-self-end' : 'lg:col-start-3')}
        style={{ animationDelay: `${index * 45}ms`, animationFillMode: 'backwards' }}>
        {children}
      </div>
    </li>
  )
}

const nodeBase = 'relative grid place-items-center rounded-full border-[3px] shadow-sm transition-transform '
const cardBase = 'rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow '

export function RoadMap() {
  const { packet, go, update } = useStore()
  const box = useRef<HTMLOListElement>(null)
  const nodes = useRef<(HTMLElement | null)[]>([])
  const [points, setPoints] = useState<Point[]>([])

  // The road is drawn through wherever the markers really are, so it fits any screen width.
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const origin = el.getBoundingClientRect()
      const next = nodes.current.filter((n) => n !== null).map((n) => {
        const r = n.getBoundingClientRect()
        return { x: Math.round(r.left + r.width / 2 - origin.left), y: Math.round(r.top + r.height / 2 - origin.top) }
      })
      setPoints((old) => (JSON.stringify(old) === JSON.stringify(next) ? old : next))
    }
    measure()
    const watch = new ResizeObserver(measure)
    watch.observe(el)
    return () => watch.disconnect()
  }, [])

  const next = nextPage(packet.status)
  // "You are here" is the first page that isn't done. With every page done, the whole road is filled in.
  const hereIndex = next ? STOPS.findIndex((s) => s.kind === 'page' && s.page.id === next.id) : STOPS.length - 1

  return (
    <ol ref={box} className="relative mt-8">
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="road-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#16a34a" /><stop offset="1" stopColor="#533afd" />
          </linearGradient>
        </defs>
        {points.length > 1 && (
          <>
            <path d={roadPath(points)} fill="none" stroke="#e5edf5" strokeWidth="22" strokeLinecap="round" />
            <path d={roadPath(points)} fill="none" stroke="#c9d5e3" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 12" />
            {hereIndex > 0 && (
              <path className="road-draw" d={roadPath(points.slice(0, hereIndex + 1))} pathLength={1} fill="none"
                stroke="url(#road-fill)" strokeWidth="10" strokeLinecap="round" strokeDasharray="1" />
            )}
          </>
        )}
      </svg>

      {ROWS.map((row) => {
        if (row.kind === 'sign') {
          return (
            <li key={row.title} className="relative flex py-4 lg:justify-center">
              <div className="rounded-full border border-slate-200 bg-white px-5 py-2 text-center shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">{row.n}. {row.title}</h2>
                <p className="text-sm text-slate-600">{row.note}</p>
              </div>
            </li>
          )
        }
        const i = STOPS.indexOf(row)
        const ref = (el: HTMLElement | null) => { nodes.current[i] = el }

        if (row.kind === 'finish') {
          const all = !next
          return (
            <StopRow key="finish" index={i} nodeRef={ref} nodeLabel="Print all" onOpen={() => go({ view: 'printAll' })}
              node={<span className={nodeBase + 'size-16 ' + (all ? 'border-amber-400 bg-amber-400 text-slate-900' : 'border-slate-300 bg-white text-slate-400')}><Flag className="size-7" /></span>}>
              <div className={cardBase + (all ? 'border-amber-300' : 'border-dashed border-slate-300')}>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">{all ? 'Packet complete!' : 'Finish line'}</h3>
                <p className="text-slate-600">{all ? 'Every page on your road is done. Print the whole folder.' : 'When every page is done, print the whole folder.'}</p>
                {all && <button type="button" onClick={() => go({ view: 'printAll' })} className={btnPrimary + ' mt-3'}><Printer aria-hidden className="size-5" />Print all</button>}
              </div>
            </StopRow>
          )
        }

        if (row.kind === 'tool') {
          const Icon = row.icon
          return (
            <StopRow key={row.title} index={i} nodeRef={ref} nodeLabel={row.title} onOpen={() => go(row.to)}
              node={<span className={nodeBase + 'size-11 border-brand-soft bg-brand-tint text-brand'}><Icon className="size-5" /></span>}>
              <div className={cardBase + 'flex flex-wrap items-center gap-3 border-slate-200'}>
                <div className="min-w-40 flex-1">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">{row.title}</h3>
                  <p className="text-slate-600">{row.text}</p>
                </div>
                <button type="button" onClick={() => go(row.to)} className={btnSecondary + ' py-1.5'}>{row.button}</button>
              </div>
            </StopRow>
          )
        }

        const { page } = row
        const status = packet.status[page.id]
        const here = page.id === next?.id
        const skipped = isSkipped(packet.status, page.id)
        const setSkipped = (on: boolean) => update((d) => { d.status[page.id].skipped = on })
        const Icon = status.done ? Check : skipped ? Minus : PAGE_ICONS[page.id]
        const look = status.done ? 'border-green-600 bg-green-600 text-white'
          : skipped ? 'border-slate-300 bg-slate-100 text-slate-400'
          : here ? 'border-brand bg-brand text-white'
          : status.started ? 'border-brand bg-white text-brand'
          : 'border-slate-300 bg-white text-slate-400'
        const open = () => go({ view: 'edit', page: page.id })
        return (
          <StopRow key={page.id} index={i} nodeRef={ref} here={here} nodeLabel={`Open ${page.title}`} onOpen={open}
            node={<span className={nodeBase + 'size-14 ' + look}><Icon key={String(status.done)} className={'size-6' + (status.done ? ' road-pop' : '')} strokeWidth={status.done ? 3 : 2} /></span>}>
            <article className={cardBase + (here ? 'border-brand ring-4 ring-brand/10' : skipped ? 'border-dashed border-slate-300 bg-slate-50' : 'border-slate-200 hover:border-slate-300')}>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{page.num ? `Page ${page.num}` : 'Fill this in first'}</p>
                {here && (
                  <span className={chip + 'inline-flex items-center gap-1 bg-brand text-white'}><MapPin aria-hidden className="size-3.5" />You are here</span>
                )}
              </div>
              <h3 className={'mt-0.5 text-lg font-semibold tracking-tight ' + (skipped ? 'text-slate-500' : 'text-slate-900')}>{page.title}</h3>
              <p className="text-slate-600">{skipped ? "Doesn't apply to this student." : page.purpose}</p>
              <div className="mt-3 flex items-center gap-2">
                <StatusChip status={status} />
                <span className="flex-1" />
                {skipped && <button type="button" onClick={() => setSkipped(false)} className={btnSecondary + ' py-1.5'}>Bring back</button>}
                {canSkip(page.id) && !status.done && !skipped && (
                  <button type="button" onClick={() => setSkipped(true)} aria-label={`Skip ${page.title}`}
                    className="px-1 text-sm font-semibold text-slate-500 underline hover:text-brand">
                    Skip
                  </button>
                )}
                {/* About Me has nothing to print. */}
                {!skipped && page.num && (
                  <button type="button" onClick={() => go({ view: 'print', page: page.id })} aria-label={`Print ${page.title}`}
                    className="rounded-md border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-brand hover:text-brand">
                    <Printer aria-hidden className="size-5" />
                  </button>
                )}
                {!skipped && (
                  <button type="button" onClick={open} className={(here ? btnPrimary : btnSecondary) + ' py-1.5'}>
                    {status.done ? 'Edit' : status.started ? 'Continue' : 'Start'}
                  </button>
                )}
              </div>
            </article>
          </StopRow>
        )
      })}
    </ol>
  )
}
