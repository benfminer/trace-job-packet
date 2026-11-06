// Page 06 steps.
import { usePageData } from '../../data/store'
import { DOCS, FIRST_DAY } from '../../data/options'
import type { DocKey, DocRow } from '../../data/packet'
import { Card, Check, Choice, Grid, TextField, Tip } from '../../components/fields'

export function PrivacyTip() {
  return (
    <Tip>
      <b>Keep your numbers private.</b> Never write your Social Security number or ID numbers in this packet.
      Keep the original documents in a safe place at home.
    </Tip>
  )
}

export function I9Step() {
  const { data, set } = usePageData('documents')
  return (
    <>
      <p className="text-lg">
        On your first day or before it, every new employee fills out a form called the <b>I-9</b>. You must show
        <b> original documents</b>. Copies and phone photos are not accepted. Bring one of these:
      </p>
      <Grid>
        <Card title="Option A">
          <p className="text-lg">A U.S. Passport or Passport Card. This one document is enough by itself.</p>
        </Card>
        <Card title="Option B">
          <p className="text-lg">1. A photo ID (California ID card or driver's license)<br />2. PLUS your Social Security card or birth certificate</p>
        </Card>
      </Grid>
      <Choice label="Which option will I bring?" value={data.i9Option} onChange={(v) => set('i9Option', v)}
        options={[{ value: 'A', label: 'Option A' }, { value: 'B', label: 'Option B' }]} />
    </>
  )
}

interface DocCardProps {
  docKey: DocKey
}

function DocCard({ docKey }: DocCardProps) {
  const { data, update } = usePageData('documents')
  const doc = DOCS.find((d) => d.key === docKey)!
  const row = data.docs[docKey]
  const set = <K extends keyof DocRow>(key: K, v: DocRow[K]) => update((d) => { d.pages.documents.docs[docKey][key] = v })
  return (
    <Card title={doc.label}>
      <Check label="I have it" checked={row.have} onChange={(v) => set('have', v)} />
      {row.have ? (
        <Grid>
          <TextField label="Where the original is kept" value={row.where} onChange={(v) => set('where', v)} placeholder="Folder at home" />
          {doc.noExpire ? <p className="self-end pb-3 text-slate-500">Does not expire</p>
            : <TextField label="Expires" value={row.expires} onChange={(v) => set('expires', v)} placeholder="03/2030" />}
        </Grid>
      ) : doc.howToGet && <p className="text-slate-600"><b>Don't have it?</b> {doc.howToGet}</p>}
      {docKey === 'bank' && row.have && (
        <TextField label="Bank name" value={data.bankName} onChange={(v) => update((d) => { d.pages.documents.bankName = v })} />
      )}
    </Card>
  )
}

interface DocListStepProps {
  keys: DocKey[]
}

export function DocListStep({ keys }: DocListStepProps) {
  return (
    <>
      <PrivacyTip />
      {keys.map((k) => <DocCard key={k} docKey={k} />)}
    </>
  )
}

export function FirstDayStep() {
  const { data, set } = usePageData('documents')
  return (
    <Card title="For interviews and my first day">
      {FIRST_DAY.map((item) => (
        <Check key={item} label={item} checked={data.firstDay.includes(item)}
          onChange={(on) => set('firstDay', on ? [...data.firstDay, item] : data.firstDay.filter((x) => x !== item))} />
      ))}
    </Card>
  )
}
