import AnimatedHeading from '../components/AnimatedHeading'
import FadeIn from '../components/FadeIn'
import SceneBackground from '../components/SceneBackground'
import type { SceneId } from '../experience/scenes'
import { images, site } from '../site'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

type HeroSceneProps = {
  active: boolean
  onNavigate: (id: SceneId) => void
}

export default function HeroScene({ active, onNavigate }: HeroSceneProps) {
  return (
    <div className="absolute inset-0 bg-black text-white">
      {/* The render shows while the video loads, and wherever it can't play. */}
      <SceneBackground image={images.frontDusk}>
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />
      </SceneBackground>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-1 flex-col justify-end px-6 pb-[calc(3.75rem+var(--safe-bottom))] md:px-12 md:pb-[calc(3rem+var(--safe-bottom))] lg:px-16 lg:pb-[calc(4rem+var(--safe-bottom))]">
          <div className="scene-float lg:grid lg:grid-cols-2 lg:items-end short:grid short:grid-cols-[1fr_auto] short:items-end short:gap-6">
            {/* A soft shadow keeps the text readable over bright parts of the background. */}
            <div className="[text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
              <AnimatedHeading
                text={'Your new home\nin Archangelos.'}
                play={active}
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl short:mb-2 short:text-3xl"
                style={{ letterSpacing: '-0.04em' }}
              />

              <FadeIn delay={800} duration={1000} play={active}>
                <p className="mb-5 text-base text-gray-300 md:text-lg short:mb-3 short:text-sm">
                  {site.project}. One and two-bedroom apartments in {site.location}, with covered parking for
                  every home.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000} play={active}>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100"
                  >
                    Enquire Now
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('apartments')}
                    className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black"
                  >
                    View Apartments
                  </button>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={1400} duration={1000} play={active} className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end short:mt-0">
              <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                <p className="text-lg font-light md:text-xl lg:text-2xl">8 apartments. All available.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
