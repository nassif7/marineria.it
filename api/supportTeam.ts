export type TSupportTeam = {
  firstName: string
  lastName: string
  position?: string
  whatsApp: string
  telegram?: string
  email: string
  phoneNumber: string
  photoUrl?: string
}

export const supportTeam = [
  {
    firstName: 'Michele',
    lastName: 'Costabile',
    position: 'project-manager',
    whatsApp: '+39 333 333 3333',
    email: 't7oBt@example.com',
    phoneNumber: '+39 333 333 3333',
    photoUrl: 'https://www.marineria.it/img/Michele.jpg',
  },
  {
    firstName: 'Elisa',
    lastName: 'Rossi',
    position: 'human-resources',
    whatsApp: '+39 333 333 3333',
    telegram: '@elisa.rossi',
    email: 't7oBt@example.com',
    phoneNumber: '+39 333 333 3333',
    photoUrl: 'https://www.marineria.it/img/ElisaRossi.jpg',
  },
]
