type LogoProps = {
  /** `lockup` sits in the navbar; `full` is the stacked logo. */
  variant?: 'lockup' | 'full'
}

export default function Logo({ variant = 'lockup' }: LogoProps) {
  if (variant === 'full') {
    return (
      <img src="images/logo-full.webp" alt="Maroc Residences" width={1025} height={785} className="h-24 w-auto md:h-28" />
    )
  }

  return (
    <span className="flex items-center gap-2.5">
      <img src="images/logo-mark.webp" alt="" width={808} height={513} className="h-7 w-auto md:h-9" />
      {/* Hidden at tablet width, where the nav links need the room. */}
      <img
        src="images/logo-wordmark.webp"
        alt="Maroc Residences"
        width={967}
        height={229}
        className="h-6 w-auto md:hidden lg:block lg:h-8"
      />
    </span>
  )
}
