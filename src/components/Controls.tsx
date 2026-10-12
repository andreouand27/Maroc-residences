import { ChevronDown } from 'lucide-react'
import { scenes } from '../experience/scenes'
import Key from './Key'

type ControlsProps = {
  current: number
  visible: boolean
  onNavigate: (index: number) => void
  onNext: () => void
}

// Scenes after the splash, which the progress marks stand for.
const steps = scenes.slice(1)

export default function Controls({ current, visible, onNavigate, onNext }: ControlsProps) {
  const isLast = current === scenes.length - 1
  const step = Math.max(current, 1)

  return (
    <div inert={!visible} className={`transition-opacity duration-700 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {/* Progress down the right edge, from tablet width up. */}
      <nav aria-label="Sections" className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end md:flex">
        <p className="mb-2 text-[10px] tabular-nums text-gray-300">
          {String(step).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </p>
        {steps.map((scene, index) => {
          const active = index + 1 === current
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => onNavigate(index + 1)}
              aria-label={`Go to ${scene.label}`}
              aria-current={active ? 'step' : undefined}
              className="group flex items-center gap-3 py-1.5"
            >
              <span className="liquid-glass pointer-events-none rounded-md px-2 py-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {scene.label}
              </span>
              <span
                className={`block w-[2px] rounded-full transition-all duration-500 ${
                  active ? 'h-10 bg-white' : 'h-5 bg-white/30 group-hover:bg-white/70'
                }`}
              />
            </button>
          )
        })}
      </nav>

      {/* Next prompt, also a button for mouse and touch. */}
      <button
        type="button"
        onClick={onNext}
        className="fixed bottom-[calc(0.75rem+var(--safe-bottom))] left-1/2 short:bottom-[calc(0.25rem+var(--safe-bottom))] z-50 flex w-max -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-4 py-1 text-xs text-gray-300 md:gap-2 md:py-1.5 transition-colors hover:text-white"
      >
        <span className="flex gap-1.5 md:hidden" aria-hidden="true">
          {steps.map((scene, index) => (
            <span
              key={scene.id}
              className={`h-[2px] w-5 rounded-full transition-colors duration-500 ${index + 1 === current ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </span>
        <span className="flex items-center gap-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
          <span className="flex items-center gap-1.5 [@media(pointer:coarse)]:hidden">
            {isLast ? (
              <>
                Press <Key>Enter</Key> to start again
              </>
            ) : (
              <>
                Press <Key>Space</Key> or <Key>Enter</Key>
              </>
            )}
          </span>
          <span className="hidden [@media(pointer:coarse)]:inline">
            {isLast ? 'Swipe up to start again' : 'Swipe up or tap for next'}
          </span>
          <ChevronDown className="hint-nudge h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </button>
    </div>
  )
}
