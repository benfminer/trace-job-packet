// About Me steps: names, address, contact info, emergency contacts.
import { useStore, useProfile } from '../../data/store'
import { Card, Choice, Grid, TextField, Tip } from '../../components/fields'
import { DateField } from '../../components/DateField'
import { yesNo } from '../../data/options'
import { formatState, formatZip } from '../../data/format'

export function NameStep() {
  const { packet, update } = useStore()
  const { p, set } = useProfile()
  return (
    <>
      <Grid>
        <TextField label="Legal first name" value={p.firstName} onChange={(v) => set('firstName', v)} />
        <TextField label="Middle name" value={p.middleName} onChange={(v) => set('middleName', v)} />
        <TextField label="Legal last name" value={p.lastName} onChange={(v) => set('lastName', v)} />
        <TextField label="Preferred name" value={p.preferredName} onChange={(v) => set('preferredName', v)}
          hint="What you like to be called, if it's different." />
      </Grid>
      <Card title="For staff">
        <Grid>
          <TextField label="Teacher" value={packet.teacher} onChange={(v) => update((d) => { d.teacher = v })} />
          <TextField label="Case manager" value={packet.caseManager} onChange={(v) => update((d) => { d.caseManager = v })} />
        </Grid>
      </Card>
    </>
  )
}

export function AddressStep() {
  const { p, set } = useProfile()
  return (
    <Grid>
      <TextField label="Street address" value={p.street} onChange={(v) => set('street', v)} placeholder="1234 Main Street" />
      <TextField label="Apt / Unit #" value={p.apt} onChange={(v) => set('apt', v)} width="short" />
      <TextField label="City" value={p.city} onChange={(v) => set('city', v)} placeholder="San Diego" />
      <Grid>
        <TextField label="State" value={p.state} onChange={(v) => set('state', v)} format={formatState} />
        <TextField label="ZIP code" value={p.zip} onChange={(v) => set('zip', v)} format={formatZip} />
      </Grid>
    </Grid>
  )
}

export function ContactStep() {
  const { p, set } = useProfile()
  return (
    <>
      <Grid>
        <TextField label="Cell phone" type="tel" value={p.cellPhone} onChange={(v) => set('cellPhone', v)} placeholder="(619) 555-0142" />
        <TextField label="Other phone" type="tel" value={p.otherPhone} onChange={(v) => set('otherPhone', v)} />
        <TextField label="Email" type="email" value={p.email} onChange={(v) => set('email', v)}
          hint="Use a grown-up email address, like first.last@gmail.com." />
        <DateField label="Date of birth" value={p.dob} onChange={(v) => set('dob', v)} />
      </Grid>
      <Choice label="Are you 18 or older?" value={p.is18} onChange={(v) => set('is18', v)} options={yesNo} />
      <Tip>
        <b>Social Security number: do not type it here.</b> Bring your card or know your number by heart.
        This app never asks for it.
      </Tip>
    </>
  )
}

export function EmergencyStep() {
  const { p, update } = useProfile()
  const setContact = (i: number, key: 'name' | 'relationship' | 'phone', v: string) =>
    update((d) => { d.profile.emergency[i][key] = v })
  return (
    <>
      {p.emergency.map((c, i) => (
        <Card key={i} title={`Emergency contact #${i + 1}`}>
          <Grid cols={3}>
            <TextField label="Name" value={c.name} onChange={(v) => setContact(i, 'name', v)} />
            <TextField label="Relationship" value={c.relationship} onChange={(v) => setContact(i, 'relationship', v)} placeholder="Mom, aunt, ..." />
            <TextField label="Phone" type="tel" value={c.phone} onChange={(v) => setContact(i, 'phone', v)} />
          </Grid>
        </Card>
      ))}
    </>
  )
}
