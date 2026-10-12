import { availableApartments, site, totalApartments } from '../site'
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
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
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
              <p>
                You arrive through a landscaped entrance with stone planters, olive trees and garden lighting,
                marked by a stone “Alba Residences by Maroc” sign.
              </p>
            </div>
          </SectionHeading>
        </div>

        <dl className="liquid-glass mt-12 rounded-xl border border-white/20 px-6 lg:mt-0">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1 border-b border-white/10 py-5 last:border-b-0 sm:flex-row sm:justify-between sm:gap-6"
            >
              <dt className="text-sm text-gray-300">{fact.label}</dt>
              <dd className="sm:text-right">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
