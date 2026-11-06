// Always-visible bar: logo (goes Home), the student's name, Home, Save, and Close.
import { Download, House, X } from 'lucide-react'
import { useStore } from '../data/store'
import { fullName } from '../data/derive'

interface TopBarProps {
  dirty: boolean
  onSave: () => void
  onClose: () => void
}

const barButton =
  'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-medium transition-colors '
const ghost = barButton + 'border-white/25 text-white hover:bg-white/10'

export function TopBar({ dirty, onSave, onClose }: TopBarProps) {
  const { packet, go } = useStore()
  const p = packet.profile
  const name = fullName(p)
  const initials = (p.firstName.charAt(0) + p.lastName.charAt(0)).toUpperCase()
  return (
    <header className="top-bar no-print sticky top-0 z-20 h-16 border-b border-white/10 text-white">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-4 px-4">
        <button type="button" onClick={() => go({ view: 'home' })} className="flex items-center gap-2.5 text-left">
          <span className="grid size-9 place-items-center rounded-lg bg-white text-lg font-bold text-brand-dark shadow-sm">T</span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-wide">TRACE</span>
            <span className="block text-xs text-brand-soft">Job Readiness Packet</span>
          </span>
        </button>
        <span className="hidden h-7 w-px bg-white/20 sm:block" />
        <span className="hidden items-center gap-2 text-[15px] font-medium text-[#e2e4ff] sm:flex">
          {initials && <span className="grid size-7 place-items-center rounded-full bg-white/15 text-xs font-semibold">{initials}</span>}
          {name || 'New student'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {dirty && <span className="hidden text-sm font-medium text-amber-200 md:inline">Not saved yet</span>}
          <button type="button" onClick={() => go({ view: 'home' })} className={ghost}>
            <House aria-hidden className="size-4" /><span className="hidden sm:inline">Home</span>
            <span className="sr-only sm:hidden">Home</span>
          </button>
          <button type="button" onClick={onSave}
            className={barButton + (dirty
              ? 'border-amber-400 bg-amber-400 font-semibold text-slate-900 hover:bg-amber-300'
              : 'border-white/25 text-white hover:bg-white/10')}>
            <Download aria-hidden className="size-4" />Save
          </button>
          <button type="button" onClick={onClose} className={ghost}>
            Close<X aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
