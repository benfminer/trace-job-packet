// Page 04 printed like the handout: the packet page and the copy you hand to employers.
import { useStore } from '../../data/store'
import { contactLine, fullName, shortDate } from '../../data/derive'
import { Box, Callout, FieldTable, HandoutFooter, HandoutHeader, HSection } from '../../components/handout'

export function ReferencesSheet() {
  const { packet } = useStore()
  const { people, uses } = packet.pages.references
  const rows = uses.filter((u) => u.date || u.job || u.listed)
  while (rows.length < 3) rows.push({ date: '', job: '', listed: '', toldThem: false })
  return (
    <>
      <HandoutHeader title="My References" subtitle="People who can tell an employer I'm a good worker" name={fullName(packet.profile)} />
      <Callout>
        <b>Who makes a good reference?</b> A teacher, job coach, case manager, past supervisor, coach, or volunteer
        leader. <b>Not</b> family members or friends.<br />
        <b>Always ask first.</b> Say: <i>"Would you be a reference for me when I apply for jobs?"</i> Then let them
        know when you apply, so they expect a call.
      </Callout>
      {people.map((r, i) => (
        <HSection key={i} title={`Reference #${i + 1}`}>
          <FieldTable rows={[
            [['Name', r.name], ['Job title', r.jobTitle]],
            [['Where they work', r.workplace], ['How they know me', r.howTheyKnowMe]],
            [['Phone', r.phone], ['Email', r.email]],
            [['Known me for', r.knownFor], ['I asked them', <span key="asked"><Box on={r.saidYes}>They said yes</Box> <span className="h-small">Date: {shortDate(r.askedDate) || '______'}</span></span>]],
          ]} />
        </HSection>
      ))}
      <HSection title="When I use my references">
        <table className="h-table">
          <thead><tr><th>Date</th><th>Job / company</th><th>References I listed (#1, #2, #3)</th><th>I told them</th></tr></thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={i}><td>{shortDate(u.date)}&nbsp;</td><td>{u.job}</td><td>{u.listed}</td><td className="center"><Box on={u.toldThem} /></td></tr>
            ))}
          </tbody>
        </table>
      </HSection>
      <HandoutFooter page="References" />
    </>
  )
}

export function EmployerReferencesSheet() {
  const { packet } = useStore()
  const p = packet.profile
  const people = packet.pages.references.people.filter((r) => r.name)
  return (
    <div className="h-letter">
      <h1 className="h-title" style={{ fontSize: '28pt' }}>{fullName(p) || '[Your Name]'}</h1>
      <p className="h-small" style={{ fontFamily: 'Georgia, serif', fontSize: '10.5pt', borderBottom: '1.2pt solid #1e88d2', paddingBottom: '4pt' }}>
        {contactLine(p) || '\u00a0'}
      </p>
      <h2 className="h-section-title" style={{ marginTop: '18pt', fontSize: '12pt', fontFamily: 'Arial, sans-serif' }}>Professional References</h2>
      {people.map((r, i) => (
        <div key={i} style={{ marginTop: '14pt' }}>
          <p style={{ fontWeight: 'bold', fontSize: '13pt', margin: 0 }}>{r.name}</p>
          <p style={{ color: '#1e88d2', fontWeight: 'bold', margin: 0 }}>{[r.jobTitle, r.workplace].filter(Boolean).join(', ')}</p>
          {r.howTheyKnowMe && <p style={{ margin: 0 }}>{r.howTheyKnowMe}{r.knownFor ? ` for ${r.knownFor}` : ''}</p>}
          <p style={{ margin: 0 }}>{[r.phone, r.email].filter(Boolean).join('  |  ')}</p>
        </div>
      ))}
      {people.length === 0 && <p className="h-small" style={{ marginTop: '14pt' }}>Add your references to fill in this page.</p>}
    </div>
  )
}
