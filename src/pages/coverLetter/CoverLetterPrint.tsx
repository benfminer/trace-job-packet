// Page 02 printed: the finished letter, and the Cover Letter Builder worksheet.
import { useStore } from '../../data/store'
import { coverLetterParagraphs, fullName, STRENGTHS } from '../../data/derive'
import { Boxes, FieldTable, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'
import { LetterBody } from './LetterBody'
import { asOptions, SEND_CHECKLIST } from '../../data/options'

export function LetterSheet() {
  const { packet } = useStore()
  return (
    <div className="h-letter">
      <LetterBody packet={packet} paragraphs={coverLetterParagraphs(packet)} />
    </div>
  )
}

export function BuilderSheet() {
  const { packet } = useStore()
  const c = packet.pages.coverLetter
  const t = packet.target
  const strengthOptions = [...new Set([...STRENGTHS, ...c.strengths])]
  return (
    <>
      <HandoutHeader title="Cover Letter Builder" subtitle="Plan it first, then type it into the template" name={fullName(packet.profile)} />
      <HSection title="1  The job">
        <FieldTable rows={[
          [['Job title', t.title], ['Company name', t.company]],
          [['Where I found the job', t.whereFound], ["Hiring manager's name", t.hiringManager]],
        ]} />
      </HSection>
      <HSection title="2  My experience" note="Jobs, volunteer work, TRACE work sites, or classes all count.">
        <FieldTable rows={[
          [['I have experience', c.experienceWith]],
          [['Place #1 and what I did there', [c.place1, c.did1].filter(Boolean).join(': ')]],
          [['Place #2 and what I did there', [c.place2, c.did2].filter(Boolean).join(': ')]],
        ]} />
      </HSection>
      <HSection title="3  My strengths" note="Pick 2, or write your own.">
        <Boxes options={asOptions(strengthOptions)} selected={c.strengths} />
        {c.doWell && <p className="mt-1">Something I do well: I {c.doWell}</p>}
      </HSection>
      <HSection title="4  Why this company?">
        <table className="h-table"><tbody><tr><td style={{ height: '30pt' }}>{c.why}</td></tr></tbody></table>
      </HSection>
      <HSection title="5  When I can work" note="Copy from your Weekly Availability page.">
        <table className="h-table"><tbody><tr><td style={{ height: '24pt' }}>{c.whenCanWork}</td></tr></tbody></table>
      </HSection>
      <HSection title="Before you send it">
        <Boxes options={asOptions(SEND_CHECKLIST)} selected={c.checklist} />
      </HSection>
      <HandoutFooter page="Cover Letter" />
    </>
  )
}
