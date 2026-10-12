import { Check, Copy, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../site'
import SectionHeading from './SectionHeading'

type ContactCardProps = {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

function ContactCard({ icon: Icon, label, value, href }: ContactCardProps) {
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
    <div className="liquid-glass flex min-w-0 flex-col gap-6 rounded-xl border border-white/20 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-300 transition-colors hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-300">{label}</p>
        {href ? (
          <a href={href} className="mt-1 block break-words text-lg transition-colors hover:text-gray-300">
            {text}
          </a>
        ) : (
          <p className="mt-1 break-words text-lg">{text}</p>
        )}
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-6 border-t border-white/10 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <SectionHeading eyebrow="Contact" title="Interested in Alba Residences?">
        <p>Call or email us and we’ll answer any questions about the apartments.</p>
      </SectionHeading>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <ContactCard icon={Phone} label="Phone" value={site.phone} href={site.phoneHref} />
        <ContactCard icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
        <ContactCard icon={MapPin} label="Location" value={`${site.location}, ${site.country}`} />
      </div>
    </section>
  )
}
