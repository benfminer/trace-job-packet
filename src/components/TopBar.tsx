// Always-visible bar: Home, the student's name, Save, and Close.
import { useStore } from '../data/store'
import { fullName } from '../data/derive'

interface TopBarProps {
  dirty: boolean
  onSave: () => void
  onClose: () => void
}

export function TopBar({ dirty, onSave, onClose }: TopBarProps) {
  const { packet, go } = useStore()
  return (
    <header className="no-print sticky top-0 z-20 h-16 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-full max-w-5xl items-center gap-3 px-4">
        <button type="button" onClick={() => go({ view: 'home' })} className="text-left">
          <span className="block text-xs font-bold tracking-wide text-brand uppercase">TRACE Job Packet</span>
          <span className="block font-serif text-lg font-bold text-slate-900">{fullName(packet.profile) || 'New student'}</span>
        </button>
        <button type="button" onClick={() => go({ view: 'home' })}
          className="ml-2 rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100">⌂ Home</button>
        <div className="ml-auto flex items-center gap-2">
          {dirty && <span className="hidden text-sm font-semibold text-amber-700 sm:inline">Not saved yet</span>}
          <button type="button" onClick={onSave}
            className={'rounded-lg px-4 py-2 font-semibold ' + (dirty ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>
            Save
          </button>
          <button type="button" onClick={onClose}
            className="rounded-lg border-2 border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:border-slate-400">
            Close
          </button>
        </div>
      </div>
    </header>
  )
}
