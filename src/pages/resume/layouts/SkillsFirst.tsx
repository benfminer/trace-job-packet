// Skills First look: black and white, name in the middle, skills and certifications above the jobs.
// Made for a student with one job, or with work sites and volunteering.
import type { ReactNode } from 'react'
import { extrasLine, extrasTitle, type ResumeContent } from '../../../data/resume'

interface BlockProps {
  title: string
  children: ReactNode
}

function Block({ title, children }: BlockProps) {
  return (
    <section className="r-b-block">
      <h2 className="r-b-heading">{title}</h2>
      {children}
    </section>
  )
}

interface LayoutProps {
  r: ResumeContent
}

export function SkillsFirstResume({ r }: LayoutProps) {
  return (
    <div className="r-b">
      <h1 className="r-b-name">{r.name}</h1>
      <p className="r-b-contact">{r.contact || ' '}</p>
      {r.objective && <Block title="My Goal"><p>{r.objective}</p></Block>}
      {r.skills.length > 0 && (
        <Block title="What I Can Do">
          <ul className="r-skills r-b-three" style={{ gridTemplateRows: `repeat(${Math.ceil(r.skills.length / 3)}, auto)` }}>{r.skills.map((s) => <li key={s}>{s}</li>)}</ul>
        </Block>
      )}
      {extrasTitle(r) && <Block title={extrasTitle(r)}><p>{extrasLine(r)}</p></Block>}
      {r.availability && <Block title="When I Can Work"><p>{r.availability}</p></Block>}
      {r.jobs.length > 0 && (
        <Block title="Experience">
          {r.jobs.map((j, i) => (
            <div key={i} className="r-item">
              <p className="r-row"><b>{j.title || 'Volunteer'}, {j.employer}</b><span className="r-dates">{j.dates}</span></p>
              <ul className="r-bullets">{j.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
            </div>
          ))}
        </Block>
      )}
      <Block title="Education">
        {r.schools.map((s) => (
          <div key={s.name} className="r-item">
            <p className="r-row"><b>{s.name}</b><span className="r-dates">{s.dates}</span></p>
            {s.detail && <p>{s.detail}</p>}
          </div>
        ))}
      </Block>
      <p className="r-refs">References available on request.</p>
    </div>
  )
}
