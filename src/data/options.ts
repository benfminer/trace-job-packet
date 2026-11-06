// Choice lists taken from the handouts, shared by wizards and print layouts.

export const yesNo = [{ value: 'yes' as const, label: 'Yes' }, { value: 'no' as const, label: 'No' }]

export const SLOTS = [
  { key: 'morning', label: 'Morning', hours: '6 AM - 12 PM' },
  { key: 'afternoon', label: 'Afternoon', hours: '12 - 5 PM' },
  { key: 'evening', label: 'Evening', hours: '5 PM - close' },
] as const

export const HOURS_OPTIONS = ['Under 10', '10-20', '20-30', '30+']
export const ALSO_WORK = ['Weekends', 'Holidays', 'Early mornings', 'Late nights']
export const TRAVEL_MODES = ['Bus', 'Trolley', 'MTS Access', 'Ride', 'Walk / bike', 'Drive']

export const SEND_CHECKLIST = [
  'Company name is correct everywhere', 'Job title matches the job post', 'My phone number and email are correct',
  'Spell check is done', 'I read it out loud', 'My teacher or job coach checked it',
  'Saved as a PDF named "First Last Cover Letter"',
]

export const asOptions = (list: string[]) => list.map((v) => ({ value: v, label: v }))

// Times every half hour, for "earliest I can start" and "latest I can stay".
export const TIMES = Array.from({ length: 40 }, (_, i) => {
  const mins = 5 * 60 + i * 30
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m === 0 ? '00' : '30'} ${h < 12 ? 'AM' : 'PM'}`
})

// Page 06 rows, with the handout's "Don't have it? How to get it" notes.
export const DOCS: { key: import('./packet').DocKey; label: string; howToGet: string; noExpire?: boolean }[] = [
  { key: 'stateId', label: "California ID card or driver's license", howToGet: 'DMV (dmv.ca.gov). Ask about a reduced-fee ID.' },
  { key: 'ssCard', label: 'Social Security card', howToGet: 'Social Security office or ssa.gov. Free.', noExpire: true },
  { key: 'birthCert', label: 'Birth certificate', howToGet: 'County Recorder in the county where you were born (fee).', noExpire: true },
  { key: 'passport', label: 'U.S. Passport (optional)', howToGet: 'Post office or travel.state.gov.' },
  { key: 'workPermit', label: 'Green card or work permit (if this applies to you)', howToGet: 'USCIS (uscis.gov). Ask your case manager.' },
  { key: 'diploma', label: 'Diploma or certificate of completion', howToGet: 'Ask your TRACE teacher or your high school office.', noExpire: true },
  { key: 'foodHandler', label: 'Food Handler Card (for food jobs)', howToGet: 'Short online class and test. California requires it within 30 days of starting a food job.' },
  { key: 'otherCerts', label: 'Other certificates (CPR, etc.)', howToGet: '' },
  { key: 'bank', label: 'Bank or credit union account', howToGet: 'For direct deposit. Ask the bank for a direct deposit form. Ask about free accounts.', noExpire: true },
  { key: 'busPass', label: 'Bus or trolley pass', howToGet: 'MTS Transit Store or sdmts.com. Ask about Reduced Fare for riders with disabilities.' },
]

export const FIRST_DAY = [
  '3 printed copies of my resume', 'My References page', 'My Application Info Sheet',
  'My I-9 documents (Option A or B above)', 'My direct deposit form', 'A pen',
]

// Page 07
export const REASONS_TELL = [
  'I need an accommodation to do the job', 'I want my job coach to come to the interview or job',
  'I want my supervisor to understand how I work best',
]
export const REASONS_WAIT = [
  "I don't need any changes to do this job", 'I want to get to know the employer first',
  'I feel more comfortable keeping it private',
]
export const WHEN_TELL = [
  { value: 'application', label: 'On the application', note: 'The optional "disability self-identification" question. Choosing "I don\'t want to answer" is OK.' },
  { value: 'beforeInterview', label: 'Before the interview', note: 'If I need an interview accommodation, like questions in writing or my job coach with me.' },
  { value: 'afterOffer', label: 'After a job offer', note: 'Many people wait until they are offered the job, then ask for what they need.' },
  { value: 'afterStart', label: 'After I start working', note: 'If something becomes hard on the job, I can ask for an accommodation then.' },
  { value: 'never', label: 'Not at all', note: 'That is my right too.' },
]
export const ACCOMMODATION_IDEAS = [
  'Written or picture instructions', 'A task checklist', 'Showing me how first', 'Extra training time', 'A job coach',
  'A quiet work area', 'Headphones', 'Short regular breaks', 'The same schedule each week', 'Reminders on my phone',
  'One supervisor to ask',
]

export const SAY_EXAMPLE = '"I\'m a hard worker who likes to get things right. I work best when I have a checklist for my tasks. ' +
  'It helps me if someone shows me a new task first, then I can do it on my own."'

// Page 09 rows.
export const TEAM_ROLES: { key: import('./packet').TeamKey; label: string; note?: string }[] = [
  { key: 'teacher', label: 'TRACE teacher' },
  { key: 'caseManager', label: 'TRACE case manager' },
  { key: 'jobCoach', label: 'Job coach / job developer' },
  { key: 'dor', label: 'Department of Rehabilitation (DOR) counselor', note: 'Job training, job coaching, work supplies' },
  { key: 'regionalCenter', label: 'San Diego Regional Center service coordinator' },
  { key: 'benefits', label: 'Benefits counselor', note: 'SSI, Medi-Cal, and work' },
  { key: 'conservator', label: 'Conservator or decision-making supporter' },
  { key: 'family', label: 'Parent / guardian / family contact' },
  { key: 'supervisor', label: 'Current supervisor at work' },
  { key: 'other', label: 'Other' },
]

export const WHO_TO_CALL = [
  { key: 'callApplication', label: 'I have a question about a job application' },
  { key: 'callProblem', label: 'I have a problem at work' },
  { key: 'callBenefits', label: 'I get a letter about my benefits' },
  { key: 'callTransport', label: 'I need help getting to work' },
  { key: 'callOffer', label: 'I get a job offer' },
] as const

// Page 10
export const BENEFITS_INTRO = 'You can work and still get help. Most people who get benefits are better off working. ' +
  'The key is to report your pay and get advice from a benefits counselor before you start a job.'
export const BENEFITS = [
  'SSI (Supplemental Security Income)', "SSDI / benefits from a parent's work record", 'Medi-Cal',
  'CalFresh (food benefits)', 'IHSS (In-Home Supportive Services)', 'Regional Center services', 'Housing help',
]
export const BENEFITS_NOT_SURE = "I'm not sure. I'll ask my family or case manager."

export const GOOD_TO_KNOW = [
  { title: "SSI doesn't stop when you start working.", text: "Social Security doesn't count all of your pay. Your SSI check usually goes down a little as you earn more, but your total money goes up." },
  { title: 'Students under 22 get extra help.', text: 'If you are under 22 and in school, the Student Earned Income Exclusion may let you keep more of your SSI. Ask if TRACE counts for you.' },
  { title: 'Medi-Cal can continue.', text: 'Many people keep Medi-Cal even when they earn enough that their SSI check stops.' },
  { title: 'SSDI has different rules.', text: 'If you get SSDI or benefits from a parent\'s record, the work rules are different. Ask a counselor.' },
]

export const REPORT_WAYS = ['SSA wage reporting app', 'Phone', 'Online (my Social Security)', 'Office']

export const FREE_HELP = [
  { name: 'Disability Benefits 101', detail: 'ca.db101.org (work and benefits calculators)' },
  { name: 'Ticket to Work Help Line', detail: '1-866-968-7842 (find a free benefits counselor)' },
  { name: 'My DOR counselor', detail: '' },
  { name: 'CalABLE', detail: "calable.ca.gov (a savings account that doesn't count against SSI, up to a limit)" },
]

// Page 11
export const INTRO_PARTS = [
  { key: 'introName', label: 'Hi, my name is...' },
  { key: 'introNow', label: 'Right now I am...', hint: 'School, program, or job' },
  { key: 'introExperience', label: 'I have experience...' },
  { key: 'introGoodAt', label: 'I am good at...' },
  { key: 'introWhy', label: 'I want this job because...' },
] as const

export const INTRO_EXAMPLE = '"Hi, my name is Jordan. Right now I\'m in the TRACE program, where I\'m building my job skills. ' +
  'I have experience stocking shelves and helping customers at CVS. I\'m good at keeping things organized, and I\'m always ' +
  'on time. I want this job because I like helping customers and working on a team."'

export const EMPLOYER_QUESTIONS = [
  'What does a normal day look like in this job?', 'Who would I be working with?', 'How will I be trained?',
  'What do you like about working here?', 'What hours or shifts are open?', 'When will you decide who gets the job?',
]

export const PRACTICE_QUESTIONS: { key: import('./packet').InterviewKey; label: string; note?: string }[] = [
  { key: 'whyHere', label: 'Why do you want to work here?' },
  { key: 'strengths', label: 'What are your strengths?' },
  { key: 'improving', label: "What is something you're working to get better at?", note: "Name it, then say what you're doing about it." },
  { key: 'teamwork', label: 'Tell me about a time you helped someone or worked on a team.', note: 'What happened? What did I do? How did it end?' },
  { key: 'dontKnow', label: "What would you do if you didn't know how to do a task?", note: 'Good answer: "I would ask my supervisor to show me."' },
  { key: 'upsetCustomer', label: 'What would you do if a customer was upset?', note: 'Good answer: "I would stay calm, listen, and get a manager if I needed help."' },
  { key: 'whyHire', label: 'Why should we hire you?' },
  { key: 'whenWork', label: 'When can you work?', note: 'See my Weekly Availability page.' },
]

export const QUIZ_TIPS = [
  'Read each statement slowly. Look for words like not, never, or always.',
  'Some statements are "flipped," like "I often run late." A good worker would disagree.',
  'Try not to pick the middle answer every time. Show what you really believe.',
  'Take your time. If you need help reading or more time, ask about an accommodation.',
]

export const QUIZ_CHOICES = [
  { value: 'sa' as const, label: 'Strongly agree' },
  { value: 'a' as const, label: 'Agree' },
  { value: 'd' as const, label: 'Disagree' },
  { value: 'sd' as const, label: 'Strongly disagree' },
]

// `agree` is what the answer key on the handout says a good worker would pick.
export const QUIZ = [
  { text: 'I like helping people.', agree: true },
  { text: "It's OK to take a longer break if no one notices.", agree: false },
  { text: "I finish my work even when it's boring.", agree: true },
  { text: 'Rules are sometimes meant to be broken.', agree: false },
  { text: 'I stay calm when someone is upset with me.', agree: true },
  { text: 'I often show up late.', agree: false },
  { text: 'I like to keep my work area clean.', agree: true },
  { text: 'If I make a mistake, I tell my supervisor.', agree: true },
]

export const QUIZ_KEY = 'Agree or strongly agree with 1, 3, 5, 7, 8. Disagree or strongly disagree with 2, 4, 6.'

export const INTERVIEW_DAY = [
  { title: 'The day before', items: ["Confirm the time, address, and interviewer's name", 'Plan my route (see Transportation Plan)', 'Pick out and check my clothes', 'Practice my introduction out loud', 'Charge my phone and set an alarm'] },
  { title: 'What to wear', items: ['Clean, neat clothes with no holes or stains', 'Plain shirt with no big logos or words', 'Pants or skirt, not shorts or sweats', 'Clean, closed-toe shoes', 'Showered, hair neat, no strong perfume'] },
  { title: 'What to bring', items: ['2 copies of my resume', 'My References page', 'My Application Info Sheet', 'My photo ID', 'A pen'] },
  { title: 'During the interview', items: ['Arrive 10 to 15 minutes early', 'Phone on silent and put away', 'Smile, say hello, and say my name', "Look at the interviewer's face when I talk", 'Ask my 2 questions at the end', 'Say "Thank you for meeting with me"'] },
]

export const INTERVIEW_ACCOMMODATION = 'Need an interview accommodation? You can ask before the interview. Examples: having your job coach with you, getting the questions in writing, or a quiet room.'

// Page 12
export const HOW_APPLIED = ['Online', 'In person', 'Email', 'Job coach helped', 'Indeed', 'Company website']
export const JOB_RESULTS = [
  { value: 'interview' as const, label: 'Interview' },
  { value: 'offer' as const, label: 'Offer' },
  { value: 'no' as const, label: 'No' },
  { value: 'waiting' as const, label: 'Waiting' },
]
