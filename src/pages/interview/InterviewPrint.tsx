// Page 11 printed like the handout's four parts.
import { useStore } from '../../data/store'
import {
  EMPLOYER_QUESTIONS, INTERVIEW_ACCOMMODATION, INTERVIEW_DAY, INTRO_EXAMPLE, INTRO_PARTS,
  PRACTICE_QUESTIONS, QUIZ, QUIZ_CHOICES, QUIZ_KEY, QUIZ_TIPS,
} from '../../data/options'
import { fullName, shortDate, thankYouText, todayIso } from '../../data/derive'
import { Box, Callout, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'

export function IntroSheet() {
  const { packet } = useStore()
  const i = packet.pages.interview
  const practice = i.practice.filter((r) => r.who || r.date)
  while (practice.length < 2) practice.push({ who: '', date: '' })
  const asked = [...EMPLOYER_QUESTIONS, ...i.myQuestions.filter((q) => !EMPLOYER_QUESTIONS.includes(q))]
  return (
    <>
      <HandoutHeader title="Interview Prep" subtitle="My 30-second introduction" name={fullName(packet.profile)} updated={shortDate(todayIso())} />
      <Callout>Almost every interview starts with "Tell me about yourself." Plan your answer, then practice it out loud until it feels natural.</Callout>
      <HSection title="My introduction">
        <table className="h-table h-fields"><tbody>
          {INTRO_PARTS.map((p, n) => (
            <tr key={p.key}>
              <th style={{ width: '32%' }}>{n + 1}. {p.label}{'hint' in p && <span className="h-small font-normal"> {p.hint.toLowerCase()}</span>}</th>
              <td style={{ height: '24pt' }}>{i[p.key]}</td>
            </tr>
          ))}
        </tbody></table>
        <p className="h-small mt-1">Example: {INTRO_EXAMPLE}</p>
      </HSection>
      <HSection title="Practice log">
        <table className="h-table h-fields"><tbody>
          {practice.map((r, n) => <tr key={n}><th style={{ width: '22%' }}>I practiced with</th><td>{r.who}</td><th style={{ width: '12%' }}>Date</th><td style={{ width: '18%' }}>{shortDate(r.date)}</td></tr>)}
          <tr><th>I recorded myself</th><td colSpan={3}><Box on={i.recorded}>Yes</Box><span style={{ marginLeft: '14pt' }}>What I want to do better: {i.doBetter}</span></td></tr>
        </tbody></table>
      </HSection>
      <HSection title="Questions I can ask the employer" note="Check 2 to use at the end of the interview.">
        {asked.map((q) => <div key={q}><Box on={i.myQuestions.includes(q)}>{q}</Box></div>)}
      </HSection>
      <HandoutFooter page="Interview Prep" />
    </>
  )
}

export function PracticeQuestionsSheet() {
  const { packet } = useStore()
  const i = packet.pages.interview
  return (
    <>
      <HandoutHeader title="Practice Questions" subtitle="Common interview questions" name={fullName(packet.profile)} />
      <HSection title="My answers" note="Write key words, not full sentences.">
        <table className="h-table">
          <thead><tr><th style={{ width: '45%' }}>Question</th><th>My answer (key words)</th></tr></thead>
          <tbody>
            {PRACTICE_QUESTIONS.map((q) => (
              <tr key={q.key}>
                <th>{q.label}{q.note && !q.note.startsWith('Good answer') && <><br /><span className="h-small font-normal">{q.note}</span></>}</th>
                <td style={{ height: '34pt' }}>{i.answers[q.key]}</td>
              </tr>
            ))}
            <tr><th>Other question I want to practice: {i.otherQuestion}</th><td style={{ height: '34pt' }}>{i.otherAnswer}</td></tr>
          </tbody>
        </table>
        <p className="h-small mt-1">
          Good answers to "didn't know how": "I would ask my supervisor to show me."  |  Upset customer: "I would stay
          calm, listen, and get a manager if I needed help."
        </p>
      </HSection>
      <HandoutFooter page="Interview Prep" />
    </>
  )
}

export function QuizSheet() {
  const { packet } = useStore()
  const quiz = packet.pages.interview.quiz
  return (
    <>
      <HandoutHeader title="Online Assessment Practice" subtitle='The "agree or disagree" quiz on many applications' name={fullName(packet.profile)} />
      <Callout>
        Many store and restaurant jobs give an online quiz with statements like "I like to keep things organized." You
        choose how much you agree. There are no trick questions. The employer is looking for someone who is reliable,
        honest, safe, friendly, and follows rules.
      </Callout>
      <HSection title="Tips">
        <table className="h-table"><tbody>
          {QUIZ_TIPS.map((t, n) => <tr key={t}><th className="center" style={{ width: '6%' }}>{n + 1}</th><td>{t}</td></tr>)}
        </tbody></table>
      </HSection>
      <HSection title="Practice" note="Check one box for each, then talk about your answers with your teacher.">
        <table className="h-table">
          <thead><tr><th>Statement</th>{QUIZ_CHOICES.map((c) => <th key={c.value} className="center" style={{ width: '13%' }}>{c.label}</th>)}</tr></thead>
          <tbody>
            {QUIZ.map((q, n) => (
              <tr key={q.text}>
                <td>{n + 1}. {q.text}</td>
                {QUIZ_CHOICES.map((c) => <td key={c.value} className="center"><Box on={quiz[n] === c.value} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="h-small mt-2">Answer key (for teacher): {QUIZ_KEY}</p>
      </HSection>
      <HandoutFooter page="Interview Prep" />
    </>
  )
}

export function InterviewDaySheet() {
  const { packet } = useStore()
  const i = packet.pages.interview
  const group = (n: number) => (
    <td style={{ width: '50%' }}>
      <b>{INTERVIEW_DAY[n].title.toUpperCase()}</b>
      {INTERVIEW_DAY[n].items.map((item) => <div key={item}><Box on={i.checklist.includes(item)}>{item}</Box></div>)}
    </td>
  )
  return (
    <>
      <HandoutHeader title="Interview Day" subtitle="Checklist for before, during, and after" name={fullName(packet.profile)} />
      <table className="h-table mt-3"><tbody>
        <tr>{group(0)}{group(1)}</tr>
        <tr>{group(2)}{group(3)}</tr>
      </tbody></table>
      <Callout>{INTERVIEW_ACCOMMODATION}</Callout>
      <HSection title="After: send a thank-you" note="Send it by email or text within 1 day.">
        <div className="h-letter" style={{ whiteSpace: 'pre-line', fontSize: '10.5pt', border: '1pt solid #b8cde0', padding: '6pt 10pt' }}>
          {thankYouText(packet)}
        </div>
      </HSection>
      <HSection title="How did it go?">
        <table className="h-table h-fields"><tbody>
          <tr><th style={{ width: '30%' }}>Company / date</th><td>{i.howCompanyDate}</td></tr>
          <tr><th>What went well</th><td style={{ height: '30pt' }}>{i.wentWell}</td></tr>
          <tr><th>What I'll practice next time</th><td style={{ height: '30pt' }}>{i.practiceNext}</td></tr>
        </tbody></table>
      </HSection>
      <HandoutFooter page="Interview Prep" />
    </>
  )
}
