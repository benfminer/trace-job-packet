// Page 09 steps.
import { usePageData } from '../../data/store'
import { TEAM_ROLES, WHO_TO_CALL } from '../../data/options'
import type { TeamKey, TeamMember } from '../../data/packet'
import { Card, Grid, Ideas, TextField, Tip } from '../../components/fields'

interface MemberCardProps {
  roleKey: TeamKey
}

function MemberCard({ roleKey }: MemberCardProps) {
  const { data, update } = usePageData('supportTeam')
  const role = TEAM_ROLES.find((r) => r.key === roleKey)!
  const m = data.members[roleKey]
  const set = (key: keyof TeamMember, v: string) => update((d) => { d.pages.supportTeam.members[roleKey][key] = v })
  return (
    <Card title={role.label}>
      {role.note && <p className="-mt-2 text-slate-500">{role.note}</p>}
      {roleKey === 'other' && (
        <TextField label="Who are they?" value={data.otherRole} onChange={(v) => update((d) => { d.pages.supportTeam.otherRole = v })}
          placeholder="Therapist, coach, mentor" />
      )}
      <Grid cols={3}>
        <TextField label="Name" value={m.name} onChange={(v) => set('name', v)} />
        <TextField label="Phone" type="tel" value={m.phone} onChange={(v) => set('phone', v)} />
        <TextField label="Email" type="email" value={m.email} onChange={(v) => set('email', v)} />
      </Grid>
    </Card>
  )
}

interface TeamStepProps {
  keys: TeamKey[]
}

export function TeamStep({ keys }: TeamStepProps) {
  return (
    <>
      <Tip>Fill in only the ones that apply to you. Leave the rest blank.</Tip>
      {keys.map((k) => <MemberCard key={k} roleKey={k} />)}
    </>
  )
}

export function WhoToCallStep() {
  const { data, set } = usePageData('supportTeam')
  const people = TEAM_ROLES.filter((r) => data.members[r.key].name)
    .map((r) => `${data.members[r.key].name} (${r.key === 'other' ? data.otherRole || 'Other' : r.label.split(' / ')[0]})`)
  return (
    <>
      {WHO_TO_CALL.map((q) => (
        <div key={q.key}>
          <TextField label={q.label} value={data[q.key]} onChange={(v) => set(q.key, v)} />
          {people.length > 0 && <Ideas label="Tap a person:" ideas={people} onPick={(v) => set(q.key, v)} />}
        </div>
      ))}
    </>
  )
}
