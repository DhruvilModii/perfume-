import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { PerfumeBottle } from '../atoms/PerfumeBottle'
import { fragrances } from '../../data/products'

/**
 * A long, near-black passage. The user scrolls into what feels like a void,
 * then a single bottle slowly emerges from the dark, layered with notes,
 * the name, price, and finally a CTA. No copy explains the beat.
 */
export function SurpriseReveal() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })

  // Emergence choreography
  const bottleOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1])
  const bottleY = useTransform(scrollYProgress, [0, 0.5], [80, 0])
  const bottleScale = useTransform(scrollYProgress, [0, 0.55], [0.75, 1])
  const bottleBlur = useTransform(scrollYProgress, [0.05, 0.35], [16, 0])
  const bottleFilter = useTransform(bottleBlur, (v) => `blur(${v}px)`)

  const auraOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])
  const auraScale = useTransform(scrollYProgress, [0.1, 0.85], [0.6, 1.2])

  const notesTop = useTransform(scrollYProgress, [0.4, 0.55], [0, 1])
  const notesHeart = useTransform(scrollYProgress, [0.5, 0.65], [0, 1])
  const notesBase = useTransform(scrollYProgress, [0.6, 0.75], [0, 1])

  const nameOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])
  const nameLetterSp = useTransform(scrollYProgress, [0.55, 0.85], [0.5, 0])
  const priceOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.8, 0.95], [16, 0])

  const f = fragrances[3] // Cuir de Minuit — dark, mysterious, fits the scene

  const nameLetterSpacing = useTransform(nameLetterSp, (v) => `${v}em`)

  return (
    <section
      ref={ref}
      className="relative bg-ink-950"
      style={{ height: '260vh' }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-ink-950">
        {/* Ambient emerging aura */}
        <motion.div
          aria-hidden
          style={{ opacity: auraOpacity, scale: auraScale }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `radial-gradient(closest-side, ${f.accent}45, ${f.accent}10 40%, rgba(10,9,8,0) 70%)`,
              filter: 'blur(20px)'
            }}
          />
        </motion.div>

        {/* Bottle */}
        <motion.div
          style={{
            opacity: bottleOpacity,
            y: bottleY,
            scale: bottleScale,
            filter: bottleFilter
          }}
          className="relative z-10 h-[80vh] w-[46vw] min-w-[280px] max-w-[440px]"
        >
          <PerfumeBottle accent={f.accent} floating scrollProgress={scrollYProgress} />
        </motion.div>

        {/* Floating note callouts around the bottle */}
        <FloatingNoteRow
          progress={notesTop}
          className="left-[8%] top-[22%]"
          side="left"
          label="Top"
          notes={f.topNotes}
          accent={f.accent}
        />
        <FloatingNoteRow
          progress={notesHeart}
          className="right-[8%] top-[38%]"
          side="right"
          label="Heart"
          notes={f.heartNotes}
          accent={f.accent}
        />
        <FloatingNoteRow
          progress={notesBase}
          className="left-[10%] bottom-[22%]"
          side="left"
          label="Base"
          notes={f.baseNotes}
          accent={f.accent}
        />

        {/* Name overlay */}
        <motion.div
          style={{ opacity: nameOpacity }}
          className="pointer-events-none absolute inset-x-0 top-16 z-10 text-center"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-100/60">
            No. {f.index} · {f.category}
          </div>
          <motion.h3
            style={{ letterSpacing: nameLetterSpacing }}
            className="mt-3 font-display text-6xl italic leading-none text-bone-100 md:text-8xl"
          >
            {f.name}
          </motion.h3>
        </motion.div>

        {/* Price + CTA */}
        <motion.div
          style={{ opacity: priceOpacity }}
          className="absolute inset-x-0 bottom-24 z-10 flex flex-col items-center gap-3 md:bottom-32"
        >
          <div className="font-display text-4xl text-bone-100">
            {f.currency}
            {(f.sizes[1] ?? f.sizes[0]).price.toLocaleString('en-IN')}
            <span className="ml-3 font-mono text-[10px] tracking-widest2 text-bone-300/60">
              {(f.sizes[1] ?? f.sizes[0]).ml} ML
            </span>
          </div>
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex flex-col items-center gap-3"
          >
            <a
              href="#contact"
              data-cursor="button"
              className="group flex items-center gap-3 rounded-full border border-champagne-500/60 bg-champagne-500/10 px-6 py-3 font-mono text-[11px] uppercase tracking-widest2 text-bone-100 backdrop-blur transition hover:bg-champagne-500/20"
            >
              Reserve a bottle
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7h11m0 0L8 3m4 4L8 11"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </a>
            <span className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
              Numbered · signed · shipped in oak
            </span>
          </motion.div>
        </motion.div>

        {/* Fine grain */}
        <div aria-hidden className="grain absolute inset-0" />
      </div>
    </section>
  )
}

function FloatingNoteRow({
  progress,
  className,
  label,
  notes,
  accent,
  side
}: {
  progress: import('framer-motion').MotionValue<number>
  className?: string
  label: string
  notes: string[]
  accent: string
  side: 'left' | 'right'
}) {
  const x = useTransform(progress, [0, 1], [side === 'left' ? -40 : 40, 0])
  return (
    <motion.div
      style={{ opacity: progress, x }}
      className={`pointer-events-none absolute z-10 max-w-[260px] ${
        side === 'right' ? 'text-right' : 'text-left'
      } ${className ?? ''}`}
    >
      <div
        className={`mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest2 ${
          side === 'right' ? 'justify-end' : ''
        }`}
        style={{ color: accent }}
      >
        {side === 'right' && <span>{label}</span>}
        <span className="inline-block h-px w-8" style={{ background: accent }} />
        {side === 'left' && <span>{label}</span>}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1 font-display text-xl italic text-bone-100/90 md:text-2xl">
        {notes.map((n, i) => (
          <span key={n}>
            {n}
            {i < notes.length - 1 && (
              <span className="ml-2 text-bone-300/40">·</span>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
