import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * A quiet, dark chapter. Huge editorial typography animates in line by line
 * with individual scroll-linked blur & translate. Space is the design.
 */
export function BrandStatement() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '15%'])
  const eyebrowOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])
  const bottomOpacity = useTransform(scrollYProgress, [0.55, 0.8], [0, 1])

  const lines = ['Fragrance', 'is not seen.', 'It is', 'remembered.']

  return (
    <section
      ref={ref}
      id="about"
      className="relative flex min-h-[100vh] items-center overflow-hidden bg-ink-950 py-32"
    >
      {/* Soft moving warmth */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute left-1/2 top-1/2 -z-0 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.12),transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* Eyebrow */}
        <motion.div
          style={{ opacity: eyebrowOpacity }}
          className="mb-16 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60"
        >
          <span>02</span>
          <span className="h-px w-16 bg-champagne-500/40" />
          Manifesto
        </motion.div>

        {/* Lines */}
        <div className="space-y-2 md:space-y-4">
          {lines.map((line, i) => (
            <StatementLine
              key={i}
              index={i}
              text={line}
              progress={scrollYProgress}
              italic={i === 1 || i === 3}
            />
          ))}
        </div>

        {/* Signoff */}
        <motion.div
          style={{ opacity: bottomOpacity }}
          className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <p className="max-w-md font-light leading-relaxed text-bone-300 md:col-span-2">
            Every Maison Noir composition is layered like a private letter —
            written slowly, sealed with wax, unopened until the right moment.
            We use raw materials sourced from a small circle of growers in
            Grasse, Kannauj, and Bulgaria, and we let the parfum rest for a
            full moon before it leaves us.
          </p>
          <div className="flex flex-col items-start justify-end gap-2 md:items-end">
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              Est. 2024
            </span>
            <span className="font-display text-2xl italic text-bone-100">
              — the perfumer
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatementLine({
  text,
  index,
  progress,
  italic
}: {
  text: string
  index: number
  progress: import('framer-motion').MotionValue<number>
  italic?: boolean
}) {
  // Each line reveals at a slightly different scroll offset
  const start = 0.15 + index * 0.09
  const end = start + 0.28

  const y = useTransform(progress, [start, end], [80, 0])
  const opacity = useTransform(progress, [start, end], [0, 1])
  const blur = useTransform(progress, [start, end], [14, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)

  return (
    <div className="overflow-hidden">
      <motion.h2
        style={{ y, opacity, filter }}
        className={`font-display text-[14vw] leading-[0.95] tracking-tightest text-bone-100 md:text-[9vw] ${
          italic ? 'italic text-bone-100/80' : ''
        }`}
      >
        {text}
      </motion.h2>
    </div>
  )
}
