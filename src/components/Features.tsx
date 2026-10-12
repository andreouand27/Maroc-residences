import { features, images } from '../site'
import Reveal from './Reveal'
import RevealImage from './RevealImage'
import SectionHeading from './SectionHeading'

export default function Features() {
  return (
    <section id="features" className="scroll-mt-6 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <Reveal>
            <SectionHeading eyebrow="Features" title="Made for everyday living" />
          </Reveal>

          <ul className="mt-10 grid border-t border-white/10 sm:grid-cols-2 sm:gap-x-10">
            {features.map((feature, index) => (
              <li key={feature.title} className="border-b border-white/10">
                <Reveal delay={(index % 2) * 100} className="py-6">
                  <h3 className="text-lg lg:text-xl" style={{ letterSpacing: '-0.02em' }}>
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-gray-300">{feature.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <RevealImage
          image={images.balconiesCorner}
          className="mt-12 aspect-[4/3] lg:sticky lg:top-8 lg:mt-0 lg:aspect-[4/5]"
          imageClassName="object-[45%_center]"
        />
      </div>
    </section>
  )
}
