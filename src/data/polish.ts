// The prompts a student can copy into Gemini to clean up their own wording.
// The app has no AI in it. The student chooses to paste this into Gemini, then pastes the result back.
// The rules let Gemini reword and strengthen the writing, but never add facts, and it must still sound like the student.
import type { Packet } from './packet'
import { coverLetterParagraphs } from './derive'

const RULES = `RULES
1. Fix grammar, spelling, punctuation, and capital letters.
2. You may reword my sentences so they read smoothly and sound confident. You can move words around, join two short sentences, and pick a stronger word when it means the same thing. When you change a word, the new word has to mean exactly the same thing. "Cleaned" is not "swept", and "hard worker" is not "dependable".
3. Do NOT add any new facts. No new skills, duties, tools, numbers, awards, jobs, or results. If I did not write that I did it, it does not go in.
4. Do NOT make anything sound bigger than it is. "Stocked shelves" stays "Stocked shelves". It does not become "Managed inventory".
5. Keep it simple and at the same reading level. It has to sound like me, a real person, and not like AI wrote it. Do not use words like passionate, dedicated, motivated, leverage, utilize, dynamic, detail-oriented, proven, results-driven, thrive, or eager. Do not use dashes as pauses, and do not use semicolons.
6. Keep it about the same length.
7. If a sentence is already clear and strong, leave it alone.
8. If something is unclear, do not guess. Leave it the way I wrote it and ask me about it at the end.
9. Do not change names of people, companies, job titles, dates, phone numbers, or email addresses.`

const ANSWER_END = `After that, add a part called WHAT I CHANGED. List every change in plain words, one per line, so my teacher and I can check each one. If you changed nothing, say that.
Then add a part called QUESTIONS, only if something was unclear.`

// The parts of the resume that are the student's own sentences: the goal, and the bullets for each job.
export function resumeParts(packet: Packet) {
  const r = packet.pages.resume
  const jobs = packet.profile.jobs
    .map((j, i) => ({ j, i }))
    .filter(({ j }) => j.employer.trim())
    .map(({ j, i }, n) => ({
      index: i,
      label: `JOB ${n + 1}: ${[j.title.trim(), j.employer.trim()].filter(Boolean).join(' at ')}`,
      dates: [j.start, j.end].filter(Boolean).join(' to '),
      bullets: (r.bullets[i] ?? '').split('\n').map((b) => b.trim()).filter(Boolean),
    }))
  return { goal: r.objective.trim(), jobs }
}

// Empty when there is nothing written yet to polish.
export function resumePrompt(packet: Packet) {
  const { goal, jobs } = resumeParts(packet)
  const written = jobs.filter((j) => j.bullets.length)
  if (!goal && !written.length) return ''
  const parts = [
    goal && `[MY GOAL]\n${goal}`,
    ...written.map((j) => `[${j.label}${j.dates ? ` (${j.dates})` : ''}]\n${j.bullets.join('\n')}`),
  ].filter(Boolean)
  return `I am a student in a job-readiness program. I wrote the resume wording below myself. Your job is to clean up my writing and help it sound its best. You are an editor, not a writer.

${RULES}
10. Under each job, every line is one bullet point. Start each one with an action word, like Stocked, Helped, or Cleaned. Use the past tense, unless the dates say "Present". Keep the same number of bullet points, in the same order.

HOW TO ANSWER
Give me back the same parts, with the same [LABELS], in the same order. Use plain text with no bold and no bullet symbols. Put each bullet point on its own line.
${ANSWER_END}

MY RESUME WORDING

${parts.join('\n\n')}
`
}

export function letterPrompt(packet: Packet) {
  return `I am a student in a job-readiness program. I wrote the cover letter below myself. Your job is to clean up my writing and help it sound its best. You are an editor, not a writer.

${RULES}
10. Most of my sentences start with "I". Change how several of them start so the letter reads smoothly, without changing what they say.
11. Make the letter sound confident and friendly, like someone who really wants this job. Do it with my facts, not new ones.
12. Keep the same paragraphs, in the same order. Keep it short enough to fit on one page.

HOW TO ANSWER
Give me back only the paragraphs of the letter, under the label [MY LETTER], with a blank line between paragraphs. Use plain text with no bold. Do not add a greeting like "Dear" or an ending like "Sincerely". My letter already has those.
${ANSWER_END}

[MY LETTER]

${coverLetterParagraphs(packet).join('\n\n')}
`
}
