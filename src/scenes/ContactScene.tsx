import { Check, Copy, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AnimatedHeading from '../components/AnimatedHeading'
import Eyebrow from '../components/Eyebrow'
import SceneBackground from '../components/SceneBackground'
import { frame, glass } from '../experience/layout'
import { order } from '../experience/order'
import { images, site } from '../site'

const year = new Date().getFullYear()

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
    <div className="flex items-center gap-3 border-b border-white/10 py-2.5 sm:gap-4 md:py-4 short:py-2">
      <Icon className="h-5 w-5 shrink-0 text-taupe" strokeWidth={1.5} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-300">{label}</p>
        {href ? (
          <a href={href} className="block break-words text-sm transition-colors hover:text-gray-300 sm:text-base md:text-lg">
            {text}
          </a>
        ) : (
          <p className="break-words text-sm sm:text-base md:text-lg">{text}</p>
        )}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-300 transition-colors hover:text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {/* Icon only on small phones, to leave room for the address. */}
        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}

export default function ContactScene({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0">
      <SceneBackground image={images.entrance} position="40% center" />
      <div className={`${frame} justify-end lg:items-end lg:justify-center`}>
        <div className="scene-float flex min-h-0 w-full max-w-xl flex-col short:max-w-3xl">
          <div className={`scene-panel ${glass} min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 md:p-8 short:p-4`}>
            <Eyebrow>Contact</Eyebrow>
            <AnimatedHeading
              as="h2"
              variant="rise"
              text={'Interested in\nAlba Residences?'}
              play={active}
              initialDelay={250}
              charDelay={22}
              duration={900}
              className="text-3xl font-normal md:text-5xl short:text-2xl"
              style={{ letterSpacing: '-0.04em' }}
            />
            <p className="scene-item mt-4 text-sm text-gray-300 sm:text-base md:text-lg short:hidden" style={order(3)}>
              Call or email us and we’ll answer any questions about the apartments.
            </p>
            <div className="scene-item mt-4 border-t border-white/10 short:grid short:grid-cols-3 short:gap-x-4" style={order(4)}>
              <ContactRow icon={Phone} label="Phone" value={site.phone} href={site.phoneHref} />
              <ContactRow icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
              <ContactRow icon={MapPin} label="Location" value={`${site.location}, ${site.country}`} />
            </div>
            <p className="scene-item mt-4 text-xs text-gray-300 short:hidden" style={order(5)}>
              © {year} {site.company}. Images are architectural renders.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
