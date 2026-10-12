import { availableApartments, images, site, totalApartments } from '../site'
import Reveal from './Reveal'
import RevealImage from './RevealImage'
import SectionHeading from './SectionHeading'

const facts = [
  { label: 'Location', value: `${site.location}, ${site.country}` },
  { label: 'Apartments', value: `${totalApartments} in total` },
  {
    label: 'Availability',
    value:
      availableApartments === totalApartments
        ? `All ${totalApartments} available`
        : `${availableApartments} of ${totalApartments} available`,
  },
  { label: 'Construction', value: site.construction },
  { label: 'Parking', value: 'Covered, for every apartment' },
]

export default function Project() {
  return (
    <section id="project" className="scroll-mt-6 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <div className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow={`The project · ${site.location}`} title={site.project}>
            <div className="space-y-5">
              <p>
                A small building of just {totalApartments} apartments in {site.location}. Two floors of homes are
                raised on columns above covered parking, so every apartment has a parking space under cover.
              </p>
              <p>
                Deep balconies with glass railings open each home to the outside, and sliding dark metal screens
                give shade and privacy whenever you want it. The two top-floor apartments each have a private roof
                garden.
              </p>
            </div>
          </SectionHeading>
        </Reveal>

        <Reveal delay={150} className="mt-12 lg:mt-0">
          <dl className="border-t border-white/10">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-1 border-b border-white/10 py-4 sm:flex-row sm:justify-between sm:gap-6"
              >
                <dt className="text-sm text-gray-300">{fact.label}</dt>
                <dd className="sm:text-right">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <RevealImage image={images.streetCorner} className="mt-16 aspect-[4/3] md:aspect-[21/9] lg:mt-20" />
    </section>
  )
}
