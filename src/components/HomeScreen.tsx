// The packet dashboard: progress and what's next, the job being applied for, then the pages in working order.
import type { ReactNode } from 'react'
import { ArrowRight, Briefcase, Check, CircleHelp, ClipboardCopy, MailCheck, Pencil, Printer, type LucideIcon } from 'lucide-react'
import { useStore } from '../data/store'
import { GROUPS, PAGES, nextPage, pageInfo, type PageInfo } from '../data/pages'
import type { PageStatus } from '../data/packet'
import { fullName, shortDate, targetLabel } from '../data/derive'
import { PAGE_ICONS } from './icons'
import { NewApplicationButton, PracticeBadge } from './JobFields'
import { PageBand, ProgressBar } from './PageBand'
import { btnPrimary as primary, btnSecondary as secondary } from './styles'

const chip = 'rounded-full px-2.5 py-1 text-sm font-semibold '
const iconBox = 'grid size-11 shrink-0 place-items-center rounded-lg '
const card = 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow '

function StatusChip({ status }: { status: PageStatus }) {
  if (status.done) {
    return (
      <span className={chip + 'inline-flex items-center gap-1 bg-green-50 text-green-800 ring-1 ring-green-200'}>
        <Check aria-hidden className="size-3.5" />Done {shortDate(status.date)}
      </span>
    )
  }
  if (status.started) return <span className={chip + 'bg-brand-tint text-brand-dark'}>In progress</span>
  return <span className={chip + 'bg-slate-100 text-slate-600'}>Not started</span>
}

function PageCard({ page }: { page: PageInfo }) {
  const { packet, go } = useStore()
  const status = packet.status[page.id]
  const Icon = status.done ? Check : PAGE_ICONS[page.id]
  return (
    <article className={card + 'flex flex-col gap-3'}>
      <div className="flex flex-1 items-start gap-3">
        <span className={iconBox + (status.done ? 'bg-green-50 text-green-700' : 'bg-brand-tint text-brand')}>
          <Icon aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {page.num ? `Page ${page.num}` : 'Fill this in first'}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{page.title}</h3>
          <p className="mt-1 text-base text-slate-600">{page.purpose}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
        <StatusChip status={status} />
        <span className="flex-1" />
        {/* About Me has nothing to print. */}
        {page.num && (
          <button type="button" onClick={() => go({ view: 'print', page: page.id })} aria-label={`Print ${page.title}`}
            className="rounded-md border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-brand hover:text-brand">
            <Printer aria-hidden className="size-5" />
          </button>
        )}
        <button type="button" onClick={() => go({ view: 'edit', page: page.id })} className={primary + ' py-1.5'}>
          {status.done ? 'Edit' : status.started ? 'Continue' : 'Start'}
        </button>
      </div>
    </article>
  )
}

interface ToolCardProps {
  icon: LucideIcon
  title: string
  children: ReactNode
  button: string
  onClick: () => void
}

// A screen that isn't a packet page, like Applying now.
function ToolCard({ icon: Icon, title, children, button, onClick }: ToolCardProps) {
  return (
    <article className={card + 'flex flex-col gap-3'}>
      <div className="flex flex-1 items-start gap-3">
        <span className={iconBox + 'bg-brand-tint text-brand'}><Icon aria-hidden className="size-5" /></span>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-1 text-base text-slate-600">{children}</p>
        </div>
      </div>
      <div className="mt-auto flex justify-end border-t border-slate-100 pt-3">
        <button type="button" onClick={onClick} className={primary + ' py-1.5'}>{button}</button>
      </div>
    </article>
  )
}

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
  const doneCount = PAGES.filter((p) => packet.status[p.id].done).length
  const next = nextPage(packet.status)
  return (
    <>
      <PageBand eyebrow="Student packet" title={name ? `${name}'s packet` : 'New packet'} width="max-w-6xl">
        Pick a page to work on. Everything you type in About Me fills in the rest.
      </PageBand>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="-mt-14 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <div className="flex flex-wrap items-center gap-5">
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {doneCount} <span className="text-base font-medium text-slate-500">of {PAGES.length} pages done</span>
            </p>
            <div className="min-w-48 flex-1">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>Overall progress</span><span>{Math.round((doneCount / PAGES.length) * 100)}%</span>
              </div>
              <ProgressBar value={doneCount / PAGES.length} label="Pages done" />
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

        {GROUPS.map((group, n) => (
          <section key={group.title}>
            <div className="mt-9 mb-3">
              <h2 className="text-xl font-semibold tracking-tight">{n + 1}. {group.title}</h2>
              <p className="text-slate-600">{group.note}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.ids.map((id) => <PageCard key={id} page={pageInfo(id)} />)}
              {group.ids.includes('tracker') && (
                <>
                  <ToolCard icon={ClipboardCopy} title="Applying now" button="Copy my answers" onClick={() => go({ view: 'apply' })}>
                    Filling out an application on the computer? Copy each answer and paste it in.
                  </ToolCard>
                  <ToolCard icon={MailCheck} title="After the interview" button="Open" onClick={() => go({ view: 'after' })}>
                    Send a thank-you note and write down how it went.
                  </ToolCard>
                </>
              )}
            </div>
          </section>
        ))}

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
