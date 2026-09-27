import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { signatureFragrance } from '../../data/products'
import { MagneticButton } from '../atoms/MagneticButton'
import { PerfumeBottle } from '../atoms/PerfumeBottle'
import { WordsReveal } from '../atoms/TextReveal'

export function SignatureFragrance() {
  const navigate = useNavigate()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const bottleY = useTransform(scrollYProgress, [0, 1], [80, -120])
  const bottleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.04, 1.02])
  const bgGlow = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.6])
  const infoX = useTransform(scrollYProgress, [0, 0.5], [40, 0])
  const infoOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1])
  const numberY = useTransform(scrollYProgress, [0, 1], [40, -60])
  const backdropWord = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])

  const f = signatureFragrance

  return (
    <section
      ref={ref}
      className="relative min-h-[130vh] overflow-hidden bg-ink-900"
    >
      {/* Editorial giant word behind everything */}
      <motion.div
        aria-hidden
        style={{ x: backdropWord, opacity: bgGlow }}
        className="pointer-events-none absolute left-0 top-24 z-0 select-none whitespace-nowrap font-display text-[36vw] leading-none tracking-tightest text-bone-100/[0.03]"
      >
        SIGNATURE·SIGNATURE
      </motion.div>

      {/* Warm ambient glow */}
      <motion.div
        aria-hidden
        style={{ opacity: bgGlow }}
        className="absolute right-[-10%] top-[10%] -z-0 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.22),transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto grid min-h-[130vh] w-full max-w-7xl grid-cols-12 items-center gap-8 px-6 py-24">
        {/* Left column — index + name */}
        <div className="col-span-12 md:col-span-4">
          <motion.div
            style={{ y: numberY }}
            className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400"
          >
            <span className="text-6xl font-light not-italic text-bone-100/25 md:text-8xl">
              {f.index}
            </span>
            <span>Signature</span>
          </motion.div>

          <h3 className="mt-6 font-display text-6xl italic leading-[0.95] text-bone-100 md:text-7xl">
            <WordsReveal text={f.name} />
          </h3>

          <div className="mt-3 font-mono text-[11px] uppercase tracking-widest2 text-bone-300/70">
            <WordsReveal text={f.tagline} />
          </div>

          <p className="mt-8 max-w-sm font-light leading-relaxed text-bone-300">
            {f.description}
          </p>

          {/* Meta */}
          <motion.div
            style={{ opacity: infoOpacity, x: infoX }}
            className="mt-10 space-y-3 border-l border-champagne-500/25 pl-5"
          >
            <MetaRow k="Category" v={f.category} />
            <MetaRow k="Concentration" v="Extrait de Parfum" />
            <MetaRow k="Sillage" v="Long lasting · 8–12 hrs" />
            <MetaRow k="Origin" v="Grasse · France" />
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div>
              <div className="font-display text-4xl text-bone-100">
                {f.currency}
                {f.sizes[1] ? f.sizes[1].price.toLocaleString('en-IN') : f.sizes[0].price.toLocaleString('en-IN')}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                {f.sizes[1] ? f.sizes[1].ml : f.sizes[0].ml} ML · incl. taxes
              </div>
            </div>
            <MagneticButton
              variant="primary"
              onClick={() => navigate(`/fragrances/${f.slug}`)}
            >
              Discover Fragrance
            </MagneticButton>
          </div>
        </div>

        {/* Center bottle stage */}
        <div className="col-span-12 flex items-center justify-center md:col-span-4">
          <motion.div
            style={{ y: bottleY, scale: bottleScale }}
            className="relative h-[70vh] w-full max-w-[400px]"
            data-cursor="product"
            data-cursor-label="Signature"
          >
            <PerfumeBottle
              scrollProgress={scrollYProgress}
              accent={f.accent}
            />
          </motion.div>
        </div>

        {/* Right column — notes composition */}
        <div className="col-span-12 md:col-span-4">
          <NotesTree
            top={f.topNotes}
            heart={f.heartNotes}
            base={f.baseNotes}
            accent={f.accent}
          />
        </div>
      </div>

      {/* Bottom marquee — the perfumer's letter */}
      <div className="relative z-10 overflow-hidden border-y border-bone-100/10 py-6">
        <div className="marquee-track flex whitespace-nowrap font-display text-3xl italic text-bone-100/50">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              {[
                'Slow parfumerie',
                '·',
                'Single origin',
                '·',
                'Small batch',
                '·',
                'Aged 90 days',
                '·',
                'Hand poured',
                '·',
                'Numbered'
              ].map((t, j) => (
                <span key={`${i}-${j}`}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
        {k}
      </span>
      <span className="text-sm text-bone-100/90">{v}</span>
    </div>
  )
}

function NotesTree({
  top,
  heart,
  base,
  accent
}: {
  top: string[]
  heart: string[]
  base: string[]
  accent: string
}) {
  const groups = [
    { label: 'Top', notes: top },
    { label: 'Heart', notes: heart },
    { label: 'Base', notes: base }
  ]
  return (
    <div className="relative space-y-8">
      <div
        aria-hidden
        className="absolute left-3 top-2 h-full w-px bg-gradient-to-b from-champagne-500/60 via-champagne-500/20 to-transparent"
      />
      {groups.map((g, i) => (
        <motion.div
          key={g.label}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 1,
            delay: i * 0.15,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="relative pl-10"
        >
          <span
            className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-champagne-500/50"
            style={{ background: `radial-gradient(closest-side, ${accent}55, transparent)` }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
          </span>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
            {g.label} Notes
          </div>
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-display text-xl leading-tight text-bone-100">
            {g.notes.map((n, j) => (
              <span key={n} className="inline-flex items-center gap-2">
                <span>{n}</span>
                {j < g.notes.length - 1 && (
                  <span className="text-bone-300/40">·</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
