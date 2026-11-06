// Blank Word copies of the packet, with how to use them. Works with or without a packet open.
import type { ReactNode } from 'react'
import { ArrowLeft, FolderDown } from 'lucide-react'
import { HANDOUT_FILES, HANDOUT_ZIP } from '../data/handouts'
import { PageBand } from './PageBand'
import { HandoutList } from './PaperCopies'
import { handFiles, handoutHref, typedFiles } from '../data/paper'
import { btnPrimary, btnSecondary } from './styles'

interface StepProps {
  num: number
  title: string
  children: ReactNode
}

function Step({ num, title, children }: StepProps) {
  return (
    <li className="flex gap-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-base font-semibold text-white">{num}</span>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="mt-1 space-y-1 text-lg text-slate-700">{children}</div>
      </div>
    </li>
  )
}

interface PaperPageProps {
  onBack: () => void
  backLabel: string
}

export function PaperPage({ onBack, backLabel }: PaperPageProps) {
  return (
    <>
      <PageBand eyebrow="Work on paper" title="Paper copies" width="max-w-4xl">
        Every page of the packet as a Word file. Print them to fill in by hand, or edit them on a computer.
      </PageBand>
      <div className="mx-auto max-w-4xl space-y-8 px-4 pb-16">
        <div className="-mt-14 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xl">
          <button type="button" onClick={onBack} className={btnSecondary}>
            <ArrowLeft aria-hidden className="size-5" />{backLabel}
          </button>
          <span className="flex-1" />
          <a href={handoutHref(HANDOUT_ZIP)} download className={btnPrimary}>
            <FolderDown aria-hidden className="size-5" />Download all {HANDOUT_FILES.length} pages (.zip)
          </a>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="screen-title text-2xl font-semibold text-slate-900">How to use the paper copies</h2>
          <ol className="mt-5 space-y-5">
            <Step num={1} title="Print the pages">
              <p>Download all of them, or just the pages the student needs. The cover page goes on the front of the folder.</p>
            </Step>
            <Step num={2} title="Plan on paper first">
              <p>
                The <b>Resume Template</b> and <b>Cover Letter Template</b> each have a <b>Builder</b> page. The student
                fills in the Builder by hand: their goal, skills, jobs, and strengths.
              </p>
              <p>The Online Application Info Sheet is a good place to look up dates, addresses, and phone numbers.</p>
            </Step>
            <Step num={3} title="Type it into the template">
              <p>
                Open the template in Word or Google Docs (in Google Drive: <b>New</b>, then <b>File upload</b>, then open it
                with Google Docs). Replace each <b>[bracket]</b> with the answers from the Builder, and delete any parts
                that don't fit.
              </p>
              <p>The last page of each template is an example to look at. Delete the Builder and example pages before saving.</p>
            </Step>
            <Step num={4} title="Check it and save it">
              <p>
                Go through the <b>Before you send it</b> list on the Builder. Keep the resume to one page. Save it as a
                PDF named like <b>First Last Resume</b>.
              </p>
            </Step>
          </ol>
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-base text-slate-800">
            <b>Rather type than write?</b> This website builds the resume and cover letter for you from the About Me
            answers. Start a new packet on the first screen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight">Type these up</h2>
          <p className="mb-3 text-slate-600">Template, Builder worksheet, and an example in each file.</p>
          <HandoutList files={typedFiles} />
        </section>
        <section>
          <h2 className="text-xl font-semibold tracking-tight">Fill in by hand</h2>
          <p className="mb-3 text-slate-600">Print these and keep them in the student's folder.</p>
          <HandoutList files={handFiles} />
        </section>
      </div>
    </>
  )
}
