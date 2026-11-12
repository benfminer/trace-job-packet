// Picks the look of the resume: big cards in the wizard, a small row on the Review & print screen.
import { Check } from 'lucide-react'
import { usePageData } from '../../data/store'
import type { ResumeLayout } from '../../data/packet'
import { RESUME_LAYOUTS, resumeLayout } from '../../data/resume'

const bar = 'block rounded-sm '

// A tiny drawing of each look, so the choice doesn't depend on reading.
function Sketch({ id }: { id: ResumeLayout }) {
  if (id === 'skills') {
    return (
      <span aria-hidden className="flex h-32 w-24 shrink-0 flex-col items-center gap-1.5 rounded border border-slate-300 bg-white p-2">
        <span className={bar + 'h-2.5 w-14 bg-slate-800'} />
        <span className={bar + 'h-px w-full bg-slate-800'} />
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex w-full flex-col gap-1">
            <span className={bar + 'h-2 w-full bg-slate-300'} />
            <span className="flex gap-1">{[0, 1, 2].map((k) => <span key={k} className={bar + 'h-1 flex-1 bg-slate-400'} />)}</span>
          </span>
        ))}
      </span>
    )
  }
  if (id === 'side') {
    return (
      <span aria-hidden className="flex h-32 w-24 shrink-0 flex-col gap-1.5 overflow-hidden rounded border border-slate-300 bg-white">
        <span className="block h-8 w-full bg-[#17324d] p-2"><span className={bar + 'h-2 w-12 bg-white'} /></span>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex gap-1.5 px-2">
            <span className={bar + 'h-1.5 w-5 bg-[#17324d]'} />
            <span className="flex flex-1 flex-col gap-1"><span className={bar + 'h-1 w-full bg-slate-400'} /><span className={bar + 'h-1 w-4/5 bg-slate-400'} /></span>
          </span>
        ))}
      </span>
    )
  }
  return (
    <span aria-hidden className="flex h-32 w-24 shrink-0 flex-col gap-1.5 rounded border border-slate-300 bg-white p-2">
      <span className={bar + 'h-2.5 w-14 bg-slate-800'} />
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex flex-col gap-1">
          <span className={bar + 'h-px w-full bg-[#1e88d2]'} />
          <span className={bar + 'h-1 w-full bg-slate-400'} />
          <span className={bar + 'h-1 w-4/5 bg-slate-400'} />
        </span>
      ))}
    </span>
  )
}

interface LayoutPickerProps {
  // A small row of buttons for the print screen, instead of the big cards.
  compact?: boolean
}

export function LayoutPicker({ compact }: LayoutPickerProps) {
  const { set, packet } = usePageData('resume')
  const picked = resumeLayout(packet)
  if (compact) {
    return (
      <div role="group" aria-label="Resume look" className="flex flex-wrap items-center gap-2 text-slate-700">
        <span className="mr-1 font-semibold">Look:</span>
        {RESUME_LAYOUTS.map((l) => (
          <button key={l.id} type="button" aria-pressed={picked === l.id} onClick={() => set('layout', l.id)}
            className={'rounded-md border px-3 py-1 font-medium transition-colors ' +
              (picked === l.id ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white hover:border-brand hover:text-brand')}>
            {l.name}
          </button>
        ))}
      </div>
    )
  }
  // Side by side, so all three fit on a laptop screen without scrolling.
  return (
    <div role="group" aria-label="Resume look" className="grid gap-3 sm:grid-cols-3">
      {RESUME_LAYOUTS.map((l) => (
        <button key={l.id} type="button" aria-pressed={picked === l.id} onClick={() => set('layout', l.id)}
          className={'relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-colors ' +
            (picked === l.id ? 'border-brand bg-brand-tint' : 'border-slate-200 bg-white hover:border-brand')}>
          <span className={'absolute top-3 right-3 grid size-7 place-items-center rounded-full border-2 ' +
            (picked === l.id ? 'border-brand bg-brand text-white' : 'border-slate-300 bg-white text-transparent')}>
            <Check aria-hidden className="size-4" strokeWidth={3} />
          </span>
          <Sketch id={l.id} />
          <span className="block text-xl font-semibold tracking-tight text-slate-900">{l.name}</span>
          <span className="block text-base text-slate-600">{l.bestFor}</span>
        </button>
      ))}
    </div>
  )
}
