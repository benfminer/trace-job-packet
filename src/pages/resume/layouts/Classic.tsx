// Classic look: serif text and TRACE blue lines, like the paper resume template.
import type { ReactNode } from 'react'
import type { ResumeContent } from '../../../data/resume'

interface BlockProps {
  title: string
  children: ReactNode
}

function Block({ title, children }: BlockProps) {
  return (
    <section className="r-block">
      <h2 className="h-section-title">{title}</h2>
      {children}
    </section>
  )
}

interface RowProps {
  left: ReactNode
  right: string
}

function Row({ left, right }: RowProps) {
  return <p className="r-row"><span>{left}</span><span className="r-dates">{right}</span></p>
}

interface LayoutProps {
  r: ResumeContent
}

export function ClassicResume({ r }: LayoutProps) {
  return (
    <>
      <h1 className="h-title" style={{ fontSize: '26pt' }}>{r.name}</h1>
      <p className="r-contact">{r.contact || ' '}</p>
      {r.objective && <Block title="Objective"><p>{r.objective}</p></Block>}
      {r.skills.length > 0 && (
        <Block title="Skills">
          <ul className="r-skills two-col" style={{ gridTemplateRows: `repeat(${Math.ceil(r.skills.length / 2)}, auto)` }}>{r.skills.map((s) => <li key={s}>{s}</li>)}</ul>
        </Block>
      )}
      {r.jobs.length > 0 && (
        <Block title="Work and Volunteer Experience">
          {r.jobs.map((j, i) => (
            <div key={i} className="r-item">
              <Row left={<><b>{j.title || 'Volunteer'}</b>, {j.employer}</>} right={j.dates} />
              <ul className="r-bullets">{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          ))}
        </Block>
      )}
      <Block title="Education">
        {r.schools.map((s) => (
          <div key={s.name} className="r-item">
            <Row left={<b>{s.name}</b>} right={s.dates} />
            {s.detail && <p>{s.detail}</p>}
          </div>
        ))}
      </Block>
      {r.certifications.length > 0 && <Block title="Certifications"><p>{r.certifications.join('  |  ')}</p></Block>}
      {r.languages && <Block title="Languages"><p>{r.languages}</p></Block>}
      {r.availability && <Block title="Availability"><p>{r.availability}</p></Block>}
      <p className="r-refs">References available on request.</p>
    </>
  )
}
