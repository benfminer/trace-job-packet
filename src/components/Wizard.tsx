// Walks through a page one small step at a time, then on to Review & print.
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useStore } from '../data/store'
import { canSkip, isSkipped, type PageInfo } from '../data/pages'
import { todayIso } from '../data/derive'
import { PageBand, ProgressBar } from './PageBand'

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

interface StepListProps {
  steps: WizardStep[]
  index: number
  onPick: (i: number) => void
}

// Sidebar on wide screens. Steps before the current one get a check.
function StepList({ steps, index, onPick }: StepListProps) {
  return (
    <nav aria-label="Steps" className="sticky top-20 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl lg:block">
      <div className="border-b border-slate-100 px-2 pt-1 pb-3">
        <p className="mb-2 flex justify-between text-sm text-slate-500">
          <span>Progress</span><span>Step {index + 1} of {steps.length}</span>
        </p>
        <ProgressBar value={(index + 1) / steps.length} label="Steps" />
      </div>
      <ol className="mt-2 space-y-0.5">
        {steps.map((s, i) => {
          const current = i === index
          const passed = i < index
          return (
            <li key={s.title}>
              <button type="button" onClick={() => onPick(i)} aria-current={current ? 'step' : undefined}
                className={'flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-base transition-colors ' +
                  (current ? 'bg-brand-tint font-semibold text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}>
                <span className={'grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] text-xs font-semibold transition ' +
                  (current ? 'border-brand bg-brand text-white ring-4 ring-brand/15'
                    : passed ? 'border-green-600 bg-green-600 text-white'
                    : 'border-slate-300 bg-white text-slate-500')}>
                  {passed ? <Check aria-hidden className="size-3.5" /> : i + 1}
                </span>
                {s.title}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function Wizard({ page, steps, finishTo = 'print' }: WizardProps) {
  const { packet, go, update, route } = useStore()
  // The step lives in the URL (#/edit/resume/2), so the browser Back button goes back one step.
  const index = Math.min(Math.max('step' in route ? route.step ?? 0 : 0, 0), steps.length - 1)
  const markStarted = () => {
    if (!packet.status[page.id].started) update((d) => { d.status[page.id].started = true })
  }
  const setIndex = (i: number) => {
    markStarted()
    go({ view: 'edit', page: page.id, step: i })
  }
  const step = steps[index]
  const status = packet.status[page.id]
  const skip = () => {
    update((d) => { d.status[page.id].skipped = true })
    go({ view: 'home' })
  }
  const isLast = index === steps.length - 1
  // One-step pages (the tracker) skip the step list and use the full width.
  const multi = steps.length > 1

  const finish = () => {
    markStarted()
    if (finishTo === 'print') return go({ view: 'print', page: page.id })
    // Pages with no print view count as done when the last step is finished.
    update((d) => { d.status[page.id] = { started: true, done: true, date: todayIso(), skipped: false } })
    go({ view: 'home' })
  }

  return (
    <>
      <PageBand eyebrow={page.num ? `Page ${page.num}` : 'Start here'} title={page.title} width="max-w-6xl">
        {page.purpose}
      </PageBand>
      <div className={'mx-auto -mt-14 grid max-w-6xl items-start gap-6 px-4 pb-16 ' + (multi ? 'lg:grid-cols-[270px_1fr]' : '')}>
        {multi && <StepList steps={steps} index={index} onPick={setIndex} />}

        {/* Narrow screens: a compact progress bar instead of the sidebar. */}
        {multi && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl lg:hidden">
            <p className="mb-2 flex justify-between text-sm text-slate-600">
              <b className="text-slate-900">{step.title}</b><span>Step {index + 1} of {steps.length}</span>
            </p>
            <ProgressBar value={(index + 1) / steps.length} label="Steps" />
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {isSkipped(packet.status, page.id) && (
            <div className="flex flex-wrap items-center gap-3 border-b border-amber-200 bg-amber-50 px-5 py-3 text-slate-800 sm:px-8">
              <p className="flex-1"><b>This page is skipped.</b> It's left off the map count and out of Print all.</p>
              <button type="button" onClick={() => update((d) => { d.status[page.id].skipped = false })}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:border-brand hover:text-brand">
                Bring it back
              </button>
            </div>
          )}
          <div key={index} className="anim-slide space-y-5 p-5 sm:p-8">
            <h2 className="screen-title text-3xl font-semibold text-slate-900">{step.title}</h2>
            {step.intro && <div className="text-lg text-slate-600">{step.intro}</div>}
            <div className="space-y-6">{step.content}</div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-8">
            <button type="button" onClick={() => (index === 0 ? go({ view: 'home' }) : setIndex(index - 1))}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-lg font-semibold text-slate-700 shadow-sm hover:border-slate-400">
              <ArrowLeft aria-hidden className="size-5" />{index === 0 ? 'Home' : 'Back'}
            </button>
            {multi && <span className="hidden text-slate-500 sm:inline">Step {index + 1} of {steps.length}</span>}
            <button type="button" onClick={() => (isLast ? finish() : setIndex(index + 1))}
              className="group inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
              {isLast ? (finishTo === 'print' ? 'Review & print' : 'Done') : 'Next'}
              <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          {canSkip(page.id) && !status.done && !status.skipped && (
            <p className="border-t border-slate-100 px-5 py-3 text-slate-600 sm:px-8">
              Doesn't apply to this student?{' '}
              <button type="button" onClick={skip} className="font-semibold text-brand underline">Skip this page</button>
              . You can bring it back any time.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
