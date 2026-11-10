// Page 03 printed like the handout.
import { useStore } from '../../data/store'
import { blankCert, blankJob, type Packet, type YesNo } from '../../data/packet'
import { availabilitySentence, fullName, shortDate, todayIso } from '../../data/derive'
import { fullAddress } from '../../data/format'
import { TRACE_ADDRESS, TRACE_PROGRAM } from '../../data/apply'
import { Box, Boxes, Callout, FieldTable, HandoutFooter, HandoutHeader, HSection, QuestionTable } from '../../components/handout'

const YN = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
const yn = (v: YesNo) => <Boxes options={YN} selected={v} />

interface SectionProps {
  packet: Packet
}

function ContactSections({ packet }: SectionProps) {
  const p = packet.profile
  const [e1, e2] = p.emergency
  return (
    <>
      <HSection title="My contact information">
        <FieldTable rows={[
          [['Legal first name', p.firstName], ['Middle name', p.middleName]],
          [['Legal last name', p.lastName], ['Preferred name', p.preferredName]],
          [['Street address', p.street], ['Apt / Unit #', p.apt]],
          [['City', p.city], ['State', p.state]],
          [['ZIP code', p.zip], ['Cell phone', p.cellPhone]],
          [['Other phone', p.otherPhone], ['Email', p.email]],
          [['Date of birth', shortDate(p.dob)], ['Age 18 or older?', yn(p.is18)]],
          [['Social Security #', <b key="ssn">DO NOT WRITE IT HERE. Bring your card or know your number by heart.</b>]],
        ]} />
      </HSection>
      <HSection title="Emergency contacts">
        <FieldTable rows={[
          [['#1 Name', e1.name], ['Relationship', e1.relationship]], [['#1 Phone', e1.phone]],
          [['#2 Name', e2.name], ['Relationship', e2.relationship]], [['#2 Phone', e2.phone]],
        ]} />
      </HSection>
    </>
  )
}

function JobAndSchoolSections({ packet }: SectionProps) {
  const p = packet.profile
  const a = packet.pages.appInfo
  // Room to write in more by hand.
  const certs = [...p.certifications]
  while (certs.length < 3) certs.push(blankCert())
  return (
    <>
      <HSection title="The job I want">
        <FieldTable rows={[
          [['Job(s) I want', a.jobsWanted]],
          [['Pay I want', <span key="pay">{a.payWanted ? `$ ${a.payWanted.replace(/^\$\s*/, '')} /hour` : '$ ________ /hour'}  <Box on={a.payOpen}>Open</Box></span>], ['Can start on', a.startDate]],
          [['Type of job', <Boxes key="type" options={[{ value: 'part', label: 'Part' }, { value: 'full', label: 'Full' }, { value: 'either', label: 'Either' }]} selected={a.jobType} />], ['Hours per week', p.hoursWanted]],
          [['Days and times', availabilitySentence(p) || 'See my Weekly Availability page.']],
        ]} />
        <p className="h-small mt-1">Tip: If an application asks for pay and you're not sure, write "Open" or "Negotiable."</p>
      </HSection>
      <HSection title="Education">
        <FieldTable rows={[
          [['Current program', TRACE_PROGRAM], ['Start date', p.traceStart]],
          [['Address', TRACE_ADDRESS], ["What I'm working on", p.traceWorkingOn]],
          [['High school', p.hsName], ['Address', fullAddress(p.hsAddress, p.hsCity, p.hsState, p.hsZip)]],
          [['Dates attended', p.hsDates], ['Diploma or certificate?', <Boxes key="cred" options={[{ value: 'diploma', label: 'Diploma' }, { value: 'certificate', label: 'Certificate' }]} selected={p.hsCredential} />]],
          [['Year finished', p.hsYear], ['Highest grade completed', p.highestGrade]],
        ]} />
      </HSection>
      <HSection title="Certifications and licenses">
        <table className="h-table">
          <thead><tr><th>Name (e.g., Food Handler Card, CPR)</th><th>Date earned</th><th>Expires</th><th>Card number (if any)</th></tr></thead>
          <tbody>{certs.map((c, i) => <tr key={i}><td>{c.name}&nbsp;</td><td>{c.earned}</td><td>{c.expires}</td><td></td></tr>)}</tbody>
        </table>
        <p className="mt-1">Driver's license? <Boxes options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'permit', label: 'Permit only' }]} selected={p.driversLicense} /> State: <u>{p.licenseState || ' '.repeat(8)}</u></p>
      </HSection>
    </>
  )
}

function WorkSection({ packet }: SectionProps) {
  // Only jobs with something typed in. With none, one blank job to fill in by hand.
  const filled = packet.profile.jobs.filter((j) => j.employer.trim() || j.title.trim())
  const jobs = filled.length ? filled : [blankJob()]
  return (
    <HSection title="Work and volunteer history" note="Start with the most recent. TRACE work sites and volunteering count.">
      {jobs.map((j, i) => (
        <div key={i} className="keep-together mb-2">
          <p className="h-small font-bold" style={{ color: '#1e88d2' }}>Job #{i + 1}{i === 0 ? ' (most recent)' : ''}</p>
          <FieldTable rows={[
            [['Employer', j.employer], ['Job title', j.title]],
            [['Address', fullAddress(j.address, j.city, j.state, j.zip)], ['Phone', j.phone]],
            [['Supervisor', j.supervisor], ['Start (month/year)', j.start]],
            [['End (or "Present")', j.end], ['Starting pay', j.startPay]],
            [['Ending pay', j.endPay], ['OK to contact?', yn(j.okToContact)]],
            [['What I did', j.duties]],
            [['Reason I left', j.reasonLeft]],
          ]} />
        </div>
      ))}
    </HSection>
  )
}

function QuestionsSection({ packet }: SectionProps) {
  const a = packet.pages.appInfo
  return (
    <HSection title="Questions applications usually ask">
      <p className="h-small mb-1">Decide your answers ahead of time with your teacher, so you're not guessing on the computer.</p>
      <QuestionTable rows={[
        ['Are you legally allowed to work in the U.S.?', yn(a.legalToWork)],
        ['Will you need visa sponsorship now or in the future?', yn(a.sponsorship)],
        ['Have you ever worked for this company before?', <span key="wh">{yn(a.workedHereBefore)}   When: {a.workedHereWhen || '______'}</span>],
        ['Do you know anyone who works here?', a.knowAnyone],
        ['Do you have reliable transportation?', <span key="rt">{yn(a.reliableTransport)}   How: {a.transportHow || '______'}</span>],
        ['Can you lift ____ lbs? Stand for a full shift?', a.liftStand],
        ['How did you hear about this job?', packet.target.whereFound],
        ['Can you work weekends? Holidays?', a.weekendsHolidays],
      ]} />
    </HSection>
  )
}

export function AppInfoSheet() {
  const { packet } = useStore()
  return (
    <>
      <HandoutHeader title="Online Application Info Sheet" subtitle="Everything you need to fill out a job application, in one place" />
      <FieldTable rows={[[['Student', fullName(packet.profile)], ['Last updated', shortDate(todayIso())]]]} />
      <ContactSections packet={packet} />
      <JobAndSchoolSections packet={packet} />
      <WorkSection packet={packet} />
      <Callout>
        <b>Good ways to say why you left:</b> "My program internship ended."  |  "It was a seasonal job."  |  "I went
        back to school."  |  "I'm looking for more hours."  |  "I moved."  Keep it short and positive.
      </Callout>
      <QuestionsSection packet={packet} />
      <HandoutFooter page="Online Application Info Sheet" />
    </>
  )
}
