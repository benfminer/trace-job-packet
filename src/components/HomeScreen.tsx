// The packet dashboard: progress and what's next, the job being applied for, then the road map of pages.
import { ArrowRight, Briefcase, CircleHelp, MapPin, Pencil, Printer } from 'lucide-react'
import { useStore } from '../data/store'
import { nextPage, progress } from '../data/pages'
import { fullName, targetLabel } from '../data/derive'
import { RoadMap } from './RoadMap'
import { NewApplicationButton, PracticeBadge } from './JobFields'
import { PageBand, ProgressBar } from './PageBand'
import { btnPrimary as primary, btnSecondary as secondary } from './styles'

const iconBox = 'grid size-11 shrink-0 place-items-center rounded-lg '

// The job the packet is aimed at: a practice job while getting ready, then each real job.
function TargetCard() {
  const { packet, go } = useStore()
  const t = packet.target
  const label = targetLabel(t)
  return (
    <section aria-label="The job I'm applying for" className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <span className={iconBox + 'bg-brand text-white'}><Briefcase aria-hidden className="size-5" /></span>
      <div className="min-w-56 flex-1">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {t.practice ? <>Getting ready <PracticeBadge /></> : "The job I'm applying for"}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
          {label || (t.practice ? 'No practice job picked yet' : 'Type in the job')}
        </h2>
        <p className="text-slate-600">
          {t.practice
            ? 'A practice job for your cover letter and interview answers. Switch when you find a real job.'
            : 'Fills in your cover letter, application answers, thank-you note, and tracker.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => go({ view: 'job' })} className={secondary}>
          <Pencil aria-hidden className="size-5" />{label ? 'Change' : t.practice ? 'Pick a practice job' : 'Type it in'}
        </button>
        <NewApplicationButton primary={t.practice} />
      </div>
    </section>
  )
}

export function HomeScreen() {
  const { packet, go } = useStore()
  const name = fullName(packet.profile)
  const { done: doneCount, total } = progress(packet.status)
  const next = nextPage(packet.status)
  return (
    <>
      <PageBand eyebrow="Student packet" title={name ? `${name}'s packet` : 'New packet'} width="max-w-6xl">
        Follow the road. Everything you type in About Me fills in the rest.
      </PageBand>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="-mt-14 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <div className="flex flex-wrap items-center gap-5">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {doneCount} <span className="text-base font-medium text-slate-500">of {total} pages done</span>
            </p>
            <div className="min-w-48 flex-1">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>Overall progress</span><span>{Math.round((doneCount / total) * 100)}%</span>
              </div>
              <ProgressBar value={doneCount / total} label="Pages done" />
            </div>
            <button type="button" onClick={() => go({ view: 'help' })} className={secondary}>
              <CircleHelp aria-hidden className="size-5" />Help for staff
            </button>
            <button type="button" onClick={() => go({ view: 'printAll' })} className={secondary}>
              <Printer aria-hidden className="size-5" />Print all
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            {next ? (
              <>
                <p className="flex-1 text-lg text-slate-700">
                  <span className="font-semibold text-slate-900">Next up: {next.title}.</span> {next.purpose}
                </p>
                <button type="button" onClick={() => document.getElementById('here')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className={secondary + ' py-2.5'}>
                  <MapPin aria-hidden className="size-5" />Show me on the map
                </button>
                <button type="button" onClick={() => go({ view: 'edit', page: next.id })} className={primary + ' px-5 py-2.5 text-lg'}>
                  {packet.status[next.id].started ? 'Continue' : 'Start'}<ArrowRight aria-hidden className="size-5" />
                </button>
              </>
            ) : (
              <p className="flex-1 text-lg font-semibold text-green-800">Every page is done. Print the whole folder with Print all.</p>
            )}
          </div>
        </div>

        <TargetCard />

        <RoadMap />

        <button type="button" onClick={() => go({ view: 'paper' })}
          className="group mt-9 flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand"><Printer aria-hidden className="size-5" /></span>
          <span className="flex-1">
            <span className="block text-lg font-semibold tracking-tight text-slate-900">Blank paper copies</span>
            <span className="block text-slate-600">Word files of every page, to print and fill in by hand, with how to use them.</span>
          </span>
          <ArrowRight aria-hidden className="size-5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
        </button>
      </div>
    </>
  )
}
