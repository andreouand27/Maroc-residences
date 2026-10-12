import { navLinks } from '../site'
import Logo from './Logo'

export default function Navbar() {
  return (
    <div className="px-6 pt-6 md:px-12 lg:px-16">
      <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
        <a href="#top" aria-label="Maroc Residences, back to top">
          <Logo />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm transition-colors hover:text-gray-300">
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
        >
          Enquire Now
        </a>
      </nav>
    </div>
  )
}
