export default function Logo() {
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
