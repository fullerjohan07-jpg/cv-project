export type TemplateId = 'modern' | 'classic' | 'creative'

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Language {
  id: string
  name: string
  level: string
}

export interface CVData {
  template: TemplateId
  accent: string
  personal: {
    fullName: string
    title: string
    email: string
    phone: string
    location: string
    website: string
    photo: string // data URL, empty when none
  }
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
  languages: Language[]
}

export const ACCENT_COLORS: { label: string; value: string }[] = [
  { label: 'Bleu', value: '#2563eb' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Émeraude', value: '#059669' },
  { label: 'Bordeaux', value: '#9f1239' },
  { label: 'Ardoise', value: '#334155' },
  { label: 'Ambre', value: '#b45309' },
]

export const LANGUAGE_LEVELS = [
  'Débutant',
  'Intermédiaire',
  'Courant',
  'Bilingue',
  'Langue maternelle',
]

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export const emptyCV: CVData = {
  template: 'modern',
  accent: '#2563eb',
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    photo: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
}

export const sampleCV: CVData = {
  template: 'modern',
  accent: '#2563eb',
  personal: {
    fullName: 'Camille Laurent',
    title: 'Cheffe de projet digital',
    email: 'camille.laurent@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Lyon, France',
    website: 'camille-laurent.fr',
    photo: '',
  },
  summary:
    "Cheffe de projet avec 7 ans d'expérience dans la conduite de projets web et mobiles. Passionnée par les produits centrés utilisateur, je pilote des équipes pluridisciplinaires du cadrage à la mise en production.",
  experiences: [
    {
      id: uid(),
      role: 'Cheffe de projet senior',
      company: 'Studio Nova',
      location: 'Lyon',
      startDate: '2021',
      endDate: '',
      current: true,
      description:
        "Pilotage de 5 projets clients en parallèle. Coordination d'une équipe de 8 personnes. Amélioration du taux de livraison dans les délais de 68% à 94%.",
    },
    {
      id: uid(),
      role: 'Chef de projet',
      company: 'Agence Pixel',
      location: 'Paris',
      startDate: '2017',
      endDate: '2021',
      current: false,
      description:
        'Gestion du cycle de vie complet de projets e-commerce. Interface entre les clients, les designers et les développeurs.',
    },
  ],
  education: [
    {
      id: uid(),
      degree: 'Master Management de projet',
      school: 'IAE Lyon',
      location: 'Lyon',
      startDate: '2015',
      endDate: '2017',
      description: 'Spécialisation transformation digitale.',
    },
  ],
  skills: ['Gestion de projet', 'Agile / Scrum', 'Figma', 'Jira', 'Budgétisation', 'Management'],
  languages: [
    { id: uid(), name: 'Français', level: 'Langue maternelle' },
    { id: uid(), name: 'Anglais', level: 'Courant' },
    { id: uid(), name: 'Espagnol', level: 'Intermédiaire' },
  ],
}
