import AnimatedHeading from '../components/AnimatedHeading'
import Eyebrow from '../components/Eyebrow'
import SceneBackground from '../components/SceneBackground'
import { frame, glass } from '../experience/layout'
import { order } from '../experience/order'
import { availableApartments, images, site, totalApartments } from '../site'

const facts = [
  { label: 'Location', value: site.location },
  { label: 'Apartments', value: `${totalApartments} in total` },
  {
    label: 'Availability',
    value:
      availableApartments === totalApartments
        ? `All ${totalApartments} available`
        : `${availableApartments} of ${totalApartments} available`,
  },
  { label: 'Construction', value: site.construction },
]

export default function ProjectScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0">
      <SceneBackground image={images.streetCorner} />
      <div className={`${frame} justify-end lg:justify-center`}>
        <div className="scene-float flex min-h-0 w-full max-w-xl flex-col">
          <div className={`scene-panel ${glass} min-h-0 overflow-y-auto overscroll-contain p-6 md:p-8`}>
            <Eyebrow>The project · {site.location}</Eyebrow>
            <AnimatedHeading
              as="h2"
              variant="rise"
              text={'Alba Residences\nby Maroc'}
              play={active}
              initialDelay={250}
              charDelay={22}
              duration={900}
              className="text-3xl font-normal md:text-5xl"
              style={{ letterSpacing: '-0.04em' }}
            />
            <p className="scene-item mt-5 text-base text-gray-300 md:text-lg" style={order(3)}>
              A small building of just {totalApartments} apartments. Two floors of homes are raised on columns above
              covered parking, with deep balconies, glass railings and sliding metal screens for shade and privacy.
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className="scene-item rounded-xl border border-white/10 bg-white/5 p-3 md:p-4"
                  style={order(4 + index)}
                >
                  <dt className="text-xs text-gray-300">{fact.label}</dt>
                  <dd className="mt-1 text-sm md:text-base">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
