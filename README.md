# TRACE Job Readiness Packet

**Live site: https://benfminer.github.io/trace-job-packet/**

A guided web app for the TRACE Job Readiness Packet (San Diego Unified). A teacher or job coach sits with a student
and goes through each packet page one small step at a time. The app turns the answers into printable pages that look
like the paper handouts, plus Word files for the resume and cover letter.

It works in any up-to-date browser on a teacher computer or a Chromebook. Nothing to install, and no account needed.

## What's in the packet

| # | Page | What it's for |
|---|------|---------------|
| ★ | About Me | Name, contact info, school, work history, strengths. Typed once, fills in every other page. |
| 1 | Resume | Work history and skills on one page (also downloads as Word) |
| 2 | Cover Letter | A letter that goes with the resume (also downloads as Word) |
| 3 | Online Application Info Sheet | All the info needed to fill out applications |
| 4 | References | People who can say the student is a good worker |
| 5 | Weekly Availability | The days and times the student can work |
| 6 | Important Documents Checklist | IDs and papers needed when hired |
| 7 | Disclosure and Accommodations | What helps the student do their best work |
| 8 | Transportation Plan | How to get to work and back |
| 9 | My Support Team | People and agencies who help |
| 10 | Benefits and Work | Working and keeping benefits, plus a monthly pay-reporting log |
| 11 | Interview Prep | 30-second intro, practice questions, the agree/disagree quiz, interview-day checklist, thank-you note |
| 12 | Job Search Tracker | Every job applied for, with follow-up dates |

## How to use it

### Starting out
1. Open the [live site](https://benfminer.github.io/trace-job-packet/).
2. Click **Start a new packet** for a new student, or **Open a saved packet** to keep going with a student's file.
3. Start with **About Me**, then **Weekly Availability**. What's typed there fills in the other pages automatically.
4. The Home screen lists the pages in a good working order, and **Next up** points to the next one. Each page goes
   step by step with **Back** and **Next**, then ends on **Review & print**.
5. On the Review & print screen, click **Done, next** to put a checkmark and date on the Home screen and the cover
   page and move on to the next page.

### Practice job or real job
- The **job card** on the Home screen holds the one job the packet is aimed at. A new packet starts with a
  **practice job**, so the student can practice the cover letter and interview answers before there is a real job.
  Practice pages say "Practice" on screen only. It never prints.
- For a real job, click **I'm applying for a real job** and type the job title and company once. It fills in the
  cover letter, the "about this job" application questions, the thank-you note, and a Job Search Tracker row.
- For the next job, click **Start a new application**. The old job stays on the tracker and only the answers about
  that job are cleared. Download the old cover letter first if you want to keep it.

Dashed "idea" buttons under a box drop a suggestion into it. The student can change it after.

### Saving and closing (important)
- **The website stores nothing.** Answers only live in the open browser tab.
- Click **Save** (top right) to download the student's file, named like `Jordan_Lee_packet.json`. The Save button
  turns orange when there are changes that haven't been saved yet.
- Keep these files in a **staff-only** folder, like a shared TRACE Google Drive folder. They contain the student's
  contact info, so don't leave them in Downloads on a shared computer.
- When you're done, click **Save**, then **Close**. Close clears the student's info off the screen.
- Next time, click **Open a saved packet** and pick the student's file. On a Chromebook you can pick it straight from
  Google Drive in the file picker.

### Printing and PDFs
- Click **Print / Save as PDF** on any page. To make a PDF, choose **Save as PDF** as the printer.
- For the closest match to the paper handouts, under **More settings** turn **Background graphics** on and
  **Headers and footers** off.
- **Print all** on the Home screen prints the cover page and every page marked done as one set, ready for the
  student's folder. You can add or remove pages before printing.
- The resume and cover letter also have **Download Word file**. It opens in Word or Google Docs for editing.

### Interview Prep quiz
On the "Agree or disagree" step, the student answers first. Then click **Teacher: check answers** to see which answers
match the key, and talk through the rest. The answer key also prints at the bottom of the quiz page.

### Privacy rules
- Never type a Social Security number, ID numbers, or passwords. The app has no place for them on purpose.
- There is no server and no database. Student info goes nowhere unless staff save the file.

There's also a **Help for staff** page inside the app (link on the first screen and on Home).

## For developers

Built with Vite, React, TypeScript, and Tailwind. It's a static site with no backend.

```sh
npm install
npm run dev      # add ?demo to the URL to load a made-up sample student (dev only)
npm test         # vitest
npm run lint     # oxlint
npm run build
```

Every push to `main` runs the tests, builds the site, and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`).

Where things live:
- `src/data/packet.ts`: the save-file format (one `Packet` object), blank packet, and safe loading of old files
- `src/data/options.ts`: handout wording and choice lists
- `src/pages/<page>/`: each page's wizard steps (`*Steps.tsx`), print layout (`*Print.tsx`), and wiring (`*Page.tsx`)
- `src/pages/sheets.tsx`: the printed sheets for each page, shared by each page and Print all
- `src/docx/`: Word file builders for the resume and cover letter
