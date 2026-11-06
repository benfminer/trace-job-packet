// Page 08 steps.
import { useProfile, usePageData } from '../../data/store'
import { TRAVEL_MODES, yesNo } from '../../data/options'
import type { Route } from '../../data/packet'
import { Card, Check, Choice, Grid, MultiChoice, TextField, Tip } from '../../components/fields'

export function HowStep() {
  const { data: t, set } = usePageData('transportation')
  const { p, set: setProfile } = useProfile()
  return (
    <>
      <MultiChoice label="I usually get around by" value={p.travelModes} onChange={(v) => setProfile('travelModes', v)}
        options={TRAVEL_MODES} hint="Same answer as your Weekly Availability page." />
      <Choice label="PRONTO pass" value={t.pronto} onChange={(v) => set('pronto', v)}
        options={[{ value: 'card', label: 'Card' }, { value: 'app', label: 'App' }]} />
      <Choice label="Reduced Fare?" value={t.reducedFare} onChange={(v) => set('reducedFare', v)}
        options={[...yesNo, { value: 'apply' as const, label: 'Need to apply' }]} />
      <Choice label="Trip-planning app" value={t.tripApp} onChange={(v) => set('tripApp', v)}
        options={[{ value: 'google', label: 'Google Maps' }, { value: 'transit', label: 'Transit' }]} />
      <Choice label="MTS Access eligible?" value={t.accessEligible} onChange={(v) => set('accessEligible', v)}
        options={[...yesNo, { value: 'notsure' as const, label: 'Not sure' }]} />
      <TextField label="My closest stop to home" value={t.closestStop} onChange={(v) => set('closestStop', v)} placeholder="University Ave & 43rd St" />
      <Tip>
        Reduced Fare for riders with disabilities and MTS Access sign-up: ask at the MTS Transit Store or sdmts.com.
        MTS Access rides must be booked ahead of time.
      </Tip>
    </>
  )
}

interface RouteStepProps {
  index: number
}

export function RouteStep({ index }: RouteStepProps) {
  const { data, update } = usePageData('transportation')
  const r = data.routes[index]
  const set = <K extends keyof Route>(key: K, v: Route[K]) => update((d) => { d.pages.transportation.routes[index][key] = v })
  return (
    <>
      <TextField label="Workplace and address" value={r.workplace} onChange={(v) => set('workplace', v)} placeholder="Smart & Final, 6235 El Cajon Blvd." />
      <Grid>
        <TextField label="Route(s) I take" value={r.routes} onChange={(v) => set('routes', v)} placeholder="Bus 1, then Bus 15" />
        <TextField label="Where I transfer" value={r.transfer} onChange={(v) => set('transfer', v)} />
        <TextField label="Stop where I get off" value={r.getOff} onChange={(v) => set('getOff', v)} />
        <TextField label="Travel time" value={r.travelTime} onChange={(v) => set('travelTime', v)} placeholder="45 minutes" />
        <TextField label="Leave home by" value={r.leaveBy} onChange={(v) => set('leaveBy', v)} placeholder="1:00 PM" />
        <TextField label="Last bus/trolley home" value={r.lastHome} onChange={(v) => set('lastHome', v)} placeholder="10:15 PM" />
      </Grid>
      <Card title="Practice run">
        <Check label="I practiced this trip" checked={r.practiced} onChange={(v) => set('practiced', v)} />
        <TextField label="Date" type="date" width="short" value={r.practicedDate} onChange={(v) => set('practicedDate', v)} />
      </Card>
    </>
  )
}

export function WrongStep() {
  const { data: t, set } = usePageData('transportation')
  return (
    <>
      <TextField label="If I'm going to be late, I call (name and number)" value={t.lateCall} onChange={(v) => set('lateCall', v)}
        placeholder="My supervisor, (619) 555-0122" />
      <TextField label="If I miss my bus, my backup plan is" value={t.missBackup} onChange={(v) => set('missBackup', v)}
        placeholder="Take the next bus and call my supervisor" />
      <TextField label="If I get lost, I call (name and number)" value={t.lostCall} onChange={(v) => set('lostCall', v)} />
      <Tip>
        <b>Running late?</b> Call your supervisor before your shift starts. Say: <i>"Hi, this is ____. My bus is late.
        I'll be there at ____."</i>
      </Tip>
    </>
  )
}
