import { AirVent, Blinds, Car, CookingPot, Sun, Trees, type LucideIcon } from 'lucide-react'

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

export type SiteImage = {
  /** Full-size render. */
  src: string
  /** Smaller copy for gallery tiles. */
  thumb: string
  alt: string
}

const render = (name: string, alt: string): SiteImage => ({
  src: `images/${name}.webp`,
  thumb: `images/gallery/${name}.webp`,
  alt,
})

export const images = {
  frontDusk: render('front-dusk', 'Alba Residences from the street at dusk, with the lit entrance and stone sign'),
  streetCorner: render('street-corner', 'Corner view of the building from the street on a sunny evening'),
  balconiesCorner: render(
    'balconies-corner',
    'Corner of the building with deep balconies, glass railings and covered parking below',
  ),
  entrance: render(
    'entrance',
    'Landscaped entrance with stone planters, garden lighting and the Alba Residences by Maroc sign',
  ),
  sideElevation: render('side-elevation', 'Side of the building with sliding metal screens above the covered parking'),
  fullElevation: render('full-elevation', 'Both floors of apartments raised above the covered parking'),
  parkingCorner: render('parking-corner', 'The building raised on columns above covered parking'),
  sideDusk: render('side-dusk', 'Side of the building lit up at dusk'),
}

export const gallery: SiteImage[] = [
  images.frontDusk,
  images.streetCorner,
  images.balconiesCorner,
  images.entrance,
  images.sideElevation,
  images.fullElevation,
  images.parkingCorner,
  images.sideDusk,
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

export const features: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Covered parking', description: 'Covered parking for every apartment, beneath the building.', icon: Car },
  { title: 'Deep balconies', description: 'Generous balconies with glass railings.', icon: Sun },
  { title: 'Sliding screens', description: 'Sliding dark metal screens for shade and privacy.', icon: Blinds },
  {
    title: 'Private roof gardens',
    description: 'The two top-floor apartments each have their own roof garden.',
    icon: Trees,
  },
  { title: 'Kitchen included', description: 'Apartments come with the kitchen included.', icon: CookingPot },
  { title: 'Air conditioning', description: 'Apartments come with air conditioning.', icon: AirVent },
]
