import AnimatedHeading from '../components/AnimatedHeading'
import Eyebrow from '../components/Eyebrow'
import SceneBackground from '../components/SceneBackground'
import { frame, glass } from '../experience/layout'
import { order } from '../experience/order'
import { features, images } from '../site'

export default function FeaturesScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0">
      <SceneBackground image={images.balconiesCorner} position="45% center" />
      <div className={`${frame} justify-between gap-6`}>
        <div className="scene-float self-start">
          <div className={`scene-panel ${glass} p-5 md:p-7 short:p-4`}>
            <Eyebrow>Features</Eyebrow>
            <AnimatedHeading
              as="h2"
              variant="rise"
              text={'Made for\neveryday living'}
              play={active}
              initialDelay={250}
              charDelay={22}
              duration={900}
              className="text-3xl font-normal md:text-5xl short:text-2xl"
              style={{ letterSpacing: '-0.04em' }}
            />
          </div>
        </div>

        <ul className="scene-float grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-6 short:grid-cols-6 short:gap-2">
          {features.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className={`scene-tile ${glass} p-4 md:p-5 short:p-3`} style={order(index)}>
              <Icon className="h-5 w-5 text-taupe" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-3 text-sm md:text-base short:mt-2 short:text-xs">{title}</h3>
              <p className="mt-1 hidden text-sm text-gray-300 md:block short:hidden">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
