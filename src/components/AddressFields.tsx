// Street on one line, then city, state, and ZIP in their own boxes.
import { formatState, formatZip } from '../data/format'
import { TextField } from './fields'

export type AddressPart = 'street' | 'city' | 'state' | 'zip'

interface AddressFieldsProps {
  street: string
  city: string
  state: string
  zip: string
  onChange: (part: AddressPart, v: string) => void
  streetLabel?: string
}

export function AddressFields({ street, city, state, zip, onChange, streetLabel = 'Street address' }: AddressFieldsProps) {
  return (
    <div className="space-y-4">
      <TextField label={streetLabel} value={street} onChange={(v) => onChange('street', v)} placeholder="1234 Main Street" />
      <div className="grid gap-4 sm:grid-cols-[1fr_6rem_9rem]">
        <TextField label="City" value={city} onChange={(v) => onChange('city', v)} placeholder="San Diego" />
        <TextField label="State" value={state} onChange={(v) => onChange('state', v)} format={formatState} />
        <TextField label="ZIP code" value={zip} onChange={(v) => onChange('zip', v)} format={formatZip} />
      </div>
    </div>
  )
}
