import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { fragrances } from '../../data/products'
import { WordsReveal } from '../atoms/TextReveal'

/**
 * Vertical scroll drives a horizontal track through the collection.
 * The section is tall (400vh); inside, a sticky viewport translates the
 * horizontal track. Every card owns its own micro-interactions on hover.
 */
export function HorizontalCollection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })

  // The track holds N cards, ~85vw each, so the total horizontal travel is
  // (N * cardWidth) - viewport. We approximate to move -68% overall.
  const x = useTransform(scrollYProgress, [0, 1], ['3%', '-72%'])

  // Progress readouts
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={ref}
      id="fragrances"
      className="relative"
      style={{ height: `${100 + fragrances.length * 55}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-ink-950">
        {/* Section header */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between px-6 pt-24 md:pt-28">
          <div>
            <div className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
              <span>03</span>
              <span className="h-px w-16 bg-champagne-500/40" />
              The Collection
            </div>
            <h3 className="font-display text-6xl leading-[0.95] tracking-tightest text-bone-100 md:text-8xl">
              <WordsReveal text="Explore the" />
              <br />
              <span className="italic text-champagne-400">
                <WordsReveal text="Anthology." delay={0.15} />
              </span>
            </h3>
          </div>
          <div className="hidden max-w-xs pb-4 md:block">
            <p className="text-right font-light leading-relaxed text-bone-300">
              Five compositions. Five chapters. Read them at your own pace.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mx-auto mt-8 w-full max-w-7xl px-6">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
            <span>01</span>
            <div className="relative h-px flex-1 bg-bone-100/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-champagne-400"
                style={{ width: progressWidth }}
              />
            </div>
            <span>{String(fragrances.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex items-center gap-8 pl-6 pr-24 will-change-transform md:gap-14 md:pl-[10vw]"
          >
            {fragrances.map((f, i) => (
              <CollectionCard key={f.id} f={f} index={i} />
            ))}
            {/* Closing panel */}
            <ClosingPanel />
          </motion.div>

          {/* Vignette on edges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent"
          />
        </div>
      </div>
    </section>
  )
}

function CollectionCard({
  f,
  index
}: {
  f: (typeof fragrances)[number]
  index: number
}) {
  const isTall = index % 2 === 0
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={`shrink-0 ${
        isTall ? 'h-[70vh] w-[62vw] md:w-[38vw]' : 'h-[62vh] w-[62vw] md:w-[34vw]'
      }`}
    >
    <Link
      to={`/fragrances/${f.slug}`}
      className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-bone-100/10 bg-ink-900/70 backdrop-blur-xl"
      data-cursor="product"
      data-cursor-label="View"
    >
      {/* Image */}
      <motion.div
        variants={{
          rest: { scale: 1.02 },
          hover: { scale: 1.08 }
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={f.image}
          alt={f.name}
          loading="lazy"
          className="h-full w-full object-cover opacity-80 [filter:contrast(1.05)_saturate(0.85)]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.55) 55%, rgba(10,9,8,0.95) 100%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-70 mix-blend-multiply"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${f.accent}22, transparent 60%)`
          }}
        />
      </motion.div>

      {/* Top row */}
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-bone-100/70">
          No. {f.index}
        </span>
        <span
          className="rounded-full border border-bone-100/15 px-3 py-1 font-mono text-[9px] uppercase tracking-widest2 text-bone-100/70 backdrop-blur"
          style={{ background: `${f.accent}11` }}
        >
          {f.category}
        </span>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h4 className="font-display text-4xl leading-tight text-bone-100 md:text-5xl">
            {f.name}
          </h4>
          <motion.span
            variants={{
              rest: { opacity: 0, x: -6 },
              hover: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.5 }}
            className="hidden font-mono text-[10px] uppercase tracking-widest2 text-champagne-400 md:inline"
          >
            View →
          </motion.span>
        </div>
        <p className="mb-5 max-w-md font-light leading-relaxed text-bone-300/80">
          {f.tagline}. {f.description.split('.')[0]}.
        </p>
        <div className="flex items-end justify-between border-t border-bone-100/10 pt-4">
          <div>
            <div className="font-display text-2xl text-bone-100">
              {f.currency}
              {f.sizes[0].price.toLocaleString('en-IN')}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
              {f.sizes[0].ml} ML
            </div>
          </div>
          <motion.div
            variants={{
              rest: { y: 0 },
              hover: { y: -4 }
            }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-champagne-500/50 text-champagne-400"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12m0 0L8 2m5 5l-5 5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Hairline */}
      <span className="pointer-events-none absolute inset-x-6 top-1/2 h-px bg-gradient-to-r from-transparent via-champagne-400/25 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
    </Link>
    </motion.div>
  )
}

function ClosingPanel() {
  return (
    <div className="flex h-[62vh] w-[70vw] shrink-0 flex-col items-center justify-center gap-6 rounded-xl border border-bone-100/10 bg-ink-900/60 p-10 text-center md:w-[36vw]">
      <span className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Fin
      </span>
      <h4 className="font-display text-5xl italic leading-tight text-bone-100">
        The full anthology
      </h4>
      <p className="max-w-xs font-light leading-relaxed text-bone-300">
        Five parfums, unnumbered testers, and one letter from the perfumer.
      </p>
      <Link
        to="/fragrances"
        data-cursor="button"
        className="mt-4 inline-flex items-center gap-2 border-b border-champagne-500/60 pb-1 font-mono text-[11px] uppercase tracking-widest2 text-bone-100"
      >
        Read the anthology
      </Link>
    </div>
  )
}
