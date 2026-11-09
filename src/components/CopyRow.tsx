// One answer with a Copy button, for pasting into an online job application.
import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { btnSecondary } from './styles'

interface CopyRowProps {
  label: string
  value: string
}

export function CopyRow({ label, value }: CopyRowProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(t)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <div className="flex items-start gap-3 border-t border-slate-100 py-2.5 first:border-t-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="text-lg break-words whitespace-pre-line text-slate-900 select-all">{value}</p>
      </div>
      <button type="button" onClick={copy} aria-label={`Copy ${label}`}
        className={btnSecondary + ' shrink-0 ' + (state === 'copied' ? 'border-green-600 text-green-700' : '')}>
        {state === 'copied' ? <Check aria-hidden className="size-5" /> : <Copy aria-hidden className="size-5" />}
        <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Select it instead' : 'Copy'}</span>
      </button>
    </div>
  )
}
