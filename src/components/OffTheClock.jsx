import { offTheClock } from '../data/portfolio'

export default function OffTheClock() {
  return (
    <section aria-label="Off the clock" className="border-y border-line">
      <div className="shell flex flex-col gap-6 py-9 lg:flex-row lg:items-baseline lg:gap-10 lg:py-8">
        <span className="eyebrow shrink-0 !text-accent lg:pt-px">Off the clock</span>

        <div className="flex flex-1 flex-col gap-4 text-[15px] leading-relaxed text-muted sm:flex-row sm:gap-10 sm:text-base">
          <p className="flex-1">{offTheClock.learning}</p>
          <p className="flex-1">
            Lately{' '}
            <span className="font-serif italic text-bone">
              {offTheClock.onLoop.join(' and ')}
            </span>{' '}
            on loop.
          </p>
        </div>

        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="text-bone">{offTheClock.dota.hours.toLocaleString()}</span>
          <span className="text-accent">+</span> {offTheClock.dota.label}
        </p>
      </div>
    </section>
  )
}
