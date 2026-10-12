import { Check, Copy, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { images, site } from '../site'
import Reveal from './Reveal'
import RevealImage from './RevealImage'
import SectionHeading from './SectionHeading'

type ContactRowProps = {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

function ContactRow({ icon: Icon, label, value, href }: ContactRowProps) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  // If clipboard access is refused, select the text so it can be copied by hand.
  const selectValue = () => {
    if (valueRef.current) window.getSelection()?.selectAllChildren(valueRef.current)
  }

  const copy = () => {
    if (!navigator.clipboard) {
      selectValue()
      return
    }
    navigator.clipboard.writeText(value).then(() => setCopied(true), selectValue)
  }

  const text = <span ref={valueRef}>{value}</span>

  return (
    <div className="flex items-center gap-4 border-b border-white/10 py-5">
      <Icon className="h-5 w-5 shrink-0 text-taupe" strokeWidth={1.5} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-300">{label}</p>
        {href ? (
          <a href={href} className="mt-0.5 block break-words text-lg transition-colors hover:text-gray-300">
            {text}
          </a>
        ) : (
          <p className="mt-0.5 break-words text-lg">{text}</p>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-300 transition-colors hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-6 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <SectionHeading eyebrow="Contact" title="Interested in Alba Residences?">
              <p>Call or email us and we’ll answer any questions about the apartments.</p>
            </SectionHeading>
          </Reveal>

          <Reveal delay={150} className="mt-10 border-t border-white/10">
            <ContactRow icon={Phone} label="Phone" value={site.phone} href={site.phoneHref} />
            <ContactRow icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
            <ContactRow icon={MapPin} label="Location" value={`${site.location}, ${site.country}`} />
          </Reveal>
        </div>

        <RevealImage
          image={images.entrance}
          className="mt-12 aspect-[4/3] lg:mt-0"
          imageClassName="object-[40%_center]"
        />
      </div>
    </section>
  )
}
