import { apartments } from '../site'
import SectionHeading from './SectionHeading'

function availabilityLabel(available: number, count: number) {
  if (available === 0) return 'Sold out'
  if (available === count) return 'All available'
  return `${available} of ${count} available`
}

export default function Apartments() {
  return (
    <section id="apartments" className="scroll-mt-6 border-t border-white/10 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <SectionHeading eyebrow="Apartments" title="Three types of home">
        <p>Eight apartments over two floors, from one-bedroom homes to top-floor apartments with roof gardens.</p>
      </SectionHeading>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {apartments.map((apartment) => (
          <article
            key={apartment.name}
            className="liquid-glass flex flex-col rounded-xl border border-white/20 p-6 lg:p-8"
          >
            <p className="text-sm text-gray-300">{apartment.count} apartments</p>
            <h3 className="mt-2 text-2xl lg:text-3xl" style={{ letterSpacing: '-0.04em' }}>
              {apartment.name}
            </h3>
            <p className="mt-4 text-gray-300">{apartment.description}</p>
            <p className="mt-auto flex items-center gap-2 pt-8 text-sm">
              <span className={`h-2 w-2 rounded-full ${apartment.available > 0 ? 'bg-white' : 'bg-gray-300/40'}`} />
              {availabilityLabel(apartment.available, apartment.count)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
