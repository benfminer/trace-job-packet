// Page 11 steps.
import { useState } from 'react'
import { usePageData } from '../../data/store'
import {
  EMPLOYER_QUESTIONS, INTERVIEW_ACCOMMODATION, INTERVIEW_DAY, INTRO_EXAMPLE, INTRO_PARTS, PRACTICE_QUESTIONS,
  QUIZ, QUIZ_CHOICES, QUIZ_KEY, QUIZ_TIPS,
} from '../../data/options'
import { availabilitySentence, introText, shortDate, strengthPhrase, thankYouText, todayIso } from '../../data/derive'
import { TEAM_KEYS, type InterviewKey, type Practice, type QuizAnswer } from '../../data/packet'
import { Card, Check, Choice, Grid, Ideas, MultiChoice, TextArea, TextField, Tip } from '../../components/fields'
import { DateField } from '../../components/DateField'

type IntroKey = (typeof INTRO_PARTS)[number]['key']

// Starting ideas for the introduction, built from About Me.
function useIntroIdeas(): Record<IntroKey, string[]> {
  const { packet } = usePageData('interview')
  const p = packet.profile
  const jobs = p.jobs.filter((j) => j.employer)
  return {
    introName: [p.preferredName, p.firstName].filter(Boolean),
    introNow: ["in the TRACE program, where I'm building my job skills", 'working at ' + (jobs[0]?.employer ?? 'my job site')],
    introExperience: jobs.map((j) => `${j.title ? j.title.replace(/\s*\(.*\)/, '').toLowerCase() + ' work' : 'working'} at ${j.employer}`),
    introGoodAt: ['keeping things organized', 'following directions', 'helping customers', 'working on a team'],
    introWhy: ['I like helping customers', 'I like working on a team', 'I want to learn new skills'],
  }
}

export function IntroStep() {
  const { data, set } = usePageData('interview')
  const ideas = useIntroIdeas()
  const said = introText(data)
  return (
    <>
      {INTRO_PARTS.map((part, n) => (
        <div key={part.key}>
          <TextField label={`${n + 1}. ${part.label}`} value={data[part.key]} onChange={(v) => set(part.key, v)}
            hint={'hint' in part ? part.hint : undefined} />
          {ideas[part.key].length > 0 && <Ideas ideas={[...new Set(ideas[part.key])]} onPick={(v) => set(part.key, v)} />}
        </div>
      ))}
      <Card title={said ? 'Practice saying it out loud' : 'Example'}>
        <p className="text-lg italic">{said ? `"${said}"` : INTRO_EXAMPLE}</p>
      </Card>
    </>
  )
}

export function PracticeStep() {
  const { data, set, update, packet } = usePageData('interview')
  const team = packet.pages.supportTeam.members
  const people = [...new Set([packet.teacher, ...TEAM_KEYS.map((k) => team[k].name)].filter(Boolean))]
  const setRow = (i: number, key: keyof Practice, v: string) => update((d) => { d.pages.interview.practice[i][key] = v })
  return (
    <>
      <Tip>Practice your introduction and your answers out loud until they feel natural.</Tip>
      {data.practice.map((r, i) => (
        <Card key={i}>
          <Grid>
            <TextField label="I practiced with" value={r.who} onChange={(v) => setRow(i, 'who', v)} />
            <DateField label="Date" value={r.date} onChange={(v) => setRow(i, 'date', v)} />
          </Grid>
          {people.length > 0 && <Ideas label="Tap a person:" ideas={people} onPick={(v) => setRow(i, 'who', v)} />}
        </Card>
      ))}
      <button type="button" onClick={() => update((d) => { d.pages.interview.practice.push({ who: '', date: '' }) })}
        className="rounded-md border border-dashed border-slate-400 px-4 py-2 font-semibold text-slate-600 hover:border-brand hover:text-brand">
        + Add another
      </button>
      <Card>
        <Check label="I recorded myself" checked={data.recorded} onChange={(v) => set('recorded', v)} />
        <TextField label="What I want to do better" value={data.doBetter} onChange={(v) => set('doBetter', v)}
          placeholder="Speak a little slower" />
      </Card>
    </>
  )
}

export function MyQuestionsStep() {
  const { data, set } = usePageData('interview')
  return (
    <MultiChoice label="Questions I can ask the employer" value={data.myQuestions} onChange={(v) => set('myQuestions', v)}
      options={EMPLOYER_QUESTIONS} max={2} allowOther hint={`Pick 2 to use at the end of the interview. (${data.myQuestions.length} of 2 picked)`} />
  )
}

interface AnswersStepProps {
  keys: InterviewKey[]
  withOther?: boolean
}

