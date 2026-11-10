// "After the interview": the thank-you note and how it went, for the job on the Home screen.
// These print on the Interview day sheet of page 11.
import { ArrowLeft, Printer } from 'lucide-react'
import { useStore } from '../../data/store'
import { targetLabel } from '../../data/derive'
import { PageBand } from '../../components/PageBand'
import { PracticeNote } from '../../components/JobFields'
import { btnSecondary } from '../../components/styles'
import { HowDidItGoStep, ThankYouStep } from './InterviewSteps'

const section = 'space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8'

export function AfterPage() {
  const { packet, go } = useStore()
  const t = packet.target
  return (
    <div>
      <PageBand eyebrow="Page 11  ·  After the interview" title="Thank-you note" width="max-w-3xl">
        {targetLabel(t) ? `For the ${targetLabel(t)} interview.` : 'Send a thank-you note, then write down how it went.'}
      </PageBand>
      <div className="mx-auto -mt-14 max-w-3xl space-y-5 px-4 pb-16">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <button type="button" onClick={() => go({ view: 'home' })} className={btnSecondary}>
            <ArrowLeft aria-hidden className="size-5" />Home
          </button>
          <button type="button" onClick={() => go({ view: 'print', page: 'interview' })} className={btnSecondary}>
            <Printer aria-hidden className="size-5" />Print with Interview Prep
          </button>
          {t.practice ? <PracticeNote /> : (
            <button type="button" onClick={() => go({ view: 'job' })} className="font-semibold text-brand underline">Change the job</button>
          )}
        </div>
        <section className={section}>
          <h2 className="screen-title text-3xl font-semibold text-slate-900">Thank-you note</h2>
          <ThankYouStep />
        </section>
        <section className={section}>
          <h2 className="screen-title text-3xl font-semibold text-slate-900">How did it go?</h2>
          <HowDidItGoStep />
        </section>
      </div>
    </div>
  )
}
