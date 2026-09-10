import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MagneticButton } from '../atoms/MagneticButton'
import { PerfumeBottle } from '../atoms/PerfumeBottle'
import { WordsReveal } from '../atoms/TextReveal'

/**
 * Big emotional final beat before the footer. Huge editorial question with
 * a soft-lit bottle floating alongside the type. Two lines of scroll-linked
 * parallax give the section its own atmosphere.
 */
export function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const bottleY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const bgY = useTransform(scrollYProgress, [0, 1], ['-8%', '12%'])
  const smokeY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-40"
    >
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute left-1/2 top-1/2 -z-0 h-[95vmin] w-[95vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.20),transparent_70%)] blur-3xl"
      />

      {/* Abstract smoke wisps */}
      <motion.svg
        aria-hidden
        style={{ y: smokeY }}
        viewBox="0 0 1200 600"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wisp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a878" stopOpacity="0" />
            <stop offset="50%" stopColor="#c9a878" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a878" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${120 + i * 90} C 300 ${80 + i * 60}, 900 ${180 + i * 60}, 1200 ${100 + i * 90}`}
            stroke="url(#wisp)"
            strokeWidth={0.5 + i * 0.2}
            fill="none"
          />
        ))}
      </motion.svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-8 px-6">
        <div className="col-span-12 md:col-span-8">
          <div className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
            <span>04</span>
            <span className="h-px w-16 bg-champagne-500/40" />
            An Invitation
          </div>
          <h2 className="font-display text-[13vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[8.5vw]">
            <div className="overflow-hidden pr-2">
              <WordsReveal text="What will" />
            </div>
            <div className="overflow-hidden pr-2 italic text-champagne-400">
              <WordsReveal text="they" delay={0.1} />{' '}
              <WordsReveal text="remember?" delay={0.2} />
            </div>
          </h2>
          <p className="mt-10 max-w-md font-light leading-relaxed text-bone-300">
            Choose a fragrance that becomes part of your story. Every Maison
            Noir parfum is numbered, signed, and delivered in a small oak box
            with a handwritten note from the perfumer.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton variant="primary">Explore the Collection</MagneticButton>
            <MagneticButton variant="ghost">Book a fitting</MagneticButton>
          </div>
        </div>

        <div className="col-span-12 flex justify-center md:col-span-4">
          <motion.div
            style={{ y: bottleY }}
            className="relative h-[70vh] w-[70vw] max-w-[380px]"
          >
            <PerfumeBottle scrollProgress={scrollYProgress} floating />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
