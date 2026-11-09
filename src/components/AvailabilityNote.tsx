// Shown on the resume and cover letter when the Weekly Availability page (05) is still empty.
import { CalendarDays } from 'lucide-react'
import { useStore } from '../data/store'
import { availabilitySentence } from '../data/derive'
import { Tip } from './fields'
import { btnSecondary } from './styles'

export function AvailabilityNote() {
  const { packet, go } = useStore()
  if (availabilitySentence(packet.profile)) return null
  return (
    <Tip>
      <p>You haven't filled in your <b>Weekly Availability</b> page yet, so there's nothing to show here.</p>
      <button type="button" onClick={() => go({ view: 'edit', page: 'availability' })} className={btnSecondary + ' mt-2'}>
        <CalendarDays aria-hidden className="size-5" />Set my schedule
      </button>
    </Tip>
  )
}
