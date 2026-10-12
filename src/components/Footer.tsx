import { site } from '../site'
import Logo from './Logo'
import Reveal from './Reveal'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 md:px-12 lg:px-16">
      <Reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo variant="full" />
          <p className="mt-6 text-sm text-gray-300">
            {site.project} · {site.location}, {site.country}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-300 md:items-end">
          <a href={site.phoneHref} className="transition-colors hover:text-white">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
            {site.email}
          </a>
        </div>
      </Reveal>
      <p className="mt-10 text-xs text-gray-300">
        © {year} {site.company}. All rights reserved. Images are architectural renders.
      </p>
    </footer>
  )
}
