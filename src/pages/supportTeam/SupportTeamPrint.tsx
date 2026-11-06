// Page 09 printed like the handout.
import { useStore } from '../../data/store'
import { TEAM_ROLES, WHO_TO_CALL } from '../../data/options'
import { fullName, shortDate, todayIso } from '../../data/derive'
import { Callout, HandoutFooter, HandoutHeader, HSection, QuestionTable } from '../../components/handout'

export function SupportTeamSheet() {
  const { packet } = useStore()
  const t = packet.pages.supportTeam
  return (
    <>
      <HandoutHeader title="My Support Team" subtitle="People and agencies that help me with work" name={fullName(packet.profile)} updated={shortDate(todayIso())} />
      <Callout>Fill in only the ones that apply to you. Leave the rest blank.</Callout>
      <HSection title="My team">
        <table className="h-table">
          <thead><tr><th style={{ width: '32%' }}>Who</th><th>Name</th><th>Phone</th><th>Email</th></tr></thead>
          <tbody>
            {TEAM_ROLES.map((r) => {
              const m = t.members[r.key]
              return (
                <tr key={r.key}>
                  <th>
                    {r.key === 'other' ? `Other: ${t.otherRole}` : r.label}
                    {r.note && <><br /><span className="h-small font-normal">{r.note}</span></>}
                  </th>
                  <td>{m.name}</td><td>{m.phone}</td><td>{m.email}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HSection>
      <HSection title="Who do I call when...">
        <QuestionTable rows={WHO_TO_CALL.map((q) => [q.label, t[q.key]])} />
      </HSection>
      <HandoutFooter page="My Support Team" />
    </>
  )
}
