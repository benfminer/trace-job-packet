// Walks through a page one small step at a time, then on to Review & print.
import { useEffect, useState, type ReactNode } from 'react'
import { useStore } from '../data/store'
import type { PageInfo } from '../data/pages'
import { todayIso } from '../data/derive'

export interface WizardStep {
  title: string
  intro?: ReactNode
  content: ReactNode
}

interface WizardProps {
  page: PageInfo
  steps: WizardStep[]
  // Pages with nothing to print (About Me) finish back at Home.
  finishTo?: 'print' | 'home'
}

export function Wizard({ page, steps, finishTo = 'print' }: WizardProps) {
  const { go, update } = useStore()
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const isLast = index === steps.length - 1

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [index])

  const finish = () => {
    if (finishTo === 'print') return go({ view: 'print', page: page.id })
    // Pages with no print view count as done when the last step is finished.
    update((d) => { d.status[page.id] = { done: true, date: todayIso() } })
    go({ view: 'home' })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="text-sm font-bold tracking-wide text-brand uppercase">
        {page.num ? `Page ${page.num}  ·  ` : ''}{page.title}
      </p>
      <nav aria-label="Steps" className="mt-3 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index ? 'step' : undefined}
            className={
              'rounded-full px-3 py-1 text-sm font-medium ' +
              (i === index ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
            }
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </nav>

      <section className="mt-6 space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h2 className="font-serif text-3xl font-bold text-slate-900">{step.title}</h2>
        {step.intro && <div className="text-lg text-slate-600">{step.intro}</div>}
        <div className="space-y-6">{step.content}</div>
      </section>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (index === 0 ? go({ view: 'home' }) : setIndex(index - 1))}
          className="rounded-xl border-2 border-slate-300 bg-white px-5 py-3 text-lg font-semibold text-slate-700 hover:border-slate-400"
        >
          ← {index === 0 ? 'Home' : 'Back'}
        </button>
        <span className="text-slate-500">Step {index + 1} of {steps.length}</span>
        <button
          type="button"
          onClick={() => (isLast ? finish() : setIndex(index + 1))}
          className="rounded-xl bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-dark"
        >
          {isLast ? (finishTo === 'print' ? 'Review & print →' : 'Done →') : 'Next →'}
        </button>
      </div>
    </div>
  )
}
