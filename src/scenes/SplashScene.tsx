import Key from '../components/Key'
import { site } from '../site'

type SplashSceneProps = {
  onEnter: () => void
}

export default function SplashScene({ onEnter }: SplashSceneProps) {
  return (
    <div
      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-black px-6"
      onClick={onEnter}
    >
      <div className="splash-grid absolute inset-0" aria-hidden="true" />
      <div
        className="splash-glow absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
      />

      <h1 data-splash-logo className="relative flex flex-col items-center">
        <div className="relative">
          <img
            src="images/logo-mark.webp"
            alt=""
            width={808}
            height={513}
            className="splash-mark h-auto w-[min(58vw,330px)] short:w-[200px]"
          />
          <span className="splash-scan" aria-hidden="true" />
        </div>
        <img
          src="images/logo-wordmark.webp"
          alt="Maroc Residences"
          width={967}
          height={229}
          className="splash-word mt-5 h-auto w-[min(70vw,400px)] short:mt-3 short:w-[260px]"
        />
      </h1>

      <div className="splash-prompt mt-14 short:mt-6">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onEnter()
          }}
          className="liquid-glass relative rounded-full border border-white/20 px-6 py-3 text-sm transition-colors hover:bg-white/15"
        >
          <span className="splash-pulse flex items-center gap-2 [@media(pointer:coarse)]:hidden">
            Press <Key>Enter</Key> or <Key>Space</Key> to enter
          </span>
          <span className="splash-pulse hidden [@media(pointer:coarse)]:inline">Tap to enter</span>
        </button>
      </div>

      <p className="splash-prompt absolute bottom-[calc(2rem+var(--safe-bottom))] px-6 text-center text-xs text-gray-300">
        {site.project} · {site.location}
      </p>
    </div>
  )
}
