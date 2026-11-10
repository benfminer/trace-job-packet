// Shown for a moment after "Done, next": the finished stop gets its check, the pin travels down the
// road to the next stop, then the next page opens by itself. One click skips the wait.
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Map } from 'lucide-react'
import { useStore } from '../data/store'
import { nextPage, pageInfo } from '../data/pages'
import type { PageId } from '../data/packet'
import { RoadStrip } from './RoadStrip'

const TRAVEL_MS = 900
const LEAVE_MS = 3200

export function TripScreen() {
  const { packet, go, route } = useStore()
  const from = pageInfo(('page' in route ? route.page : 'about') as PageId)
  const next = nextPage(packet.status, from.id)
  const [moved, setMoved] = useState(false)
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Replaces this screen in the browser history, so Back from the next page doesn't land here again.
  const onward = () => go(next ? { view: 'edit', page: next.id } : { view: 'home' }, true)

  useEffect(() => {
    const move = setTimeout(() => setMoved(true), TRAVEL_MS)
    // Anyone who has asked their computer for less motion moves on with the button instead of a timer.
    const leave = still ? undefined : setTimeout(onward, LEAVE_MS)
    return () => { clearTimeout(move); clearTimeout(leave) }
    // Runs once when the screen appears.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page-band min-h-[calc(100vh-4rem)] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-16 text-center">
        <span className="road-pop mx-auto grid size-20 place-items-center rounded-full bg-white text-green-600 shadow-xl">
          <Check aria-hidden className="size-10" strokeWidth={3} />
        </span>
        <h1 className="screen-title mt-5 text-4xl font-semibold">{from.title} is done!</h1>
        <p aria-live="polite" className="mt-2 text-xl text-[#e2e4ff]">
          {next ? <>Next stop: <b className="text-white">{next.title}</b></> : 'That was the last page. The packet is complete!'}
        </p>
        <div className="mt-10 text-left">
          <RoadStrip big here={moved && next ? next.id : from.id} />
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => go({ view: 'home' }, true)}
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10">
            <Map aria-hidden className="size-5" />See the whole map
          </button>
          <button type="button" onClick={onward} autoFocus
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-white px-6 py-3 text-lg font-semibold text-brand-dark shadow-xl transition-transform hover:-translate-y-0.5">
            {!still && <span aria-hidden className="trip-timer absolute inset-y-0 left-0 bg-brand-tint" style={{ animationDuration: `${LEAVE_MS}ms` }} />}
            <span className="relative inline-flex items-center gap-2">{next ? 'Keep going' : 'Back to the map'}<ArrowRight aria-hidden className="size-5" /></span>
          </button>
        </div>
      </div>
    </div>
  )
}
