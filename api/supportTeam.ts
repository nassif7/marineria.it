import { USE_FAKE_DATA, avatarUrl } from './fakeData'

export type TSupportTeam = {
  firstName: string
  lastName: string
  position?: string
  whatsApp: string
  telegram?: string
  email: string
  phoneNumber: string
  photoUrl?: string
  isOnline?: boolean
}

// Monday–Saturday, startHour (inclusive) to endHour (exclusive), in the device's local time.
const isWithinSupportHours = (startHour: number, endHour: number) => {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday
  return day >= 1 && day <= 6 && now.getHours() >= startHour && now.getHours() < endHour
}

const realSupportTeam: TSupportTeam[] = [
  {
    firstName: 'Michele',
    lastName: 'Costabile',
    whatsApp: '+39 338 6337722 ',
    email: 'info@marineria.it',
    phoneNumber: '+39 338 6337722 ',
    photoUrl: 'https://www.marineria.it/img/Michele.jpg',
    isOnline: isWithinSupportHours(15, 19),
  },
  {
    firstName: 'Elisa',
    lastName: 'Rossi',
    whatsApp: '+39 351 3967077',
    email: 'elisa.rossi@marineria.it',
    phoneNumber: '+39 351 3967077',
    photoUrl: 'https://www.marineria.it/img/ElisaRossi.jpg',
    isOnline: isWithinSupportHours(15, 19),
  },
]

// Standing in for the real support team during demo recordings — same shape, fictional
// people, no real contact details or photos of actual staff.
const fakeSupportTeam: TSupportTeam[] = [
  {
    firstName: 'Luca',
    lastName: 'Ferraro',
    whatsApp: '+39 333 1234567',
    email: 'support-example@example.com',
    phoneNumber: '+39 333 1234567',
    photoUrl: avatarUrl(710001, 'M'),
    isOnline: true,
  },
  {
    firstName: 'Giulia',
    lastName: 'Moretti',
    whatsApp: '+39 333 7654321',
    email: 'support-example@example.com',
    phoneNumber: '+39 333 7654321',
    photoUrl: avatarUrl(710002, 'F'),
    isOnline: isWithinSupportHours(15, 19),
  },
]

export const supportTeam = USE_FAKE_DATA ? fakeSupportTeam : realSupportTeam
