// Side Labels look: a navy band for the name, section names down the left, details on the right.
import type { ReactNode } from 'react'
import type { ResumeContent } from '../../../data/resume'

interface RowProps {
  label: string
  children: ReactNode
}

function Row({ label, children }: RowProps) {
  return (
    <section className="r-c-row">
      <h2 className="r-c-label">{label}</h2>
      <div>{children}</div>
    </section>
  )
}

interface LayoutProps {
  r: ResumeContent
}

export function SideLabelsResume({ r }: LayoutProps) {
  return (
    <div className="r-c">
      <div className="r-c-band">
        <h1 className="r-c-name">{r.name}</h1>
        {r.objective && <p className="r-c-goal">{r.objective}</p>}
      </div>
      <p className="r-c-contact">{r.contact || ' '}</p>
      {r.skills.length > 0 && (
        <Row label="Skills">
          <ul className="r-skills two-col" style={{ gridTemplateRows: `repeat(${Math.ceil(r.skills.length / 2)}, auto)` }}>{r.skills.map((s) => <li key={s}>{s}</li>)}</ul>
        </Row>
      )}
      {r.jobs.length > 0 && (
        <Row label="Experience">
          {r.jobs.map((j, i) => (
            <div key={i} className="r-item">
              <p><b>{j.title || 'Volunteer'}</b>, {j.employer}</p>
              {j.dates && <p className="r-c-when">{j.dates}</p>}
              <ul className="r-bullets">{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          ))}
        </Row>
      )}
      <Row label="Education">
        {r.schools.map((s) => (
          <div key={s.name} className="r-item">
            <p><b>{s.name}</b></p>
            {s.dates && <p className="r-c-when">{s.dates}</p>}
            {s.detail && <p>{s.detail}</p>}
          </div>
        ))}
      </Row>
      {r.certifications.length > 0 && <Row label="Certifications"><p>{r.certifications.join('  |  ')}</p></Row>}
      {r.languages && <Row label="Languages"><p>{r.languages}</p></Row>}
      {r.availability && <Row label="Availability"><p>{r.availability}</p></Row>}
      <Row label="References"><p>Available on request.</p></Row>
    </div>
  )
}
