// Places TRACE students often work, so a job can be filled in by tapping instead of typing.
//
// TO ADD OR CHANGE A PLACE, edit the list below. Nothing else needs to change.
//   employers: names only. No addresses, phone numbers, or supervisor names (this file is public).
//   titles:    job titles a student might have there.
//   duties:    short and past tense, starting with an action word. No commas inside a duty,
//              because commas are how the app tells one duty from the next.
//   skills:    offered on the resume's skills step when a student has a job of this kind.
import { splitDuties } from './resume'

export interface PlaceKind {
  id: string
  label: string
  employers: string[]
  titles: string[]
  duties: string[]
  skills: string[]
}

export const PLACE_KINDS: PlaceKind[] = [
  {
    id: 'store',
    label: 'Grocery or drug store',
    employers: ['CVS', 'Smart & Final', 'Grocery Outlet'],
    titles: ['Store Associate', 'Courtesy Clerk', 'Stocker'],
    duties: [
      'Brought carts in from the parking lot',
      'Faced products on the shelves',
      'Helped customers find items',
      'Cleaned and swept the aisles',
      'Stocked shelves',
      'Bagged groceries',
      'Put returned items back on the right shelf',
      'Broke down boxes',
    ],
    skills: ['Customer service', 'Stocking shelves', 'Cleaning and organizing', 'Safe lifting'],
  },
  {
    id: 'shelter',
    label: 'Animal shelter',
    employers: ['SPCA'],
    titles: ['Volunteer', 'Animal Care Volunteer'],
    duties: [
      'Cleaned cages and kennels',
      'Fed the animals',
      'Gave the animals fresh water',
      'Washed food bowls and bedding',
      'Walked dogs',
    ],
    skills: ['Animal care', 'Cleaning and organizing', 'Following a schedule'],
  },
  {
    id: 'park',
    label: 'Theme park',
    employers: ['SeaWorld'],
    titles: ['Park Services Attendant', 'Guest Services Attendant'],
    duties: [
      'Cleaned tables and walkways',
      'Greeted guests and answered questions',
      'Emptied trash and recycling',
      'Restocked restrooms',
      'Helped guests find their way around the park',
    ],
    skills: ['Customer service', 'Cleaning and organizing', 'Giving directions'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    employers: [],
    titles: ['Busser', 'Dining Room Attendant', 'Dishwasher'],
    duties: [
      'Cleared and wiped tables',
      'Carried dishes to the kitchen',
      'Set tables for the next guests',
      'Refilled drinks and condiments',
      'Washed dishes',
      'Took out trash and recycling',
    ],
    skills: ['Clearing and setting tables', 'Washing dishes', 'Cleaning and organizing', 'Working on a team'],
  },
  {
    id: 'coffee',
    label: 'Coffee shop',
    employers: [],
    titles: ['Café Attendant', 'Team Member'],
    duties: [
      'Wiped tables and counters',
      'Restocked cups and napkins',
      'Greeted customers',
      'Swept and mopped the floor',
      'Took out trash and recycling',
    ],
    skills: ['Customer service', 'Cleaning and organizing', 'Restocking supplies'],
  },
]

export const KNOWN_EMPLOYERS = PLACE_KINDS.flatMap((k) => k.employers)

// "Smart and Final #412" and "smart & final" are the same place.
const plain = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '')

export function kindForEmployer(employer: string) {
  const typed = plain(employer)
  if (!typed) return undefined
  return PLACE_KINDS.find((k) => k.employers.some((e) => typed.includes(plain(e))))
}

export const kindById = (id: string) => PLACE_KINDS.find((k) => k.id === id)

const sameDuty = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

const ALL_DUTIES = PLACE_KINDS.flatMap((k) => k.duties)
const isKnownDuty = (text: string) => ALL_DUTIES.some((d) => sameDuty(d, text))
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

// Like splitDuties, but also pulls apart "Stocked shelves and bagged groceries", which has no comma,
// and a second sentence the student typed after the first.
// It only splits at an "and" when one side is a duty from the list, so "Cleaned cages and kennels" stays whole.
function parseDuties(duties: string): string[] {
  const sentences = duties.split(/\.\s+/).filter((t) => t.trim())
  if (sentences.length > 1) return sentences.flatMap(parseDuties)
  const parts = splitDuties(duties)
  if (parts.length !== 1 || isKnownDuty(parts[0])) return parts
  const text = parts[0]
  for (const m of text.matchAll(/ and /g)) {
    const left = text.slice(0, m.index)
    const right = capitalize(text.slice(m.index + m[0].length))
    if (isKnownDuty(left) || isKnownDuty(right)) return [left, right]
  }
  return parts
}

export const hasDuty = (duties: string, duty: string) => parseDuties(duties).some((d) => sameDuty(d, duty))

// The kind of place a job is at: from the employer's name, or from duties already tapped.
export function kindForJob(job: { employer: string; duties: string }) {
  return kindForEmployer(job.employer)
    ?? PLACE_KINDS.find((k) => k.duties.some((d) => hasDuty(job.duties, d)))
}

// Leaves "TRACE ..." alone, turns "Stocked ..." into "stocked ...".
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s)

// ["Stocked shelves", "Bagged groceries", "Broke down boxes"] -> "Stocked shelves, bagged groceries, and broke down boxes."
export function joinDuties(parts: string[]) {
  if (parts.length === 0) return ''
  const [first, ...rest] = parts
  const all = [first, ...rest.map(lowerFirst)]
  const text = all.length < 3 ? all.join(' and ') : `${all.slice(0, -1).join(', ')}, and ${all[all.length - 1]}`
  return `${text}.`
}

// Tapping a duty adds it to the sentence. Tapping it again takes it out.
export function toggleDuty(duties: string, duty: string) {
  const parts = parseDuties(duties)
  return joinDuties(hasDuty(duties, duty) ? parts.filter((d) => !sameDuty(d, duty)) : [...parts, duty])
}

// Skills that go with the kinds of places in a student's work history.
export function skillIdeasFor(jobs: { employer: string; duties: string }[]) {
  const kinds = new Set(jobs.map(kindForJob).filter((k) => k !== undefined))
  return [...new Set([...kinds].flatMap((k) => k.skills))]
}
