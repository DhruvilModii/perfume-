import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import { useEffect, useRef } from 'react'
import { PerfumeBottle } from '../atoms/PerfumeBottle'
import { WordsReveal } from '../atoms/TextReveal'
import { GlassCard } from '../atoms/GlassCard'
import { MagneticButton } from '../atoms/MagneticButton'

/**
 * Cinematic hero. The bottle sits center-stage on a lit dark stage,
 * with editorial typography splitting around it. As the user scrolls,
 * the entire scene transforms rather than merely translating up:
 *   - Bottle scales up and moves forward, catching more light
 *   - Headlines drift apart at slightly different speeds
 *   - Background aperture opens (radial glow expands, vignette softens)
 *   - Floating glass note-cards fade out
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  // Bottle-only progress (bottle keeps reacting a bit longer than the text)
  const bottleProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1])

  // Cursor parallax
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spx = useSpring(px, { damping: 30, stiffness: 120, mass: 0.6 })
  const spy = useSpring(py, { damping: 30, stiffness: 120, mass: 0.6 })

  useEffect(() => {
    const handle = (e: PointerEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const nx = (e.clientX - w / 2) / w
      const ny = (e.clientY - h / 2) / h
      px.set(nx)
      py.set(ny)
    }
    window.addEventListener('pointermove', handle, { passive: true })
    return () => window.removeEventListener('pointermove', handle)
  }, [px, py])

  // Convert normalised cursor to px transforms
  const bottleX = useTransform(spx, (v) => v * 30)
  const bottleY = useTransform(spy, (v) => v * 20)
  const headlineLeftX = useTransform(scrollYProgress, [0, 1], [0, -140])
  const headlineRightX = useTransform(scrollYProgress, [0, 1], [0, 140])
  const eyebrowY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const aperture = useTransform(scrollYProgress, [0, 1], [1, 1.6])
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[110vh] items-center justify-center overflow-hidden bg-ink-950"
    >
      {/* Ambient light aperture */}
      <motion.div
        aria-hidden
        style={{ scale: aperture }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.28),rgba(201,168,120,0.06)_38%,rgba(10,9,8,0)_70%)]" />
      </motion.div>

      {/* Light rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            'conic-gradient(from 210deg at 50% 40%, rgba(201,168,120,0.0) 0deg, rgba(201,168,120,0.10) 40deg, rgba(201,168,120,0.0) 70deg, rgba(201,168,120,0.0) 260deg, rgba(201,168,120,0.08) 305deg, rgba(201,168,120,0.0) 330deg)',
          filter: 'blur(30px)'
        }}
      />

      {/* Particles */}
      <Particles />

      {/* Grain + vignette */}
      <div className="grain absolute inset-0" />
      <div className="vignette absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 grid w-full max-w-7xl grid-cols-12 items-center gap-4 px-6 pt-28 md:pt-32">
        {/* Eyebrow */}
        <motion.div
          style={{ y: eyebrowY }}
          className="col-span-12 flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/70"
          >
            <span className="h-px w-10 bg-champagne-500/50" />
            The Art of Fragrance
            <span className="h-px w-10 bg-champagne-500/50" />
          </motion.div>
        </motion.div>

        {/* Headline row */}
        <div className="col-span-12 flex flex-col items-center">
          <motion.h1
            style={{ x: headlineLeftX }}
            className="mb-[-0.15em] w-full text-center font-display text-[16vw] font-light leading-[0.9] tracking-tightest text-bone-100 md:text-[10.5vw]"
          >
            <WordsReveal text="Wear the" delay={0.6} />
          </motion.h1>
          {/* Bottle stage sits between the two headline lines */}
          <div className="relative flex w-full items-center justify-center">
            <motion.div
              style={{ x: bottleX, y: bottleY }}
              className="relative z-10 mx-auto h-[62vh] w-[42vw] min-h-[420px] min-w-[220px] max-w-[520px]"
            >
              <PerfumeBottle scrollProgress={bottleProgress} />
            </motion.div>

            {/* Floating glass cards around the bottle */}
            <motion.div
              style={{ opacity: cardsOpacity, y: cardsY }}
              className="pointer-events-none absolute inset-0"
            >
              <FloatingCard
                className="left-[6%] top-[18%] hidden md:block"
                delay={1.1}
                title="Composition"
                lines={[
                  'Extrait de Parfum',
                  '24% concentration'
                ]}
              />
              <FloatingCard
                className="right-[6%] top-[10%] hidden md:block"
                delay={1.25}
                title="Sillage"
                lines={['Long lasting', '8 – 12 hours']}
                tint="warm"
              />
              <FloatingCard
                className="left-[10%] bottom-[8%] hidden md:block"
                delay={1.4}
                title="Origin"
                lines={['Grasse, France', 'Small batch']}
              />
              <FloatingCard
                className="right-[8%] bottom-[14%] hidden md:block"
                delay={1.55}
                title="No. 01"
                lines={['Nuit d’Ombre', 'Amber · Woody']}
                tint="warm"
              />
            </motion.div>
          </div>

          <motion.h1
            style={{ x: headlineRightX }}
            className="mt-[-0.05em] w-full text-center font-display text-[16vw] font-light italic leading-[0.9] tracking-tightest text-bone-100 md:text-[10.5vw]"
          >
            <WordsReveal
              text="Unforgettable."
              delay={0.9}
              wordClassName="text-champagne-400"
            />
          </motion.h1>
        </div>

        {/* Bottom row: CTA + strap */}
        <div className="col-span-12 mt-8 flex flex-col items-center gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p className="max-w-sm text-center font-light leading-relaxed text-bone-300 md:text-left">
            Slow-crafted parfums from Grasse. A dark, resinous chapter for those
            who prefer to be
            <em className="not-italic text-champagne-400"> remembered</em>.
          </p>
          <div className="flex items-center gap-3">
            <MagneticButton variant="primary">Discover Scent</MagneticButton>
            <MagneticButton variant="ghost">The Story</MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        style={{ opacity: scrollHintOpacity }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-100/60"
      >
        <span>Scroll</span>
        <span className="relative block h-8 w-px overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 block h-3 w-px bg-champagne-400"
            animate={{ y: ['-100%', '260%'] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </span>
      </motion.div>
    </section>
  )
}

function FloatingCard({
  className,
  delay,
  title,
  lines,
  tint = 'neutral'
}: {
  className?: string
  delay: number
  title: string
  lines: string[]
  tint?: 'neutral' | 'warm'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className ?? ''}`}
    >
      <GlassCard tint={tint} className="w-[210px] p-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest2 text-champagne-400">
          <span className="h-px w-3 bg-champagne-500/60" />
          {title}
        </div>
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              i === 0
                ? 'font-display text-lg text-bone-100'
                : 'font-mono text-[10px] tracking-widest2 text-bone-300/70'
            }
          >
            {l}
          </div>
        ))}
      </GlassCard>
    </motion.div>
  )
}

function Particles() {
  // Deterministic pseudo-random for consistent SSR-friendly output.
  const dots = Array.from({ length: 28 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 73) % 100,
    size: 1 + ((i * 13) % 3),
    delay: (i % 10) * 0.4,
    duration: 8 + ((i * 7) % 8)
  }))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-champagne-400/70"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            boxShadow: '0 0 6px rgba(224,201,154,0.6)'
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.0, 0.6, 0.0]
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}
