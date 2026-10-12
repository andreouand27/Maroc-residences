import { apartments, images, totalApartments } from '../site'
import Reveal from './Reveal'
import RevealImage from './RevealImage'
import SectionHeading from './SectionHeading'

function availabilityLabel(available: number, count: number) {
  if (available === 0) return 'Sold out'
  if (available === count) return 'All available'
  return `${available} of ${count} available`
}

export default function Apartments() {
  return (
    <section id="apartments" className="scroll-mt-6 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <RevealImage image={images.fullElevation} className="aspect-[4/3]" />

        <div className="mt-12 lg:mt-0">
          <Reveal>
            <SectionHeading eyebrow="Apartments" title="Three types of home">
              <p>
                {totalApartments} apartments over two floors, from one-bedroom homes to top-floor apartments with roof
                gardens.
              </p>
            </SectionHeading>
          </Reveal>

          <ul className="mt-10 border-t border-white/10">
            {apartments.map((apartment, index) => (
              <li key={apartment.name} className="border-b border-white/10">
                <Reveal delay={index * 100} className="flex items-start justify-between gap-6 py-6">
                  <div className="min-w-0">
                    <h3 className="text-xl lg:text-2xl" style={{ letterSpacing: '-0.04em' }}>
                      {apartment.name}
                    </h3>
                    <p className="mt-1 text-gray-300">{apartment.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular-nums">{apartment.count} apartments</p>
                    <p className="mt-1 flex items-center justify-end gap-2 text-sm text-gray-300">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${apartment.available > 0 ? 'bg-taupe' : 'bg-white/30'}`}
                        aria-hidden="true"
                      />
                      {availabilityLabel(apartment.available, apartment.count)}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
