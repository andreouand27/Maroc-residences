import { Mail, MapPin, Phone } from 'lucide-react'
import { site } from '../site'
import SectionHeading from './SectionHeading'

const cardClass = 'liquid-glass flex flex-col gap-6 rounded-xl border border-white/20 p-6 lg:p-8'

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-6 border-t border-white/10 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <SectionHeading eyebrow="Contact" title="Interested in Alba Residences?">
        <p>Call or email us and we’ll answer any questions about the apartments.</p>
      </SectionHeading>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <a href={site.phoneHref} className={`${cardClass} transition-colors hover:bg-white hover:text-black`}>
          <Phone className="h-5 w-5" strokeWidth={1.5} />
          <div>
            <p className="text-sm opacity-70">Phone</p>
            <p className="mt-1 text-lg">{site.phone}</p>
          </div>
        </a>
        <a href={`mailto:${site.email}`} className={`${cardClass} transition-colors hover:bg-white hover:text-black`}>
          <Mail className="h-5 w-5" strokeWidth={1.5} />
          <div>
            <p className="text-sm opacity-70">Email</p>
            <p className="mt-1 break-all text-lg">{site.email}</p>
          </div>
        </a>
        <div className={cardClass}>
          <MapPin className="h-5 w-5" strokeWidth={1.5} />
          <div>
            <p className="text-sm opacity-70">Location</p>
            <p className="mt-1 text-lg">
              {site.location}, {site.country}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
