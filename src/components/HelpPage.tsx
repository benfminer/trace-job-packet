// How-to page for TRACE staff. Works with or without a packet open.
import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { PageBand } from './PageBand'

interface TopicProps {
  title: string
  children: ReactNode
}

function Topic({ title, children }: TopicProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="screen-title text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-2 space-y-2 text-lg text-slate-700">{children}</div>
    </section>
  )
}

interface HelpPageProps {
  onBack: () => void
  backLabel: string
}

export function HelpPage({ onBack, backLabel }: HelpPageProps) {
  return (
    <>
    <PageBand eyebrow="For TRACE staff" title="Help for staff" width="max-w-3xl">
      This site turns the TRACE Job Readiness Packet into step-by-step screens. Sit with the student, read each step
      together, and let them do the clicking and typing when they can.
    </PageBand>
    <div className="mx-auto -mt-14 max-w-3xl space-y-5 px-4 pb-12">
      <button type="button" onClick={onBack}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-xl hover:border-slate-400">
        <ArrowLeft aria-hidden className="size-5" />{backLabel}
      </button>

      <Topic title="Where student info goes">
        <p>
          <b>The website stores nothing.</b> Answers live only in this browser tab. Nothing is sent to a server, and nothing
          is kept in the browser after you close the packet.
        </p>
        <p>
          Click <b>Save</b> (top right) to save the student's file, named like <code>Jordan_Lee_packet.json</code>. The
          Save button turns orange when there are changes that haven't been saved.
        </p>
        <p>
          In <b>Chrome, Edge, or on a Chromebook</b>, Save opens a <b>Save As</b> window. Pick the staff folder, keep or
          change the name, and click Save. If you click Cancel, nothing is saved and the packet still says "Not saved yet."
          To save into Google Drive from a Mac or PC, the computer needs Google Drive for desktop; otherwise save it, then
          upload it to Drive. In <b>Safari or Firefox</b>, Save goes straight to the Downloads folder, so move it from there.
        </p>
        <p>
          The file has the student's contact info, so keep it in a <b>staff-only</b> folder, like a shared TRACE Google
          Drive folder. Don't email it to the student or leave it in Downloads on a shared computer.
        </p>
        <p>Never type a Social Security number, ID numbers, or passwords anywhere in the packet. There is no place for them on purpose.</p>
      </Topic>

      <Topic title="Picking up where you left off">
        <p>
          On the first screen, click <b>Open a saved packet</b> and pick the student's file. If you saved it to Google
          Drive, download it first, or on a Chromebook pick it from the Google Drive section of the file picker.
        </p>
        <p>
          When you're done, click <b>Save</b>, then <b>Close</b>. Close clears the student's info off the screen so the
          next person can't see it.
        </p>
      </Topic>

      <Topic title="How the pages fit together">
        <p>
          Start with <b>About Me</b>, then <b>Weekly Availability</b> (page 5). Name, contact info, school, jobs, and strengths
          are typed once in About Me, and the schedule once on page 5. Both fill in the resume, cover letter, application
          sheet, and other pages.
        </p>
        <p>
          The Home screen lists the pages in a good working order (the page numbers still match the paper folder), and
          <b> Next up</b> points to the next page that isn't done. Pages can still be done in any order. Each page ends on
          a <b>Review & print</b> screen. Click <b>Done, next</b> there to put a checkmark and date on the Home screen and
          the cover page and move on to the next page.
        </p>
        <p>Dashed "idea" buttons drop a suggestion into the box above them. The student can change it after.</p>
      </Topic>

      <Topic title="Practice job or real job">
        <p>
          The <b>job card</b> near the top of the Home screen holds the one job the packet is aimed at. A new packet
          starts in <b>Getting ready</b> mode with a <b>practice job</b>: pick a job the student might want, so they can
          practice the cover letter and interview answers. Practice pages say "Practice" on screen. It never prints.
        </p>
        <p>
          When the student finds a real job, click <b>I'm applying for a real job</b> and type in the job title and
          company once. It fills in the cover letter, the "about this job" application questions, the thank-you note, and
          a row on the Job Search Tracker.
        </p>
        <p>
          For the next job, click <b>Start a new application</b>. The old job stays on the tracker, and only the answers
          about that job are cleared (why this company, the thank-you note, how the interview went). Experience,
          strengths, and every other page stay. The old cover letter is not kept, so download its Word file or PDF first.
        </p>
        <p>
          <b>After the interview</b> (in the "For this job" group) has the thank-you note and "How did it go?" They print
          on the Interview day sheet of page 11.
        </p>
      </Topic>

      <Topic title="Printing and PDFs">
        <p>
          Click <b>Print / Save as PDF</b>. To make a PDF, pick <b>Save as PDF</b> as the printer. For the best match to the
          paper handouts, turn on <b>Background graphics</b> and turn off <b>Headers and footers</b> under More settings.
        </p>
        <p>
          <b>Print all</b> on the Home screen prints the cover page and every page marked done, as one PDF for the
          student's folder. You can add or remove pages before printing.
        </p>
        <p>
          The resume and cover letter also have <b>Download Word file</b>. Like Save, it opens a Save As window in Chrome
          and Edge so you can pick the folder. It opens in Word or Google Docs (File, Open, Upload) if the student wants to
          change the wording.
        </p>
      </Topic>

      <Topic title="Interview Prep quiz">
        <p>
          On the "Agree or disagree" step, the student answers first. Then click <b>Teacher: check answers</b> to show which
          answers match the key, and talk through any that don't. The answer key also prints at the bottom of the quiz page,
          like the paper handout.
        </p>
      </Topic>

      <Topic title="Keyboard and screen size">
        <p>
          Everything works with the keyboard: <b>Tab</b> moves between boxes and buttons, <b>Enter</b> or <b>Space</b>
          presses a button. Use <b>Ctrl +</b> (or <b>⌘ +</b> on a Mac) to make everything bigger, and <b>Ctrl -</b> to
          make it smaller.
        </p>
      </Topic>
    </div>
    </>
  )
}
