// Where the target job is typed in: a practice job while getting ready, then each real job.
import { ArrowLeft, Check } from 'lucide-react'
import { useStore } from '../data/store'
import { logTarget } from '../data/target'
import { PageBand } from './PageBand'
import { JobFields, NewApplicationButton } from './JobFields'
import { Tip } from './fields'
import { btnPrimary, btnSecondary } from './styles'

export function JobPage() {
  const { packet, update, go } = useStore()
  const practice = packet.target.practice
  // A real job goes on the Job Search Tracker as soon as it's typed in.
  const done = () => {
    update(logTarget)
    go({ view: 'home' })
  }
  return (
    <div>
      <PageBand eyebrow={practice ? 'Getting ready' : 'Applying for a real job'} title={practice ? 'My practice job' : "The job I'm applying for"} width="max-w-3xl">
        Type it once. It fills in your cover letter, application answers, and thank-you note.
      </PageBand>
      <div className="mx-auto -mt-14 max-w-3xl px-4 pb-16">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="space-y-6 p-5 sm:p-8">
            {practice ? (
              <Tip>
                <b>No real job yet? Pick a practice one.</b> Choose a job you might want, so you can practice your cover
                letter and interview answers. When you find a real job, come back and switch.
              </Tip>
            ) : (
              <Tip>Copy the job title and company name from the job post, spelled the same way.</Tip>
            )}
            <JobFields />
            {!practice && (
              <button type="button" onClick={() => update((d) => { d.target.practice = true })}
                className="text-sm font-semibold text-slate-500 underline hover:text-brand">
                Not applying yet? Make this a practice job
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-8">
            <button type="button" onClick={done} className={btnSecondary + ' py-3 text-lg'}>
              <ArrowLeft aria-hidden className="size-5" />Home
            </button>
            <div className="flex flex-wrap gap-3">
              <NewApplicationButton />
              <button type="button" onClick={done} className={btnPrimary + ' px-6 py-3 text-lg'}>
                <Check aria-hidden className="size-5" />Done
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
