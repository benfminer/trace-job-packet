// The answers online job applications ask for, grouped the way most applications ask them.
// Used by the "Applying now" screen. Blank answers are left out, and so are groups with none.
import type { Packet, YesNo } from './packet'
import { availabilitySentence } from './derive'
import { fullAddress, isoToUs } from './format'

export const TRACE_PROGRAM = 'TRACE, San Diego Unified'
export const TRACE_ADDRESS = '4063 Polk Ave., San Diego, CA 92105'

export type CopySection = { title: string; rows: [label: string, value: string][] }

const yesNoText = (v: YesNo) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : '')

export function applySections(packet: Packet): CopySection[] {
  const p = packet.profile
  const a = packet.pages.appInfo
  const jobs = p.jobs.filter((j) => j.employer.trim() || j.title.trim())
  const sections: CopySection[] = [
    { title: 'My name', rows: [
      ['Legal first name', p.firstName], ['Middle name', p.middleName], ['Legal last name', p.lastName],
      ['Preferred name', p.preferredName],
    ] },
    { title: 'Where I live', rows: [
      ['Street address', p.street], ['Apt / Unit #', p.apt], ['City', p.city], ['State', p.city || p.zip ? p.state : ''],
      ['ZIP code', p.zip], ['Whole address on one line', fullAddress(p.street + (p.apt ? ` #${p.apt.replace(/^#/, '')}` : ''), p.city, p.state, p.zip)],
    ] },
    { title: 'How to reach me', rows: [
      ['Cell phone', p.cellPhone], ['Other phone', p.otherPhone], ['Email', p.email], ['Date of birth', isoToUs(p.dob)],
    ] },
    ...p.emergency.map((e, i) => ({ title: `Emergency contact #${i + 1}`, rows: [
      ['Name', e.name], ['Relationship', e.relationship], ['Phone', e.phone],
    ] as CopySection['rows'] })),
    { title: 'The job I want', rows: [
      ['Job(s) I want', a.jobsWanted], ['Pay I want', a.payOpen ? 'Open' : a.payWanted], ['Can start on', a.startDate],
      ['Hours per week', p.hoursWanted], ['Days and times I can work', availabilitySentence(p)],
    ] },
    { title: 'School', rows: [
      ['Current program', TRACE_PROGRAM], ['Program address', TRACE_ADDRESS], ['Program start date', p.traceStart],
      ['High school', p.hsName], ['High school street', p.hsAddress], ['High school city', p.hsCity],
      ['High school ZIP', p.hsZip], ['Dates attended', p.hsDates], ['Year finished', p.hsYear],
      ['Highest grade completed', p.highestGrade],
    ] },
    ...jobs.map((j, i) => ({ title: `Job #${i + 1}${i === 0 ? ' (most recent)' : ''}`, rows: [
      ['Employer', j.employer], ['Job title', j.title], ['Street address', j.address], ['City', j.city],
      ['State', j.city || j.zip ? j.state : ''], ['ZIP code', j.zip], ['Phone', j.phone], ['Supervisor', j.supervisor],
      ['Start date', j.start], ['End date', j.end], ['Starting pay', j.startPay], ['Ending pay', j.endPay],
      ['What I did', j.duties], ['Reason I left', j.reasonLeft],
    ] as CopySection['rows'] })),
    ...p.certifications.filter((c) => c.name.trim()).map((c) => ({ title: `Certification: ${c.name}`, rows: [
      ['Name', c.name], ['Date earned', c.earned], ['Expires', c.expires],
    ] as CopySection['rows'] })),
    { title: 'Questions applications ask', rows: [
      ['Legally allowed to work in the U.S.?', yesNoText(a.legalToWork)],
      ['Need visa sponsorship?', yesNoText(a.sponsorship)],
      ['Worked for this company before?', [yesNoText(a.workedHereBefore), a.workedHereBefore === 'yes' ? a.workedHereWhen : ''].filter(Boolean).join(', ')],
      ['Know anyone who works here?', a.knowAnyone],
      ['Reliable transportation?', [yesNoText(a.reliableTransport), a.reliableTransport === 'yes' ? a.transportHow : ''].filter(Boolean).join(', ')],
      ['Lifting and standing', a.liftStand],
      ['How I heard about this job', packet.target.whereFound],
      ['Weekends and holidays', a.weekendsHolidays],
    ] },
  ]
  return sections
    .map((s) => ({ ...s, rows: s.rows.filter(([, v]) => v.trim()) }))
    .filter((s) => s.rows.length > 0)
}
