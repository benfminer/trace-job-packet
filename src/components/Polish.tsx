// "Polish it" steps shared by the resume and cover letter: copy a prompt, paste it into Gemini,
// check what changed, and paste the better wording back into the app.
import { useEffect, useState, type ReactNode } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { Tip } from './fields'
import { btnPrimary, btnSecondary } from './styles'

const GEMINI_URL = 'https://gemini.google.com/app'

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-lg font-semibold text-white">{n}</span>
      <div className="min-w-0 flex-1 space-y-3">
        <h3 className="pt-1 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
        {children}
      </div>
    </li>
  )
}

interface PolishProps {
  // The whole prompt, with the student's wording at the end. Empty when there's nothing to polish yet.
  prompt: string
  emptyNote: string
  // Where the better wording gets pasted back.
  children: ReactNode
}

export function Polish({ prompt, emptyNote, children }: PolishProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 2500)
    return () => clearTimeout(t)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  if (!prompt) return <Tip>{emptyNote}</Tip>
  return (
    <>
      <Tip>
        <b>This step is your choice.</b> Gemini is an AI helper. It can fix spelling and grammar and make your sentences
        read better. It is <b>not</b> allowed to add anything you didn't do. You are the boss of what goes on your page.
      </Tip>
      <ol className="space-y-7">
        <Step n={1} title="Copy the instructions">
          <p className="text-slate-700">This copies the rules for Gemini and your own wording, all in one piece.</p>
          <button type="button" onClick={copy} className={btnPrimary + (state === 'copied' ? ' bg-green-700 hover:bg-green-700' : '')}>
            {state === 'copied' ? <Check aria-hidden className="size-5" /> : <Copy aria-hidden className="size-5" />}
            <span aria-live="polite">{state === 'copied' ? 'Copied' : 'Copy for Gemini'}</span>
          </button>
          <details className="rounded-lg border border-slate-200">
            <summary className="cursor-pointer px-4 py-2 font-semibold text-brand select-none">
              {state === 'failed' ? "Copying didn't work. Open this, select it all, and copy it" : 'See what gets copied'}
            </summary>
            <pre className="max-h-80 overflow-auto border-t border-slate-200 bg-slate-50 p-4 font-sans text-sm whitespace-pre-wrap text-slate-800 select-all">{prompt}</pre>
          </details>
        </Step>
        <Step n={2} title="Paste it into Gemini">
          <p className="text-slate-700">
            Open Gemini with your school Google account. Click in the message box, press <kbd className="rounded border border-slate-300 px-1.5 font-mono text-sm">Ctrl</kbd> + <kbd className="rounded border border-slate-300 px-1.5 font-mono text-sm">V</kbd> to paste, and send it.
          </p>
          <a href={GEMINI_URL} target="_blank" rel="noreferrer" className={btnSecondary}>
            <ExternalLink aria-hidden className="size-5" />Open Gemini
          </a>
        </Step>
        <Step n={3} title="Check what it changed">
          <ul className="list-disc space-y-1 pl-6 text-slate-700">
            <li>Read <b>What I changed</b> with your teacher.</li>
            <li>Did it add something you didn't do? <b>Don't use that part.</b></li>
            <li>Does it still sound like you? If not, keep your own words.</li>
          </ul>
        </Step>
        <Step n={4} title="Paste the better wording here">
          {children}
        </Step>
      </ol>
    </>
  )
}
