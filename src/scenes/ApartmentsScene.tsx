import AnimatedHeading from '../components/AnimatedHeading'
import Eyebrow from '../components/Eyebrow'
import SceneBackground from '../components/SceneBackground'
import { frame, glass } from '../experience/layout'
import { order } from '../experience/order'
import { apartments, availableApartments, images, totalApartments } from '../site'

function availabilityLabel(available: number, count: number) {
  if (available === 0) return 'Sold out'
  if (available === count) return 'All available'
  return `${available} of ${count} available`
}

export default function ApartmentsScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0">
      <SceneBackground image={images.fullElevation} />
      <div className={`${frame} justify-between gap-6 short:gap-3`}>
        <div className="scene-float self-start">
          <div className={`scene-panel ${glass} p-5 md:p-7 short:p-4`}>
            <Eyebrow>Apartments</Eyebrow>
            <AnimatedHeading
              as="h2"
              variant="rise"
              text={'Three types\nof home'}
              play={active}
              initialDelay={250}
              charDelay={22}
              duration={900}
              className="text-3xl font-normal md:text-5xl short:text-2xl"
              style={{ letterSpacing: '-0.04em' }}
            />
            <p className="scene-item mt-4 hidden text-gray-300 md:block md:text-lg short:hidden" style={order(3)}>
              {totalApartments} apartments over two floors.{' '}
              {availableApartments === totalApartments ? 'All available.' : `${availableApartments} available.`}
            </p>
          </div>
        </div>

        <ul className="scene-float grid gap-3 md:grid-cols-3 md:gap-4">
          {apartments.map((apartment, index) => (
            <li
              key={apartment.name}
              className={`scene-card ${glass} flex items-center gap-4 p-4 md:block md:p-6 short:flex short:gap-3 short:p-3`}
              style={order(index)}
            >
              <p className="flex w-14 shrink-0 flex-col items-center md:mb-4 md:w-auto md:flex-row md:items-baseline md:gap-2 short:mb-0 short:w-12 short:flex-col short:items-center short:gap-0">
                <span className="text-4xl font-light tabular-nums text-taupe md:text-6xl short:text-3xl">{apartment.count}</span>
                <span className="text-[10px] text-gray-300 md:text-sm short:text-[10px]">apartments</span>
              </p>
              <div className="min-w-0">
                <h3 className="text-lg md:text-2xl short:text-base" style={{ letterSpacing: '-0.03em' }}>
                  {apartment.name}
                </h3>
                <p className="mt-1 hidden text-sm text-gray-300 md:block short:hidden">{apartment.description}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-gray-300 md:mt-4 md:text-sm short:mt-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${apartment.available > 0 ? 'bg-taupe' : 'bg-white/30'}`}
                    aria-hidden="true"
                  />
                  {availabilityLabel(apartment.available, apartment.count)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
