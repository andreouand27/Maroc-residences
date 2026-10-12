export const site = {
  company: 'Maroc Residences',
  project: 'Alba Residences by Maroc',
  location: 'Archangelos, Nicosia',
  country: 'Cyprus',
  phone: '+357 99905533',
  phoneHref: 'tel:+35799905533',
  email: 'marocresidences27@gmail.com',
  construction: 'Starts November 2026',
}

export const navLinks = [
  { label: 'Project', href: '#project' },
  { label: 'Apartments', href: '#apartments' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
]

export const apartments = [
  {
    name: 'One-bedroom',
    count: 4,
    available: 4,
    description: 'A one-bedroom home with covered parking.',
  },
  {
    name: 'Two-bedroom',
    count: 2,
    available: 2,
    description: 'A two-bedroom home with covered parking.',
  },
  {
    name: 'Two-bedroom with roof garden',
    count: 2,
    available: 2,
    description: 'A top-floor two-bedroom home with its own private roof garden and covered parking.',
  },
]

export const totalApartments = apartments.reduce((sum, apartment) => sum + apartment.count, 0)
export const availableApartments = apartments.reduce((sum, apartment) => sum + apartment.available, 0)

export const features = [
  { title: 'Covered parking', description: 'Covered parking for every apartment, beneath the building.' },
  { title: 'Deep balconies', description: 'Generous balconies with glass railings.' },
  { title: 'Sliding screens', description: 'Sliding dark metal screens for shade and privacy.' },
  { title: 'Private roof gardens', description: 'The two top-floor apartments each have their own roof garden.' },
  { title: 'Kitchen included', description: 'Apartments come with the kitchen included.' },
  { title: 'Air conditioning', description: 'Apartments come with air conditioning.' },
]