export function AnswersStep({ keys, withOther }: AnswersStepProps) {
  const { data, update, set, packet } = usePageData('interview')
  const p = packet.profile
  const setAnswer = (k: InterviewKey, v: string) => update((d) => { d.pages.interview.answers[k] = v })
  const ideas: Partial<Record<InterviewKey, string[]>> = {
    strengths: p.strengths.length ? [p.strengths.map(strengthPhrase).join(', ')] : [],
    whenWork: [availabilitySentence(p)].filter(Boolean),
    whyHere: [packet.pages.coverLetter.why].filter(Boolean),
  }
  return (
    <>
      <Tip>Write key words, not full sentences. Then say your answer out loud.</Tip>
      {PRACTICE_QUESTIONS.filter((q) => keys.includes(q.key)).map((q) => (
        <div key={q.key}>
          <TextArea label={q.label} rows={2} value={data.answers[q.key]} onChange={(v) => setAnswer(q.key, v)} hint={q.note} />
          {!!ideas[q.key]?.length && <Ideas label="From my other pages:" ideas={ideas[q.key]!} onPick={(v) => setAnswer(q.key, v)} />}
        </div>
      ))}
      {withOther && (
        <Card title="Other question I want to practice">
          <TextField label="Question" value={data.otherQuestion} onChange={(v) => set('otherQuestion', v)} />
          <TextArea label="My answer (key words)" rows={2} value={data.otherAnswer} onChange={(v) => set('otherAnswer', v)} />
        </Card>
      )}
    </>
  )
}

const isGood = (agree: boolean, a: QuizAnswer) => (agree ? a === 'sa' || a === 'a' : a === 'd' || a === 'sd')

export function QuizStep() {
  const { data, update } = usePageData('interview')
  const [showKey, setShowKey] = useState(false)
  const setAnswer = (i: number, v: QuizAnswer) => update((d) => { d.pages.interview.quiz[i] = v })
  return (
    <>
      <Tip>
        Many store and restaurant jobs give an online quiz with statements like "I like to keep things organized." You
        choose how much you agree. There are no trick questions. The employer is looking for someone who is reliable,
        honest, safe, friendly, and follows rules.
      </Tip>
      <Card title="Tips">
        <ol className="list-decimal space-y-1 pl-6 text-lg">{QUIZ_TIPS.map((t) => <li key={t}>{t}</li>)}</ol>
      </Card>
      {QUIZ.map((q, i) => {
        const a = data.quiz[i] ?? ''
        return (
          <div key={q.text}>
            <Choice label={`${i + 1}. ${q.text}`} value={a} onChange={(v) => setAnswer(i, v)} options={QUIZ_CHOICES} />
            {showKey && a && (
              <p className={'mt-1 font-semibold ' + (isGood(q.agree, a) ? 'text-green-700' : 'text-amber-700')}>
                {isGood(q.agree, a) ? '✓ Matches the answer key' : `Talk about this one. A good worker would ${q.agree ? 'agree' : 'disagree'}.`}
              </p>
            )}
          </div>
        )
      })}
      <div className="rounded-xl border border-dashed border-slate-300 p-4">
        <button type="button" onClick={() => setShowKey(!showKey)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:border-brand hover:text-brand">
          {showKey ? 'Hide answer key' : 'Teacher: check answers'}
        </button>
        {showKey && <p className="mt-2 text-slate-700"><b>Answer key:</b> {QUIZ_KEY}</p>}
      </div>
    </>
  )
}

export function InterviewDayStep() {
  const { data, set } = usePageData('interview')
  const toggle = (item: string, on: boolean) => set('checklist', on ? [...data.checklist, item] : data.checklist.filter((x) => x !== item))
  return (
    <>
      <Grid>
        {INTERVIEW_DAY.map((g) => (
          <Card key={g.title} title={g.title}>
            <div className="space-y-1">
              {g.items.map((item) => <Check key={item} label={item} checked={data.checklist.includes(item)} onChange={(v) => toggle(item, v)} />)}
            </div>
          </Card>
        ))}
      </Grid>
      <Tip>{INTERVIEW_ACCOMMODATION}</Tip>
    </>
  )
}

export function ThankYouStep() {
  const { data, set, packet } = usePageData('interview')
  const [copied, setCopied] = useState(false)
  const note = thankYouText(packet)
  const copy = async () => {
    await navigator.clipboard.writeText(note)
    setCopied(true)
  }
  return (
    <>
      <Tip>Send it by email or text <b>within 1 day</b> after the interview.</Tip>
      <Grid>
        <TextField label="Interviewer's name" value={data.interviewer} onChange={(v) => set('interviewer', v)} />
        <TextField label="Something we talked about" value={data.talkedAbout} onChange={(v) => set('talkedAbout', v)}
          placeholder="how the team works together" />
      </Grid>
      <Card title="My thank-you note">
        <p className="text-lg whitespace-pre-line">{note}</p>
        <button type="button" onClick={copy}
          className="rounded-md bg-brand px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
          {copied ? '✓ Copied' : 'Copy the note'}
        </button>
        <p className="text-sm text-slate-500">Then paste it into an email or text message.</p>
      </Card>
    </>
  )
}

export function HowDidItGoStep() {
  const { data, set, packet } = usePageData('interview')
  const company = packet.target.company.trim()
  return (
    <>
      <TextField label="Company / date" value={data.howCompanyDate} onChange={(v) => set('howCompanyDate', v)} placeholder="Smart & Final, 11/12" />
      {company && <Ideas label="Tap to use:" ideas={[`${company}, ${shortDate(todayIso())}`]} onPick={(v) => set('howCompanyDate', v)} />}
      <TextArea label="What went well" value={data.wentWell} onChange={(v) => set('wentWell', v)} />
      <TextArea label="What I'll practice next time" value={data.practiceNext} onChange={(v) => set('practiceNext', v)} />
    </>
  )
}
