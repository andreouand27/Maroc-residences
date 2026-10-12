import { features } from '../site'
import SectionHeading from './SectionHeading'

export default function Features() {
  return (
    <section id="features" className="scroll-mt-6 border-t border-white/10 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <SectionHeading eyebrow="Features" title="Made for everyday living" />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={feature.title} className="liquid-glass rounded-xl border border-white/20 p-6 lg:p-8">
            <p className="text-sm text-gray-300">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-6 text-xl lg:text-2xl" style={{ letterSpacing: '-0.04em' }}>
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
