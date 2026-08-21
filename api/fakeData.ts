import { faker } from '@faker-js/faker'
import { TUserRole } from './types'
import type {
  TRecruiterSearch,
  TCrewSimple,
  TCrew,
  TCrewReference,
  TCrewExperience,
  TOffer,
  TNotification,
  TRecruiterUser,
  TCrewUser,
  TAuthResponse,
} from './types'

/**
 * Fully client-side fake data used to record app demos without touching the real backend.
 * Off by default so it can never ship active by accident — run with
 * `EXPO_PUBLIC_USE_FAKE_DATA=true npx expo start` to turn it on for a recording session.
 */
export const USE_FAKE_DATA = process.env.EXPO_PUBLIC_USE_FAKE_DATA === 'true'

faker.seed(20260720)

// randomuser.me's portrait sets are real (consenting, licensed-for-placeholder-use) headshots
// split by gender, unlike pravatar's ungendered numbered list — much less jarring when the
// photo doesn't match the fake person's name.
export const avatarUrl = (seed: number, gender: 'M' | 'F' = 'M') =>
  `https://randomuser.me/api/portraits/${gender === 'F' ? 'women' : 'men'}/${seed % 100}.jpg`

const simulateNetwork = <T>(value: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

// ── Shared vocabularies ──────────────────────────────────────

const POSITIONS = [
  'Captain',
  'Chief Officer',
  'Second Officer',
  'Bosun',
  'Lead Deckhand',
  'Deckhand',
  'Chief Engineer',
  'Second Engineer',
  'Chief Stewardess',
  'Stewardess',
  'Chef',
  'Sous Chef',
  'Purser',
  'Deck/Engineer',
]

const YACHT_NAMES = [
  'Aurora',
  'Blue Horizon',
  'Serenity',
  'Wind Dancer',
  'Ocean Pearl',
  'Northern Star',
  'Silver Wake',
  'Emerald Isle',
  'Amaranta',
  'Solara',
  'Kalliste',
  'Azzurra',
  'Perle Noire',
  'Windrose',
  'Calypso',
  'Meridian',
  'Sea Owl',
  'Bellissima',
  'Freedom II',
  'Halcyon',
]

const YACHT_PREFIXES = ['M/Y', 'S/Y', 'M/S']

const LOCATIONS = [
  'Monaco',
  'Palma de Mallorca',
  'Antibes',
  'Fort Lauderdale',
  'Genoa',
  'Naples',
  'Viareggio',
  'Barcelona',
  'Cannes',
  'Olbia, Sardinia',
  'Split',
  'Athens',
]
// Same order as LOCATIONS — a few of these have real Italian exonyms, worth getting right.
const LOCATIONS_IT = [
  'Monaco',
  'Palma di Maiorca',
  'Antibes',
  'Fort Lauderdale',
  'Genova',
  'Napoli',
  'Viareggio',
  'Barcellona',
  'Cannes',
  'Olbia, Sardegna',
  'Spalato',
  'Atene',
]

const BOARDING_OPTIONS = ['Immediate', 'Within 2 weeks', 'Within 1 month', 'Flexible', 'ASAP']
// Same order as BOARDING_OPTIONS.
const BOARDING_OPTIONS_IT = ['Immediata', 'Entro 2 settimane', 'Entro 1 mese', 'Flessibile', 'Appena possibile']
const DURATION_OPTIONS = ['Permanent', 'Seasonal (May–Sept)', 'Rotational 3/3', '6 months', '12 months', 'Daywork']
// Same order as DURATION_OPTIONS.
const DURATION_OPTIONS_IT = ['Permanente', 'Stagionale (Mag–Set)', 'Rotazione 3/3', '6 mesi', '12 mesi', 'Giornaliero']
const CONTRACT_TYPES = ['MLC 2006', 'Permanent contract', 'Seasonal contract', 'Freelance', 'Daily rate']
// Same order as CONTRACT_TYPES.
const CONTRACT_TYPES_IT = [
  'MLC 2006',
  'Contratto a tempo indeterminato',
  'Contratto stagionale',
  'Freelance',
  'Tariffa giornaliera',
]
const NATIONALITIES = [
  'Italian',
  'British',
  'French',
  'Spanish',
  'South African',
  'Filipino',
  'Croatian',
  'Australian',
  'New Zealander',
  'American',
  'Ukrainian',
  'Polish',
]
// Same order as NATIONALITIES.
const NATIONALITIES_IT = [
  'Italiana',
  'Britannica',
  'Francese',
  'Spagnola',
  'Sudafricana',
  'Filippina',
  'Croata',
  'Australiana',
  'Neozelandese',
  'Americana',
  'Ucraina',
  'Polacca',
]
const LANGUAGES = [
  'English (Fluent)',
  'Italian (Native)',
  'French (Intermediate)',
  'Spanish (Basic)',
  'Croatian (Native)',
  'German (Basic)',
]
// Same order as LANGUAGES.
const LANGUAGES_IT = [
  'Inglese (Fluente)',
  'Italiano (Madrelingua)',
  'Francese (Intermedio)',
  'Spagnolo (Base)',
  'Croato (Madrelingua)',
  'Tedesco (Base)',
]
const EDUCATION_LEVELS = [
  'High School Diploma',
  "Bachelor's Degree",
  'Maritime Academy Diploma',
  'Vocational Certificate',
]
// Same order as EDUCATION_LEVELS.
const EDUCATION_LEVELS_IT = [
  'Diploma di scuola superiore',
  'Laurea',
  'Diploma di accademia navale',
  'Attestato professionale',
]
const COURSES_POOL = [
  'STCW Basic Safety Training',
  'ENG1 Medical Certificate',
  'Powerboat Level 2',
  'PADI Divemaster',
  'Silver Service',
  'Wine & Beverage Service',
  'Advanced Fire Fighting',
  'Security Awareness (STCW VI/6)',
  'RYA Yachtmaster Theory',
  'HELM Operational',
]
const CERT_CODES = ['ITA-DK-2201', 'ITA-EN-1187', 'MCA-DK-3390', 'RYA-DK-0456', 'STCW-DK-7712', 'STCW-EN-8834']

const rand = (min: number, max: number) => faker.number.int({ min, max })
// Round to the nearest 100 — real salary figures aren't 4511, they're 4500.
const roundSalary = (value: number) => Math.round(value / 100) * 100
const pick = <T>(arr: T[]) => faker.helpers.arrayElement(arr)
const pickSome = <T>(arr: T[], min: number, max: number) => faker.helpers.arrayElements(arr, { min, max })
const maybe = (probability: number) => faker.number.float({ min: 0, max: 1 }) < probability
const ddmmyyyy = (date: Date) =>
  `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`

// The real backend sends these short enum-like status words already translated based on
// the request's `language` (unlike `offer`/`offerEng`, there's no separate field for it) —
// mirror that here with a plain substitution table instead of parallel data pools.
const IT_TERMS: Record<string, string> = {
  Single: 'Celibe/Nubile',
  Married: 'Sposato/a',
  Engaged: 'Fidanzato/a',
  Yes: 'Sì',
  No: 'No',
  Available: 'Disponibile',
  Immediate: 'Immediata',
  Permanent: 'Permanente',
}
const localizeTerm = (value: string, language?: string): string =>
  (language === 'it' ? IT_TERMS[value] : undefined) ?? value

const localizedLocation = (location: string, language?: string): string => {
  const index = LOCATIONS.indexOf(location)
  return language === 'it' && index !== -1 ? LOCATIONS_IT[index] : location
}
const localizedContractType = (contractType: string, language?: string): string => {
  const index = CONTRACT_TYPES.indexOf(contractType)
  return language === 'it' && index !== -1 ? CONTRACT_TYPES_IT[index] : contractType
}
const localizedBoardingOption = (boarding: string, language?: string): string => {
  const index = BOARDING_OPTIONS.indexOf(boarding)
  return language === 'it' && index !== -1 ? BOARDING_OPTIONS_IT[index] : boarding
}
const localizedDurationOption = (duration: string, language?: string): string => {
  const index = DURATION_OPTIONS.indexOf(duration)
  return language === 'it' && index !== -1 ? DURATION_OPTIONS_IT[index] : duration
}
const localizedFromPool = (value: string, enPool: string[], itPool: string[], language?: string): string => {
  const index = enPool.indexOf(value)
  return language === 'it' && index !== -1 ? itPool[index] : value
}

// Shared sentence templates for a yacht crew position listing — used by both the
// recruiter's own searches and the crew-facing job offers, since they describe the same
// kind of thing. Only the surrounding sentence is translated; position titles, yacht
// names and certification codes stay in English, matching real yachting-industry usage.
type ListingSeed = {
  mainPosition: string
  yacht: string
  location: string
  years: number
  meters: number
  contractType: string
  hasSeamensBook: boolean
  hasEspCharter: boolean
}

const buildListingText = (seed: ListingSeed, language?: string) => {
  const { mainPosition, yacht, years, meters, hasSeamensBook, hasEspCharter } = seed
  const location = localizedLocation(seed.location, language)
  const contractType = localizedContractType(seed.contractType, language)
  if (language === 'it') {
    return {
      offer: `Cercasi ${mainPosition} per ${yacht}, con base a ${location}`,
      requirements: `Minimo ${years} anni di esperienza come ${mainPosition}. Certificazione STCW richiesta.`,
      descriptionOffer: `Cerchiamo un/a ${mainPosition.toLowerCase()} esperto/a e motivato/a per unirsi all'equipaggio di ${yacht}. Richiesta serietà e flessibilità.`,
      ownerDescription: `Yacht a motore di proprietà privata, ${meters}m.`,
      contractType,
      seamensBook: hasSeamensBook ? 'Libretto di navigazione richiesto' : '',
      espCharter: hasEspCharter ? 'Esperienza charter preferita' : '',
    }
  }
  return {
    offer: `${mainPosition} wanted for ${yacht}, based in ${location}`,
    requirements: `Minimum ${years} years of experience as ${mainPosition}. STCW certification required.`,
    descriptionOffer: `We are looking for an experienced and motivated ${mainPosition.toLowerCase()} to join the crew of ${yacht}. Professional attitude and flexibility required.`,
    ownerDescription: `Privately owned ${meters}m motor yacht.`,
    contractType,
    seamensBook: hasSeamensBook ? 'Seamans Book required' : '',
    espCharter: hasEspCharter ? 'Charter experience preferred' : '',
  }
}

// ── Crew people pool ─────────────────────────────────────────

type FakePerson = {
  id: number
  firstName: string
  lastName: string
  gender: 'M' | 'F'
  position: string
  city: string
  nationality: string
  birthYear: number
  hasSeamansBook: boolean
  certs: string[]
  courses: string[]
}

const CREW_POOL_SIZE = 160

const crewPool: FakePerson[] = Array.from({ length: CREW_POOL_SIZE }, (_, i) => {
  const gender: 'M' | 'F' = maybe(0.5) ? 'M' : 'F'
  return {
    id: 500000 + i,
    firstName: faker.person.firstName(gender === 'M' ? 'male' : 'female'),
    lastName: faker.person.lastName(),
    gender,
    position: pick(POSITIONS),
    city: faker.location.city(),
    nationality: pick(NATIONALITIES),
    birthYear: rand(1975, 2004),
    hasSeamansBook: maybe(0.65),
    certs: pickSome(CERT_CODES, 0, 3),
    courses: pickSome(COURSES_POOL, 0, 4),
  }
})

const buildExperiences = (person: FakePerson): TCrewExperience[] => {
  const count = rand(1, 4)
  return Array.from({ length: count }, (_, i) => {
    const to = faker.date.past({ years: i + 1 })
    const from = faker.date.past({ years: 1, refDate: to })
    return {
      idesperienza: person.id * 10 + i,
      fromDate: ddmmyyyy(from),
      toDate: ddmmyyyy(to),
      experiencedate: `${ddmmyyyy(from)} – ${ddmmyyyy(to)}`,
      boatcompany: `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`,
      employer: faker.company.name(),
      typeofemployment: person.position,
      typeofassignment: `Responsible for ${faker.hacker.phrase().toLowerCase()} while stationed in ${pick(LOCATIONS)}.`,
      idreference: String(person.id * 10 + i),
    }
  })
}

const buildReferences = (person: FakePerson): TCrewReference[] => {
  const count = rand(0, 3)
  return Array.from({ length: count }, (_, i) => ({
    idReference: person.id * 10 + i,
    positionreferent: pick(['Captain', 'Chief Officer', 'Chief Stewardess', 'Owner Representative', 'Purser']),
    company_name: faker.company.name(),
    yacht: `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`,
    yearreference: String(rand(2018, 2025)),
    telephone: faker.phone.number(),
    email: faker.internet.email({ firstName: 'reference', lastName: String(i) }).toLowerCase(),
    notes: `Excellent teamwork and reliability during the ${pick(DURATION_OPTIONS).toLowerCase()} season.`,
  }))
}

const buildFullCrew = (person: FakePerson): TCrew => {
  const { certs, courses } = person
  const photoCount = maybe(0.6) ? rand(1, 3) : 0
  const references = buildReferences(person)
  return {
    offersRecieved: rand(0, 12),
    certificateOfCompetence: certs.length > 0,
    contacted: false,
    iduser: person.id,
    published: 'True',
    photoapproved: 'True',
    pushNotificationToken: '',
    userName: `${person.firstName.toLowerCase()}.${person.lastName.toLowerCase()}`,
    name: person.firstName,
    surname: person.lastName,
    yearofBirth: String(person.birthYear),
    gender: person.gender,
    maritalStatus: pick(['Single', 'Married', 'Engaged']),
    nationality: person.nationality,
    company: '',
    address: faker.location.streetAddress(),
    city: person.city,
    province: faker.location.state(),
    zip_code: faker.location.zipCode(),
    emailCc: '',
    email: faker.internet.email({ firstName: person.firstName, lastName: person.lastName }).toLowerCase(),
    url: '',
    telephone: faker.phone.number(),
    cellular: faker.phone.number(),
    callWhatsapp: `https://wa.me/${faker.string.numeric(11)}`,
    userPhoto: avatarUrl(person.id, person.gender),
    smoker: maybe(0.2) ? 'Yes' : 'No',
    currentPosition: person.position,
    lat: '',
    lng: '',
    mainPosition: person.position,
    qualificationCode: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
    licenseCode: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
    seamansBook: person.hasSeamansBook ? 'Seamans Book' : '',
    registration_Number: faker.string.numeric(6),
    registration_City: person.city,
    registration_Category: pick(['Deck', 'Engine', 'Interior', 'Galley']),
    registration_Year: String(rand(2010, 2023)),
    navigationBook: maybe(0.5) ? 'Yes' : 'No',
    calculatedExperience: `${rand(1, 15)} years`,
    availability: 'Available',
    dateAvailability: ddmmyyyy(faker.date.soon({ days: 60 })),
    lastAccessDate: ddmmyyyy(faker.date.recent({ days: 14 })),
    registraton_date: ddmmyyyy(faker.date.past({ years: 3 })),
    courses: courses.join(', '),
    notesCourses: '',
    specseling: maybe(0.4) ? pick(['Diving Instructor', 'Watersports', 'Fishing Charter', 'Sommelier']) : '',
    referencesNumber: references.length,
    approvedReferences: references,
    experiences: buildExperiences(person),
    curriculum: `Dedicated ${person.position.toLowerCase()} with ${rand(1, 15)} years of experience across the Mediterranean and beyond, known for a strong work ethic and attention to detail.`,
    professionalSkills: 'Strong problem-solving skills and calm under pressure during demanding charters.',
    relationalSkills: 'Excellent communicator, comfortable working within a tight-knit international crew.',
    organizationalSkills: 'Meticulous with checklists, provisioning and watch scheduling.',
    technicalSkills: 'Proficient with onboard systems, navigation electronics and safety equipment.',
    couplewith: '',
    card1Couple: '',
    salary: String(rand(2200, 8500)),
    date_lastchange: ddmmyyyy(faker.date.recent({ days: 30 })),
    educationalLevel: pick(EDUCATION_LEVELS),
    language1: LANGUAGES[0],
    language2: pick(LANGUAGES.slice(1)),
    language3: maybe(0.5) ? pick(LANGUAGES) : '',
    language4: maybe(0.2) ? pick(LANGUAGES) : '',
    pos_deck: maybe(0.3) ? 'Deckhand' : '',
    pos_engine: maybe(0.2) ? 'Engineer' : '',
    pos_hotel: maybe(0.3) ? 'Stewardess' : '',
    pos_harbour: maybe(0.15) ? 'Dockmaster' : '',
    pos_special: maybe(0.15) ? 'Watersports Instructor' : '',
    ita_yachts_deck: certs.includes('ITA-DK-2201') ? 'ITA-DK-2201' : '',
    ita_yachts_engine: certs.includes('ITA-EN-1187') ? 'ITA-EN-1187' : '',
    mca_yachts_deck: certs.includes('MCA-DK-3390') ? 'MCA-DK-3390' : '',
    mca_deck_rya: certs.includes('RYA-DK-0456') ? 'RYA-DK-0456' : '',
    stcw_navy_deck: certs.includes('STCW-DK-7712') ? 'STCW-DK-7712' : '',
    stcw_navy_engine: certs.includes('STCW-EN-8834') ? 'STCW-EN-8834' : '',
    numberClick: rand(0, 300),
    passport: person.nationality.slice(0, 3).toUpperCase(),
    secondaryTasks: '',
    // Offsets aren't multiples of 100 (unlike +1000/+2000/+3000 would be) so these actually
    // land on different portrait indices instead of all repeating the same photo.
    namephotoA: photoCount > 0 ? avatarUrl(person.id + 37, person.gender) : '',
    namephotoB: photoCount > 1 ? avatarUrl(person.id + 71, person.gender) : '',
    namephotoC: photoCount > 2 ? avatarUrl(person.id + 53, person.gender) : '',
  }
}

const toCrewSimple = (
  crew: TCrew,
  person: FakePerson,
  extra: { crewlistId: number; offerId: number; contacted: boolean }
): TCrewSimple => ({
  contacted: extra.contacted,
  published: maybe(0.85),
  userId: crew.iduser,
  autoCandidate: maybe(0.4),
  selected: false,
  rejected: false,
  insertDate: ddmmyyyy(faker.date.recent({ days: 21 })),
  firstName: crew.name,
  lastName: crew.surname,
  company: crew.company,
  address: crew.address,
  city: crew.city,
  provincia: crew.province,
  postalCode: crew.zip_code,
  email: crew.email,
  url: crew.url,
  country: person.nationality,
  passport: crew.passport,
  phone: crew.telephone,
  mobile: crew.cellular,
  callWhatsapp: crew.callWhatsapp,
  talkApp: '',
  userPhoto: crew.userPhoto,
  photoApproved: true,
  birthYear: crew.yearofBirth,
  maritalStatus: crew.maritalStatus,
  smoker: crew.smoker,
  gender: crew.gender,
  qualificationCode: crew.qualificationCode,
  licenseCode: crew.licenseCode,
  seamansBook: crew.seamansBook,
  registration_Number: crew.registration_Number,
  registration_City: crew.registration_City,
  registration_Category: crew.registration_Category,
  registration_Year: crew.registration_Year,
  courses: crew.courses,
  mainPosition: crew.mainPosition,
  specseling: crew.specseling,
  pos_deck: crew.pos_deck,
  pos_engine: crew.pos_engine,
  pos_hotel: crew.pos_hotel,
  pos_harbour: crew.pos_harbour,
  pos_special: crew.pos_special,
  ita_yachts_deck: crew.ita_yachts_deck,
  ita_yachts_engine: crew.ita_yachts_engine,
  mca_yachts_deck: crew.mca_yachts_deck,
  mca_yachts_engine: '',
  mca_deck_rya: crew.mca_deck_rya,
  stcw_navy_deck: crew.stcw_navy_deck,
  stcw_navy_engine: crew.stcw_navy_engine,
  navigationBook: crew.navigationBook,
  availability: crew.availability,
  dateAvailability: crew.dateAvailability,
  lastAccessDate: crew.lastAccessDate,
  coupleWith: crew.couplewith,
  coupleProfile: crew.card1Couple,
  salary: crew.salary,
  documentStatus: maybe(0.7) ? 'Complete' : 'Pending',
  calculatedExperience: crew.calculatedExperience,
  stars: rand(0, 5),
  notes: '',
  crewlistId: extra.crewlistId,
  offerId: extra.offerId,
  sent: extra.contacted,
  comment: '',
})

// ── Searches (recruiter job postings) + their candidates ────

const SEARCH_COUNT = 3
let nextCrewlistId = 1

const crewProfiles = new Map<number, TCrew>()
const crewListByOffer = new Map<number, TCrewSimple[]>()
const searches: TRecruiterSearch[] = []
const searchSeeds = new Map<number, ListingSeed & { boarding: string; duration: string }>()

for (let i = 0; i < SEARCH_COUNT; i++) {
  const idoffer = 900000 + i
  const mainPosition = pick(POSITIONS)
  const yacht = `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`
  const location = pick(LOCATIONS)
  const salaryFrom = roundSalary(rand(2500, 5000))
  const salaryTo = roundSalary(salaryFrom + rand(300, 2000))
  const reference = `MY26_${1000 + i}`
  const seed = {
    mainPosition,
    yacht,
    location,
    years: rand(2, 8),
    meters: rand(30, 70),
    contractType: pick(CONTRACT_TYPES),
    hasSeamensBook: maybe(0.6),
    hasEspCharter: maybe(0.4),
    boarding: pick(BOARDING_OPTIONS),
    duration: pick(DURATION_OPTIONS),
  }
  searchSeeds.set(idoffer, seed)
  const text = buildListingText(seed)

  const candidateCount = rand(8, 22)
  const candidates = faker.helpers.arrayElements(crewPool, candidateCount)
  const listEntries: TCrewSimple[] = []
  let contactedCount = 0

  for (const person of candidates) {
    if (!crewProfiles.has(person.id)) {
      crewProfiles.set(person.id, buildFullCrew(person))
    }
    const contacted = maybe(0.3)
    if (contacted) contactedCount++
    listEntries.push(
      toCrewSimple(crewProfiles.get(person.id)!, person, {
        crewlistId: nextCrewlistId++,
        offerId: idoffer,
        contacted,
      })
    )
  }
  crewListByOffer.set(idoffer, listEntries)

  searches.push({
    idoffer,
    name: '',
    surname: '',
    username: '',
    email: '',
    iduser: 0,
    pushNotificationToken: '',
    contractDescription: text.contractType,
    unit: 1,
    gender: pick(['Indifferent', 'M', 'F']),
    seamensBook: text.seamensBook,
    nauticaLicense: '',
    espCharter: text.espCharter,
    requirements: text.requirements,
    title: `${mainPosition} – ${yacht}`,
    offer: text.offer,
    offerdate: ddmmyyyy(faker.date.recent({ days: 45 })),
    offertExpirationdate: ddmmyyyy(faker.date.soon({ days: 60 })),
    descriptionOffer: text.descriptionOffer,
    reference,
    countCandidates: listEntries.length,
    countContacted: contactedCount,
    countResidual: Math.max(0, 30 - listEntries.length),
    ownerDescription: text.ownerDescription,
    mainPosition,
    jobOffer: mainPosition,
    specseling: maybe(0.3) ? pick(['Diving', 'Watersports', 'Fishing']) : '',
    posDeck:
      mainPosition.includes('Deck') || mainPosition === 'Captain' || mainPosition === 'Bosun' ? mainPosition : '',
    posEngine: mainPosition.includes('Engineer') ? mainPosition : '',
    posHotel:
      mainPosition.includes('Stewardess') || mainPosition === 'Chef' || mainPosition === 'Purser' ? mainPosition : '',
    posHarbour: '',
    positionSpecial: '',
    courses: pickSome(COURSES_POOL, 0, 3).join(', '),
    boarding: seed.boarding,
    duration: seed.duration,
    positionArm: location,
    itaYachtsDeck: '',
    itaYachtsEngine: '',
    mcaYachtsDeck: '',
    mcaDeckRya: '',
    stcwNavyDeck: '',
    stcwNavyEngine: '',
    salary_From: String(salaryFrom),
    salary_To: String(salaryTo),
    latArm: 0,
    lngArm: 0,
    listurl: `search/${reference}`,
    listgeourl: `search-location/${location.toLowerCase().replace(/\s+/g, '-')}`,
    offerApplicable: true,
    alreadyApplied: false,
    paid: true,
    credit: true,
    // 0 = published (SearchListItem.tsx treats this field as truthy-means-*not*-published) —
    // always published for demo recordings.
    offerPublished: 0,
  })
}

// Overlays language-specific text onto a live search — the object identity (and its
// mutable state like countContacted, updated by fakeContactCrew) is always preserved.
const localizeSearch = (search: TRecruiterSearch, language?: string): TRecruiterSearch => {
  const seed = searchSeeds.get(search.idoffer)
  if (!seed) return search
  const text = buildListingText(seed, language)
  return {
    ...search,
    offer: text.offer,
    requirements: text.requirements,
    descriptionOffer: text.descriptionOffer,
    ownerDescription: text.ownerDescription,
    contractDescription: text.contractType,
    seamensBook: text.seamensBook,
    espCharter: text.espCharter,
    boarding: localizedBoardingOption(seed.boarding, language),
    duration: localizedDurationOption(seed.duration, language),
    positionArm: localizedLocation(seed.location, language),
  }
}

// ── Job offers (crew / pro side) ─────────────────────────────

const OFFER_COUNT = 24

const offerSeeds = new Map<number, ListingSeed>()

const offers: TOffer[] = Array.from({ length: OFFER_COUNT }, (_, i) => {
  const idoffer = 800000 + i
  const mainPosition = pick(POSITIONS)
  const yacht = `${pick(YACHT_PREFIXES)} ${pick(YACHT_NAMES)}`
  const location = pick(LOCATIONS)
  const salaryFrom = roundSalary(rand(2200, 4800))
  const salaryTo = roundSalary(salaryFrom + rand(300, 1800))
  const reference = `JOB26_${2000 + i}`
  const offerApplicable = maybe(0.55)
  const alreadyApplied = offerApplicable ? maybe(0.3) : false
  const seed: ListingSeed = {
    mainPosition,
    yacht,
    location,
    years: rand(1, 6),
    meters: rand(25, 65),
    contractType: pick(CONTRACT_TYPES),
    hasSeamensBook: maybe(0.6),
    hasEspCharter: maybe(0.4),
  }
  offerSeeds.set(idoffer, seed)
  const textIt = buildListingText(seed, 'it')
  const textEn = buildListingText(seed, 'en')

  return {
    idoffer,
    iduser: 0,
    pushNotificationToken: '',
    contractDescription: textEn.contractType,
    unit: 1,
    gender: pick(['Indifferent', 'M', 'F']),
    seamensBookCode: seed.hasSeamensBook ? 1 : 0,
    seamensBook: textEn.seamensBook,
    nauticaLicense: '',
    espCharter: textEn.espCharter,
    requirements: textEn.requirements,
    title: `${mainPosition} – ${yacht}`,
    // The real backend sends these as two genuinely different-language strings (not a
    // translation of each other via `language`) — keep the fake data honest about that.
    offer: textIt.offer,
    offerEng: textEn.offer,
    offerdate: ddmmyyyy(faker.date.recent({ days: 30 })),
    offertExpirationdate: ddmmyyyy(faker.date.soon({ days: 45 })),
    descriptionOffer: textEn.descriptionOffer,
    reference,
    ownerDescription: textEn.ownerDescription,
    mainPosition,
    jobOffer: mainPosition,
    specseling: maybe(0.3) ? pick(['Diving', 'Watersports', 'Fishing']) : '',
    posDeck:
      mainPosition.includes('Deck') || mainPosition === 'Captain' || mainPosition === 'Bosun' ? mainPosition : '',
    posEngine: mainPosition.includes('Engineer') ? mainPosition : '',
    posHotel:
      mainPosition.includes('Stewardess') || mainPosition === 'Chef' || mainPosition === 'Purser' ? mainPosition : '',
    posHarbour: '',
    positionSpecial: '',
    courses: pickSome(COURSES_POOL, 0, 3).join(', '),
    boarding: pick(BOARDING_OPTIONS),
    duration: pick(DURATION_OPTIONS),
    positionArm: location,
    itaYachtsDeck: '',
    itaYachtsEngine: '',
    mcaYachtsDeck: '',
    mcaDeckRya: '',
    stcwNavyDeck: '',
    stcwNavyEngine: '',
    date_start_boarding: maybe(0.35) ? 'Immediate' : ddmmyyyy(faker.date.soon({ days: 45 })),
    date_end_boarding: maybe(0.4) ? 'Permanent' : ddmmyyyy(faker.date.soon({ days: 240 })),
    salary_From: String(salaryFrom),
    salary_To: String(salaryTo),
    latArm: 0,
    lngArm: 0,
    offerApplicable,
    alreadyApplied,
  }
})

// Overlays language-specific text onto a live offer — `offer`/`offerEng` are intentionally
// left untouched (both languages always present regardless of request, per the real
// backend's actual behavior for that one field).
const localizeOffer = (offer: TOffer, language?: string): TOffer => {
  const seed = offerSeeds.get(offer.idoffer)
  if (!seed) return offer
  const text = buildListingText(seed, language)
  return {
    ...offer,
    requirements: text.requirements,
    descriptionOffer: text.descriptionOffer,
    ownerDescription: text.ownerDescription,
    contractDescription: text.contractType,
    seamensBook: text.seamensBook,
    espCharter: text.espCharter,
    positionArm: localizedLocation(seed.location, language),
    boarding: localizedBoardingOption(offer.boarding, language),
    duration: localizedDurationOption(offer.duration, language),
    date_start_boarding: localizeTerm(offer.date_start_boarding, language),
    date_end_boarding: localizeTerm(offer.date_end_boarding, language),
  }
}

// ── Notifications ─────────────────────────────────────────────
// Mirrors the real "Contact\nName\nCity\nemail\nTel: x\nWhatsApp: x" block both
// NotificationsModal (crew) and RecruiterNotificationsModal parse out of `message`.

const buildContactMessage = (name: string, city: string, email: string, phone: string) =>
  `Contact\n${name}\n${city}\n${email}\nTel: ${phone}\nWhatsApp: ${phone}`

const minutesAgo = (n: number) => new Date(Date.now() - n * 60_000).toISOString()

const crewNotifications: TNotification[] = offers
  .filter((o) => o.alreadyApplied)
  .slice(0, 4)
  .map((o, i) => {
    const contactName = faker.person.fullName()
    return {
      category: 'application-accepted',
      title: 'Application accepted',
      message: buildContactMessage(
        contactName,
        pick(LOCATIONS),
        faker.internet.email({ firstName: contactName.split(' ')[0] }).toLowerCase(),
        faker.phone.number()
      ),
      idoffer: o.idoffer,
      iduser: 0,
      id: i + 1,
      isread: i < 2 ? 1 : 0,
      link: '',
      created: [minutesAgo(60 * 24 * 3), minutesAgo(60 * 24), minutesAgo(120), minutesAgo(15)][i],
    }
  })
  .concat({
    category: 'application-accepted',
    title: 'Application accepted',
    message: buildContactMessage(
      faker.person.fullName(),
      pick(LOCATIONS),
      faker.internet.email().toLowerCase(),
      faker.phone.number()
    ),
    idoffer: 0,
    iduser: 0,
    id: 9001,
    isread: 0,
    link: '',
    created: minutesAgo(5),
  })

const recruiterNotifications: TNotification[] = searches
  .flatMap((s) =>
    (crewListByOffer.get(s.idoffer) ?? []).filter((c) => c.contacted).map((crew) => ({ search: s, crew }))
  )
  .slice(0, 4)
  .map(({ search, crew }, i) => ({
    category: 'candidate-contacted',
    title: `Position ${search.mainPosition} for private M/Y ${rand(25, 70)}M Italian Flag [${search.idoffer}_${search.idoffer - 899000}]`,
    message: buildContactMessage(`${crew.firstName} ${crew.lastName}`, crew.city, crew.email, crew.mobile),
    idoffer: search.idoffer,
    iduser: crew.userId,
    id: i + 1,
    isread: i < 2 ? 1 : 0,
    link: '',
    created: [minutesAgo(60 * 24 * 4), minutesAgo(60 * 24 * 2), minutesAgo(180), minutesAgo(20)][i],
  }))
  .concat({
    category: 'candidate-contacted',
    title: 'Position Chief Stewardess for private M/Y 45M Italian Flag [70000_10999]',
    message: buildContactMessage(
      faker.person.fullName(),
      pick(LOCATIONS),
      faker.internet.email().toLowerCase(),
      faker.phone.number()
    ),
    idoffer: 0,
    iduser: rand(1000, 9999),
    id: 9002,
    isread: 0,
    created: minutesAgo(8),
    link: '',
  })

// ── Logged-in user identity (name + contact only — overlaid on whatever profile shape
// is passed in, whether that's real backend data being masked for a recording, or the
// fully-fake profile built below for USE_FAKE_DATA logins) ──

export const maskRecruiterIdentity = (user: TRecruiterUser): TRecruiterUser => ({
  ...user,
  name: 'Jane',
  surname: 'Doe',
  company: 'Doe Yachts',
  address: 'Via del Porto 12',
  email: 'jane.doe@example.com',
  emailCc: '',
  cellular: '+39 345 123 4567',
  telephone: '+39 010 123 4567',
  whatsapp: '+39 345 123 4567',
  callWhatsapp: '+39 345 123 4567',
  url: 'www.doeyachts.example',
})

export const maskCrewIdentity = (user: TCrewUser): TCrewUser => ({
  ...user,
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  emailCc: '',
  cellular: '+39 347 987 6543',
  telephone: '',
  callWhatsapp: '+39 347 987 6543',
})

const fakeRecruiterProfileBase: TRecruiterUser = {
  iduser: 700001,
  name: '',
  surname: '',
  company: '',
  address: '',
  city: 'Genoa',
  province: 'GE',
  zipCode: '16100',
  email: '',
  emailCc: '',
  url: '',
  cellular: '',
  telephone: '',
  whatsapp: '',
  fax: '',
  callWhatsapp: '',
  pushNotificationToken: '',
  lastAccessDate: ddmmyyyy(new Date()),
  registrationDate: ddmmyyyy(faker.date.past({ years: 2 })),
}

// TRecruiterUser has no photo field (matches the real backend, which doesn't send one) —
// exposed separately so the recruiter profile screen can show a real photo during demo
// recordings instead of the initials placeholder it falls back to in production.
export const FAKE_RECRUITER_PHOTO_URL = avatarUrl(700001, 'F')

const fakeCrewProfileBase: TCrewUser = {
  iduser: 700002,
  published: 'True',
  pushNotificationToken: '',
  name: '',
  surname: '',
  yearofBirth: '1992',
  gender: 'M',
  maritalStatus: 'Single',
  nationality: 'Italian',
  city: 'Genoa',
  province: 'GE',
  zip_code: '16100',
  email: '',
  emailCc: '',
  cellular: '',
  telephone: '',
  callWhatsapp: '',
  userPhoto: avatarUrl(700002, 'M'),
  namephotoA: '',
  namephotoB: '',
  namephotoC: '',
  mainPosition: 'Chief Officer',
  specseling: '',
  calculatedExperience: '8 years',
  availability: 'Available',
  dateAvailability: ddmmyyyy(faker.date.soon({ days: 30 })),
  lastAccessDate: ddmmyyyy(new Date()),
  registrationDate: ddmmyyyy(faker.date.past({ years: 2 })),
  registraton_date: ddmmyyyy(faker.date.past({ years: 2 })),
  seamansBook: 'Seamans Book',
  navigationBook: 'Yes',
  courses: 'STCW Basic Safety Training, ENG1 Medical Certificate',
  qualificationCode: 'MRN2026CO',
  licenseCode: 'ITA-CO-2026',
  ita_yachts_deck: '',
  ita_yachts_engine: '',
  mca_yachts_deck: '',
  mca_deck_rya: '',
  stcw_navy_deck: 'STCW-DK-7712',
  stcw_navy_engine: '',
  pos_deck: 'Chief Officer',
  pos_engine: '',
  pos_hotel: '',
  pos_harbour: '',
  pos_special: '',
  educationalLevel: "Bachelor's Degree",
  language1: 'Italian (Native)',
  language2: 'English (Fluent)',
  language3: '',
  language4: '',
  relationalSkills: '',
  organizationalSkills: '',
  technicalSkills: '',
  professionalSkills: '',
  numberClick: 0,
  referencesNumber: 0,
  salary: '4200',
  smoker: 'No',
  couplewith: '',
}

// Full CV shape (richer than the profile above) for the "public preview" screen, which
// shows the logged-in crew user their own profile as recruiters would see it.
const fakeLoggedInCrewCv: TCrew = {
  ...buildFullCrew({
    id: 700002,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'M',
    position: 'Chief Officer',
    city: 'Genoa',
    nationality: 'Italian',
    birthYear: 1992,
    hasSeamansBook: true,
    certs: ['STCW-DK-7712'],
    courses: ['STCW Basic Safety Training', 'ENG1 Medical Certificate'],
  }),
  email: 'john.doe@example.com',
  cellular: '+39 347 987 6543',
  callWhatsapp: '+39 347 987 6543',
}

// ── Fake auth — any email + any code/password logs in. Role is picked from the email
// itself (contains "recruiter"/"arm"/"owner") so a tester can choose which side to demo
// just by what they type — use crew-example@example.com to log in as crew, and
// recruiter-example@example.com to log in as a recruiter.
const roleForEmail = (email: string): TUserRole =>
  /recruiter|arm|owner/i.test(email) ? TUserRole.RECRUITER : TUserRole.CREW

export const fakeCheckEmail = () =>
  simulateNetwork({ result: 0, categoryPro: 'PRO', categoryArm: 'ARM', codePRO: null, codeARM: null }, 250)

export const fakeAuthenticate = (username: string): Promise<TAuthResponse> => {
  const category = roleForEmail(username)
  return simulateNetwork({ category, token: `fake-${category}-token` }, 250)
}

export const fakeGetRecruiterUserProfile = () => simulateNetwork(maskRecruiterIdentity(fakeRecruiterProfileBase))

export const fakeGetCrewUserProfile = (language?: string) =>
  simulateNetwork(localizeCrewFullText(maskCrewIdentity(fakeCrewProfileBase), language))

export const fakeGetCrewPublicCv = (language?: string) =>
  simulateNetwork(localizeCrewFullText({ ...fakeLoggedInCrewCv }, language))

export const fakeSetPushNotificationToken = () => simulateNetwork(undefined)

// ── Public API of this module ────────────────────────────────

export const fakeGetNotifications = (role: 'crew' | 'recruiter') =>
  simulateNetwork({ notifications: role === 'recruiter' ? [...recruiterNotifications] : [...crewNotifications] })

export const fakeSetNotificationRead = (notificationId: number) => {
  const found = [...crewNotifications, ...recruiterNotifications].find((n) => n.id === notificationId)
  if (found) found.isread = 1
  return simulateNetwork(undefined)
}

export const fakeGetRecruiterActiveSearches = (language?: string) =>
  simulateNetwork(searches.map((s) => localizeSearch(s, language)))

export const fakeGetRecruiterSearchById = (searchId: string | number, language?: string) => {
  const found = searches.filter((s) => String(s.idoffer) === String(searchId)).map((s) => localizeSearch(s, language))
  return simulateNetwork(found)
}

// These come back from the backend already translated per the request's `language` (no
// separate English field, unlike `offer`/`offerEng`) — a plain substitution is enough
// since they're short enum-like values, not full sentences.
const localizeCrewStatus = <T extends { maritalStatus: string; smoker: string; availability: string }>(
  crew: T,
  language?: string
): T => ({
  ...crew,
  maritalStatus: localizeTerm(crew.maritalStatus, language),
  smoker: localizeTerm(crew.smoker, language),
  availability: localizeTerm(crew.availability, language),
})

// Full CV/profile shapes also carry nationality, education and spoken languages —
// TCrewSimple (the crew-list row) doesn't have these, hence the separate function.
const localizeCrewFullText = <
  T extends {
    maritalStatus: string
    smoker: string
    availability: string
    nationality: string
    educationalLevel: string
    language1: string
    language2: string
    language3: string
    language4: string
  },
>(
  crew: T,
  language?: string
): T => ({
  ...localizeCrewStatus(crew, language),
  nationality: localizedFromPool(crew.nationality, NATIONALITIES, NATIONALITIES_IT, language),
  educationalLevel: localizedFromPool(crew.educationalLevel, EDUCATION_LEVELS, EDUCATION_LEVELS_IT, language),
  language1: localizedFromPool(crew.language1, LANGUAGES, LANGUAGES_IT, language),
  language2: localizedFromPool(crew.language2, LANGUAGES, LANGUAGES_IT, language),
  language3: localizedFromPool(crew.language3, LANGUAGES, LANGUAGES_IT, language),
  language4: localizedFromPool(crew.language4, LANGUAGES, LANGUAGES_IT, language),
})

export const fakeGetCrewList = (offerId: string | number, language?: string) =>
  simulateNetwork((crewListByOffer.get(Number(offerId)) ?? []).map((c) => localizeCrewStatus(c, language)))

export const fakeGetCrewCv = (crewId: string | number, language?: string) => {
  const crew = crewProfiles.get(Number(crewId))
  if (!crew) return simulateNetwork({} as TCrew)
  return simulateNetwork(localizeCrewFullText({ ...crew }, language))
}

export const fakeContactCrew = (crewId: string | number, offerId: string | number) => {
  const uid = Number(crewId)
  const oid = Number(offerId)
  const entries = crewListByOffer.get(oid)
  const entry = entries?.find((c) => c.userId === uid)
  if (entry && !entry.contacted) {
    entry.contacted = true
    entry.sent = true
    const search = searches.find((s) => s.idoffer === oid)
    if (search) search.countContacted += 1
  }
  const profile = crewProfiles.get(uid)
  if (profile) profile.contacted = true
  return simulateNetwork('OK')
}

export const fakeRemoveCrew = (crewId: string | number, offerId: string | number) => {
  const uid = Number(crewId)
  const oid = Number(offerId)
  const entries = crewListByOffer.get(oid)
  if (entries) {
    crewListByOffer.set(
      oid,
      entries.filter((c) => c.userId !== uid)
    )
    const search = searches.find((s) => s.idoffer === oid)
    if (search) search.countCandidates = Math.max(0, search.countCandidates - 1)
  }
  return simulateNetwork('OK')
}

export const fakeGetAllOffers = (language?: string) => simulateNetwork(offers.map((o) => localizeOffer(o, language)))

// Guest-facing "Jobs" tab — same catalog, no auth required.
export const fakeGetPublicOffers = (language?: string) => simulateNetwork(offers.map((o) => localizeOffer(o, language)))

export const fakeGetOffersForApply = (language?: string) =>
  simulateNetwork(offers.filter((o) => o.offerApplicable).map((o) => localizeOffer(o, language)))

export const fakeGetOfferById = (offerId: string | number, language?: string) => {
  const found = offers.filter((o) => String(o.idoffer) === String(offerId)).map((o) => localizeOffer(o, language))
  return simulateNetwork(found)
}

export const fakeApplyToOffer = (offerId: string | number) => {
  const offer = offers.find((o) => String(o.idoffer) === String(offerId))
  if (offer) offer.alreadyApplied = true
  return simulateNetwork('OK')
}

export const fakeGetWhyCanNotApply = () =>
  simulateNetwork([
    pick(['Missing seamans book', 'Position does not match your profile', 'Missing required certificate']),
  ])
