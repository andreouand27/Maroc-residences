import { navScenes, scenes, type SceneId } from '../experience/scenes'
import Logo from './Logo'

type NavbarProps = {
  current: SceneId
  visible: boolean
  onNavigate: (id: SceneId) => void
}

export default function Navbar({ current, visible, onNavigate }: NavbarProps) {
  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 top-0 z-50 px-6 pt-[calc(1.5rem+var(--safe-top))] transition-[opacity,transform] short:pt-[calc(0.75rem+var(--safe-top))] duration-700 md:px-12 lg:px-16 ${
        visible ? 'opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
      }`}
    >
      <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
        <button type="button" onClick={() => onNavigate('hero')} aria-label="Maroc Residences, home">
          <Logo />
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {navScenes.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={current === id ? 'page' : undefined}
              className="relative text-sm transition-colors hover:text-gray-300"
            >
              {scenes.find((scene) => scene.id === id)?.label}
              <span
                className={`absolute -bottom-1.5 left-1/2 h-px w-4 -translate-x-1/2 bg-taupe transition-transform duration-500 ${
                  current === id ? 'scale-x-100' : 'scale-x-0'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
        >
          Enquire Now
        </button>
      </nav>
    </div>
  )
}
