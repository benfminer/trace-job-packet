// A small sideways copy of Home's road, for the top of a page: every packet page as a dot, a pin on
// the one you're on. The pin slides along the road when you move to another page.
import { Check, Minus } from 'lucide-react'
import { useStore } from '../data/store'
import { WORK_ORDER, isSkipped, nextPage } from '../data/pages'
import type { PageId } from '../data/packet'
import { PAGE_ICONS } from './icons'

interface RoadStripProps {
  // The page the pin sits on.
  here: string
  big?: boolean
}

const N = WORK_ORDER.length
const H = 56
// Stops sit a little above and below the middle so the road winds.
const y = (i: number) => H / 2 + (i % 2 ? 7 : -7)
const x = (i: number) => i * 100 + 50

// Drawn 100 units per stop and stretched to fit, so it needs no measuring.
function stripPath(count: number) {
  return Array.from({ length: count }, (_, i) =>
    i === 0 ? `M ${x(0)} ${y(0)}` : `C ${x(i - 1) + 50} ${y(i - 1)} ${x(i) - 50} ${y(i)} ${x(i)} ${y(i)}`).join(' ')
}

export function RoadStrip({ here, big }: RoadStripProps) {
  const { packet, go } = useStore()
  const hereIndex = Math.max(0, WORK_ORDER.findIndex((p) => p.id === here))
  const next = nextPage(packet.status)
  // The road is filled in up to the first page that isn't done, the same as on Home.
  const reached = next ? WORK_ORDER.findIndex((p) => p.id === next.id) : N - 1
  const size = big ? 'size-11' : 'size-8'
  const edge = hereIndex === 0 ? '-translate-x-4' : hereIndex === N - 1 ? '-translate-x-[calc(100%-1rem)]' : '-translate-x-1/2'
  return (
    <nav aria-label="Where this page is in the packet" className="overflow-x-auto">
      <div className="relative min-w-[36rem] pt-9">
        <p className="road-pin absolute top-0 z-10 w-max" style={{ left: `${((hereIndex + 0.5) / N) * 100}%` }}>
          <span className={'block rounded-full bg-amber-400 px-3 py-0.5 text-sm font-semibold whitespace-nowrap text-slate-900 shadow ' + edge}>
            {WORK_ORDER[hereIndex].title}
          </span>
        </p>
        <div className="relative" style={{ height: H }}>
          <svg aria-hidden viewBox={`0 0 ${N * 100} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <path d={stripPath(N)} fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth={big ? 8 : 6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {reached > 0 && <path d={stripPath(reached + 1)} fill="none" stroke="#fff" strokeWidth={big ? 8 : 6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
          </svg>
          <ol className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
            {WORK_ORDER.map((p, i) => {
              const status = packet.status[p.id as PageId]
              const current = i === hereIndex
              const skipped = isSkipped(packet.status, p.id)
              const Icon = status.done ? Check : skipped ? Minus : PAGE_ICONS[p.id]
              return (
                <li key={p.id} className="grid place-items-center" style={{ transform: `translateY(${y(i) - H / 2}px)` }}>
                  <button type="button" onClick={() => go({ view: 'edit', page: p.id })} title={p.title}
                    aria-label={p.title + (status.done ? ' (done)' : skipped ? ' (skipped)' : '')} aria-current={current ? 'page' : undefined}
                    className={`road-node grid ${size} place-items-center rounded-full border-2 transition-colors ` +
                      (current ? 'border-amber-400 bg-amber-400 text-slate-900 ring-4 ring-amber-400/30'
                        : status.done ? 'border-white bg-white text-green-700'
                        : skipped ? 'border-dashed border-white/30 bg-[#4032c8] text-white/40 hover:text-white'
                        : 'border-white/40 bg-[#4032c8] text-white/80 hover:border-white hover:text-white')}>
                    <Icon key={String(status.done)} aria-hidden className={(big ? 'size-5' : 'size-4') + (status.done ? ' road-pop' : '')} strokeWidth={status.done ? 3 : 2} />
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </nav>
  )
}
