import { pageInfo } from '../../data/pages'
import { Wizard } from '../../components/Wizard'
import { PrintShell } from '../../components/PrintShell'
import { PAGE_SHEETS } from '../sheets'
import {
  AnswersStep, HowDidItGoStep, InterviewDayStep, IntroStep, MyQuestionsStep, PracticeStep, QuizStep, ThankYouStep,
} from './InterviewSteps'

const page = pageInfo('interview')

export function InterviewWizard() {
  return (
    <Wizard page={page} steps={[
      { title: 'My introduction', intro: 'Almost every interview starts with "Tell me about yourself." Plan your answer here.', content: <IntroStep /> },
      { title: 'Practice log', content: <PracticeStep /> },
      { title: 'Questions I can ask', content: <MyQuestionsStep /> },
      { title: 'Practice questions', content: <AnswersStep keys={['whyHere', 'strengths', 'improving', 'teamwork']} /> },
      { title: 'More questions', content: <AnswersStep keys={['dontKnow', 'upsetCustomer', 'whyHire', 'whenWork']} withOther /> },
      { title: 'Agree or disagree quiz', intro: 'Pick one answer for each, then talk about your answers with your teacher.', content: <QuizStep /> },
      { title: 'Interview day', intro: 'Check off each one as you get ready.', content: <InterviewDayStep /> },
      { title: 'Thank-you note', content: <ThankYouStep /> },
      { title: 'How did it go?', intro: 'Fill this in after the interview.', content: <HowDidItGoStep /> },
    ]} />
  )
}

export function InterviewPrintView() {
  return <PrintShell page={page} sheets={PAGE_SHEETS.interview} />
}
