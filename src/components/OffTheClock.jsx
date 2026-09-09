import { offTheClock } from '../data/portfolio'

export default function OffTheClock() {
  return (
    <section
      aria-label="Off the clock"
      className="relative overflow-hidden border-y border-line"
    >
      {/* The panorama is already 3.56:1, so a full bleed band crops it barely
          at all, which is why it suits this strip where the 16:9 clip did not. */}
      {/* Asymmetric fade: most of the dissolving happens upward, into the sky,
          so the scene reads as a horizon rather than a panel. The bottom keeps
          a short fade rather than none, since a hard stop at the section rule
          looks like a crop, and the frame is pulled far enough down that the
          island clears that fade instead of dissolving with it. */}
      <div
        aria-hidden="true"
        className="scene-frame pointer-events-none absolute inset-0"
        style={{ '--scene-fade-top': '50%', '--scene-fade-bottom': '18%' }}
      >
        <img
          src="/spirited-away.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="scene scene--still h-full w-full object-cover object-[50%_58%]"
        />
      </div>

      <div className="shell relative flex min-h-[190px] flex-col justify-center gap-6 py-10 sm:min-h-[210px] lg:flex-row lg:items-center lg:gap-10">
        <span className="eyebrow shrink-0 !text-accent">Off the clock</span>

        {/* bone rather than muted: over the band, muted measures about 3.0:1 in
            the dark theme and 2.6:1 in the light, where bone/90 stays above 4.5 */}
        <div className="flex flex-1 flex-col gap-4 text-[15px] leading-relaxed text-bone/90 sm:flex-row sm:gap-10 sm:text-base">
          <p className="flex">[i] {offTheClock.learning}</p>
          <p className="flex-1">[ii]
            {' '}
            <span className="font-serif italic text-bone">
              {offTheClock.onLoop.join(' and ')}
            </span>{' '}
            on loop.
          </p>
        </div>

        {/* <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="text-bone">{offTheClock.dota.hours.toLocaleString()}</span>
          <span className="text-accent">+</span> {offTheClock.dota.label}
        </p> */}
      </div>
    </section>
  )
}
