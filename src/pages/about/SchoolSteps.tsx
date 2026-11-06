// About Me steps: school, certifications, driver's license.
import { useProfile } from '../../data/store'
import { Card, Choice, Grid, Ideas, TextField } from '../../components/fields'

export function SchoolStep() {
  const { p, set } = useProfile()
  return (
    <>
      <Card title="Current program: TRACE, San Diego Unified">
        <Grid>
          <TextField label="Start date" value={p.traceStart} onChange={(v) => set('traceStart', v)} placeholder="August 2025" />
          <TextField label="What I'm working on" value={p.traceWorkingOn} onChange={(v) => set('traceWorkingOn', v)}
            placeholder="Job skills, travel training, ..." />
        </Grid>
      </Card>
      <Card title="High school">
        <Grid>
          <TextField label="School name" value={p.hsName} onChange={(v) => set('hsName', v)} />
          <TextField label="Address" value={p.hsAddress} onChange={(v) => set('hsAddress', v)} />
          <TextField label="Dates attended" value={p.hsDates} onChange={(v) => set('hsDates', v)} placeholder="2020 - 2024" />
          <TextField label="Year finished" value={p.hsYear} onChange={(v) => set('hsYear', v)} />
          <TextField label="Highest grade completed" value={p.highestGrade} onChange={(v) => set('highestGrade', v)} />
        </Grid>
        <Choice label="Diploma or certificate?" value={p.hsCredential} onChange={(v) => set('hsCredential', v)}
          options={[{ value: 'diploma', label: 'Diploma' }, { value: 'certificate', label: 'Certificate' }]} />
      </Card>
    </>
  )
}

export function CertificationsStep() {
  const { p, set, update } = useProfile()
  const setCert = (i: number, key: 'name' | 'earned' | 'expires', v: string) =>
    update((d) => { d.profile.certifications[i][key] = v })
  return (
    <>
      {p.certifications.map((c, i) => (
        <Card key={i} title={`Certification #${i + 1}`}>
          <Grid cols={3}>
            <TextField label="Name" value={c.name} onChange={(v) => setCert(i, 'name', v)} placeholder="Food Handler Card" />
            <TextField label="Date earned" value={c.earned} onChange={(v) => setCert(i, 'earned', v)} />
            <TextField label="Expires" value={c.expires} onChange={(v) => setCert(i, 'expires', v)} />
          </Grid>
          {!c.name && <Ideas ideas={['Food Handler Card', 'CPR', 'First Aid']} onPick={(v) => setCert(i, 'name', v)} />}
        </Card>
      ))}
      <Choice label="Driver's license?" value={p.driversLicense} onChange={(v) => set('driversLicense', v)}
        options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'permit', label: 'Permit only' }]} />
      {(p.driversLicense === 'yes' || p.driversLicense === 'permit') && (
        <TextField label="State" value={p.licenseState} onChange={(v) => set('licenseState', v)} width="short" placeholder="CA" />
      )}
    </>
  )
}
