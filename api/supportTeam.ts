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

export const supportTeam = [
  {
    firstName: 'Michele',
    lastName: 'Costabile',
    whatsApp: '+39 338 6337722 ',
    email: 'info@marineria.it',
    phoneNumber: '+39 338 6337722 ',
    photoUrl: 'https://www.marineria.it/img/Michele.jpg',
    isOnline: true,
  },
  {
    firstName: 'Elisa',
    lastName: 'Rossi',
    whatsApp: '+39 351 3967077',
    email: 'elisa.rossi@marineria.it',
    phoneNumber: '+39 351 3967077',
    photoUrl: 'https://www.marineria.it/img/ElisaRossi.jpg',
    isOnline: new Date().getHours() >= 20,
  },
]
