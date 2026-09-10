import {
  motion,
  MotionValue,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/atoms/GlassCard'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { PerfumeBottle } from '../components/atoms/PerfumeBottle'
import { TextReveal, WordsReveal } from '../components/atoms/TextReveal'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BrandStory />
      <CinematicImageStory />
      <Philosophy />
      <Craftsmanship />
      <Ingredients />
      <People />
      <Values />
      <AboutSurprise />
      <ClosingStatement />
    </>
  )
}

/* ---------------------------------------------------------------- HERO --- */

function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const eyebrowY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.85])

  // Cursor parallax on bottle
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spx = useSpring(px, { damping: 30, stiffness: 120 })
  const spy = useSpring(py, { damping: 30, stiffness: 120 })
  useEffect(() => {
    const h = (e: PointerEvent) => {
      px.set((e.clientX - window.innerWidth / 2) / window.innerWidth)
      py.set((e.clientY - window.innerHeight / 2) / window.innerHeight)
    }
    window.addEventListener('pointermove', h, { passive: true })
    return () => window.removeEventListener('pointermove', h)
  }, [px, py])

  const bx = useTransform(spx, (v) => v * 40)
  const by = useTransform(spy, (v) => v * 24)

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100vh] items-center overflow-hidden bg-ink-950 pt-24"
    >
      {/* Atmospheric image backdrop */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        aria-hidden
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1615368144592-35d9fe3a52f9?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover opacity-30 [filter:contrast(1.05)_saturate(0.8)_brightness(0.7)]"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/50 to-ink-950"
        />
      </motion.div>

      {/* Fog wisps */}
      <FogWisps />

      <div className="grain absolute inset-0" />
      <div className="vignette absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6 px-6">
        <div className="col-span-12 md:col-span-8">
          <motion.div
            style={{ y: eyebrowY }}
            className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/70"
          >
            <span className="h-px w-10 bg-champagne-500/50" />
            The Story Behind the Scent
          </motion.div>
          <motion.h1
            style={{ y: headlineY }}
            className="font-display text-[14vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[9.5vw]"
          >
            <div className="overflow-hidden">
              <WordsReveal text="More than" />
            </div>
            <div className="overflow-hidden italic text-champagne-400">
              <WordsReveal text="a fragrance." delay={0.15} />
            </div>
          </motion.h1>
          <TextReveal delay={0.7} as="p" className="mt-10 block max-w-lg">
            <span className="font-light leading-relaxed text-bone-300">
              A small parfumerie house working between Grasse and Bombay,
              writing letters in cedar, iris, oud, and salt. This is the
              philosophy that shapes every bottle we number and send.
            </span>
          </TextReveal>
        </div>

        <div className="col-span-12 flex justify-center md:col-span-4">
          <motion.div
            style={{ x: bx, y: by }}
            className="relative h-[52vh] w-[70vw] max-w-[300px]"
          >
            <PerfumeBottle floating />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-100/60">
        <span>Chapter One</span>
        <span className="relative block h-8 w-px overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 block h-3 w-px bg-champagne-400"
            animate={{ y: ['-100%', '260%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- BRAND STORY --- */

function BrandStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const lines = [
    { text: 'Every fragrance begins', italic: false },
    { text: 'with a feeling.', italic: true },
    { text: 'A memory.', italic: false },
    { text: 'An atmosphere.', italic: true },
    { text: 'A moment —', italic: false },
    { text: 'and the desire', italic: false },
    { text: 'to preserve it.', italic: true }
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-40"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
          <span>01</span>
          <span className="h-px w-16 bg-champagne-500/40" />
          The Story
        </div>
        <div className="space-y-3 md:space-y-4">
          {lines.map((l, i) => (
            <StoryLine
              key={i}
              index={i}
              text={l.text}
              progress={scrollYProgress}
              italic={l.italic}
              total={lines.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StoryLine({
  index,
  total,
  text,
  progress,
  italic
}: {
  index: number
  total: number
  text: string
  progress: MotionValue<number>
  italic?: boolean
}) {
  const start = 0.1 + (index / total) * 0.55
  const end = start + 0.18
  const y = useTransform(progress, [start, end], [50, 0])
  const opacity = useTransform(progress, [start, end], [0, 1])
  const blur = useTransform(progress, [start, end], [10, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)
  return (
    <div className="overflow-hidden">
      <motion.p
        style={{ y, opacity, filter }}
        className={`font-display leading-[1.05] tracking-tightest text-bone-100 ${
          italic ? 'italic text-champagne-400' : ''
        } text-4xl md:text-6xl lg:text-7xl`}
      >
        {text}
      </motion.p>
    </div>
  )
}

/* ------------------------------------------ CINEMATIC IMAGE STORY --- */

function CinematicImageStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.3])
  const glassX = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const light = useTransform(scrollYProgress, [0, 1], [0.2, 0.8])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-900 py-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 px-6">
        <div className="col-span-12 mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
          <span>02</span>
          <span className="h-px w-16 bg-champagne-500/40" />
          The Atelier
        </div>
        <div className="col-span-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-bone-100/10">
            <motion.img
              style={{ scale }}
              src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=2000&q=80"
              alt="A parfumer's studio at dusk"
              className="h-full w-full object-cover opacity-70"
            />
            <motion.div
              style={{ opacity: light }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,120,0.35),transparent_60%)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />

            {/* Floating glass panel */}
            <motion.div
              style={{ x: glassX }}
              className="absolute bottom-8 left-8 max-w-sm md:bottom-12 md:left-12"
            >
              <GlassCard tint="deep" className="p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                  Atelier · Grasse
                </div>
                <div className="mt-3 font-display text-2xl italic text-bone-100">
                  A studio kept at 18°C, in soft light.
                </div>
                <div className="mt-2 font-light text-bone-300/80">
                  Where accords rest for weeks before we listen to them again.
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating meta */}
            <motion.div
              style={{ y: textY }}
              className="absolute right-6 top-6 hidden text-right font-mono text-[10px] uppercase tracking-widest2 text-bone-100/70 md:block"
            >
              <div>Latitude 43.6584° N</div>
              <div>Longitude 6.9251° E</div>
              <div className="mt-2 text-champagne-400">— Batch No. 24/03</div>
            </motion.div>

            {/* Hairline */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-400/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------- PHILOSOPHY --- */

const principles = [
  {
    key: 'craft',
    title: 'Craft',
    body: 'We obsess over every detail. A macerated tincture. A sanded cap. A collar checked twice.'
  },
  {
    key: 'memory',
    title: 'Memory',
    body: 'Because the strongest fragrances become memories. We compose for the years that come.'
  },
  {
    key: 'identity',
    title: 'Identity',
    body: 'A scent should feel like you — never like everyone. We keep the batches small on purpose.'
  },
  {
    key: 'expression',
    title: 'Expression',
    body: 'Fragrance is another form of self-expression. Choose the sentence you wear.'
  }
]

function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
              <span>03</span>
              <span className="h-px w-16 bg-champagne-500/40" />
              Philosophy
            </div>
            <h2 className="font-display text-6xl leading-[0.95] tracking-tightest text-bone-100 md:text-7xl">
              <TextReveal>We believe</TextReveal>
              <br />
              <TextReveal delay={0.1}>scent should</TextReveal>
              <br />
              <TextReveal delay={0.2}>
                <span className="italic text-champagne-400">say something.</span>
              </TextReveal>
            </h2>
          </div>
          <div className="col-span-12 max-w-md md:col-span-6 md:col-start-7">
            <TextReveal
              as="p"
              delay={0.3}
              className="block leading-relaxed text-bone-300"
            >
              Our house rests on four quiet principles. They govern the paper
              we print on, the raw materials we buy, and every note we choose
              to keep or discard.
            </TextReveal>
          </div>
        </div>

        {/* Asymmetric principle cards */}
        <div className="relative grid grid-cols-12 gap-4 md:gap-6">
          <PrincipleCard
            i={0}
            className="col-span-12 md:col-span-5 md:col-start-1 md:mt-6"
            rot={-1.5}
            p={principles[0]}
          />
          <PrincipleCard
            i={1}
            className="col-span-12 md:col-span-6 md:col-start-7 md:mt-24"
            rot={1.2}
            p={principles[1]}
          />
          <PrincipleCard
            i={2}
            className="col-span-12 md:col-span-6 md:col-start-2 md:mt-6"
            rot={0.6}
            p={principles[2]}
          />
          <PrincipleCard
            i={3}
            className="col-span-12 md:col-span-5 md:col-start-8"
            rot={-0.8}
            p={principles[3]}
          />
        </div>
      </div>
    </section>
  )
}

function PrincipleCard({
  i,
  p,
  className = '',
  rot
}: {
  i: number
  p: (typeof principles)[number]
  className?: string
  rot: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  // Local pointer tilt
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rxs = useSpring(rx, { stiffness: 90, damping: 15 })
  const rys = useSpring(ry, { stiffness: 90, damping: 15 })

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    ry.set(nx * 8)
    rx.set(-ny * 8)
  }
  const handleLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotate: rot }}
      animate={inView ? { opacity: 1, y: 0, rotate: rot } : {}}
      transition={{
        duration: 1.1,
        delay: 0.1 + i * 0.12,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 800 }}
      className={className}
    >
      <motion.div
        style={{ rotateX: rxs, rotateY: rys }}
        className="[transform-style:preserve-3d]"
      >
        <GlassCard tint={i % 2 === 0 ? 'warm' : 'neutral'} className="p-8 md:p-10">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              0{i + 1} · {p.title.toUpperCase()}
            </span>
            <span className="font-mono text-[10px] text-bone-300/40">MN</span>
          </div>
          <h3 className="font-display text-4xl italic leading-tight text-bone-100 md:text-5xl">
            {p.title}
          </h3>
          <p className="mt-4 max-w-md leading-relaxed text-bone-300/85">
            {p.body}
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-champagne-500/40 to-transparent" />
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

/* ---------------------------------------------- CRAFTSMANSHIP --- */

const craftSteps = [
  {
    n: '01',
    title: 'Select',
    body: 'We handpick tinctures and absolutes from a small circle of growers we know by name.'
  },
  {
    n: '02',
    title: 'Blend',
    body: 'Trials are drawn in glass and cedar. Never more than five accords at a time.'
  },
  {
    n: '03',
    title: 'Balance',
    body: 'A parfum rests for a full moon between iterations. We listen more than we adjust.'
  },
  {
    n: '04',
    title: 'Bottle',
    body: 'Each flacon is hand-numbered, wax-sealed, and signed by the perfumer.'
  },
  {
    n: '05',
    title: 'Experience',
    body: 'Delivered in oak, opened slowly — the ritual is part of the fragrance.'
  }
]

function Craftsmanship() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, craftSteps.length]
  )
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    return activeIndex.on('change', (v) => {
      const idx = Math.min(craftSteps.length - 1, Math.max(0, Math.floor(v)))
      setCurrent(idx)
    })
  }, [activeIndex])

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${(craftSteps.length + 1) * 90}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-ink-900">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between px-6 pt-24 md:pt-28">
          <div>
            <div className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
              <span>04</span>
              <span className="h-px w-16 bg-champagne-500/40" />
              The Making
            </div>
            <h2 className="font-display text-5xl leading-[0.95] tracking-tightest text-bone-100 md:text-7xl">
              How a parfum <br />
              <span className="italic text-champagne-400">is written.</span>
            </h2>
          </div>
          <div className="hidden max-w-xs pb-3 text-right md:block">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
              Chapter {String(current + 1).padStart(2, '0')} of{' '}
              {String(craftSteps.length).padStart(2, '0')}
            </div>
            <div className="mt-1 font-display text-2xl italic text-bone-100/80">
              {craftSteps[current].title}
            </div>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-12 items-center gap-6 px-6">
          {/* Massive number */}
          <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-outline whitespace-nowrap font-display text-[42vw] leading-none italic md:text-[36vw]"
            >
              {craftSteps[current].n}
            </motion.div>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-1">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400">
              Step {craftSteps[current].n}
            </div>
            <motion.h3
              key={`title-${current}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-6xl italic leading-[0.95] text-bone-100 md:text-8xl"
            >
              {craftSteps[current].title}
            </motion.h3>
            <motion.p
              key={`body-${current}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="mt-6 max-w-md leading-relaxed text-bone-300"
            >
              {craftSteps[current].body}
            </motion.p>
          </div>

          {/* Step list */}
          <ol className="col-span-12 md:col-span-4 md:col-start-9">
            {craftSteps.map((s, i) => {
              const active = i === current
              return (
                <li
                  key={s.n}
                  className={`group flex items-center gap-4 border-b border-bone-100/10 py-4 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                    active ? 'text-champagne-400' : 'text-bone-100/50'
                  }`}
                >
                  <span>{s.n}</span>
                  <span
                    className={`h-px flex-1 transition-all duration-500 ${
                      active ? 'bg-champagne-400' : 'bg-bone-100/15'
                    }`}
                  />
                  <span className={active ? 'text-bone-100' : ''}>
                    {s.title}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="grain absolute inset-0" />
      </div>
    </section>
  )
}

/* ------------------------------------------------ INGREDIENTS --- */

const ingredients = [
  { name: 'Bergamot', family: 'Citrus', hex: '#c9a878', size: 'lg' },
  { name: 'Oud', family: 'Resin', hex: '#8a6a4a', size: 'xl' },
  { name: 'Rose', family: 'Floral', hex: '#b06655', size: 'md' },
  { name: 'Amber', family: 'Resin', hex: '#d4b48a', size: 'lg' },
  { name: 'Musk', family: 'Animalic', hex: '#a09585', size: 'md' },
  { name: 'Saffron', family: 'Spice', hex: '#c26a3a', size: 'sm' },
  { name: 'Vanilla', family: 'Absolute', hex: '#e0c99a', size: 'md' },
  { name: 'Iris', family: 'Powder', hex: '#c8bfa9', size: 'sm' },
  { name: 'Cedar', family: 'Wood', hex: '#8a7654', size: 'lg' }
]

function Ingredients() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
              <span>05</span>
              <span className="h-px w-16 bg-champagne-500/40" />
              The Materials
            </div>
            <h2 className="font-display text-6xl leading-[0.95] tracking-tightest text-bone-100 md:text-8xl">
              <TextReveal>Nine raw</TextReveal>
              <br />
              <TextReveal delay={0.1}>
                <span className="italic text-champagne-400">materials.</span>
              </TextReveal>
            </h2>
          </div>
          <div className="col-span-12 max-w-md md:col-span-5 md:col-start-8 md:mt-4">
            <TextReveal
              as="p"
              delay={0.2}
              className="block leading-relaxed text-bone-300"
            >
              Every note travels — from a small farm in Kannauj, a distillery in
              Bulgaria, a copper still on the coast of France. We keep the
              circle small. We keep the paperwork honest.
            </TextReveal>
          </div>
        </div>

        <div className="relative h-[520px] w-full md:h-[560px]">
          {ingredients.map((ing, i) => (
            <IngredientOrb key={ing.name} i={i} data={ing} visible={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function IngredientOrb({
  i,
  data,
  visible
}: {
  i: number
  data: (typeof ingredients)[number]
  visible: boolean
}) {
  // Deterministic scattered layout on a rough oval
  const positions = [
    { top: '12%', left: '8%' },
    { top: '18%', left: '46%' },
    { top: '8%', left: '78%' },
    { top: '48%', left: '18%' },
    { top: '55%', left: '52%' },
    { top: '42%', left: '82%' },
    { top: '78%', left: '32%' },
    { top: '82%', left: '68%' },
    { top: '68%', left: '10%' }
  ]
  const size =
    data.size === 'xl'
      ? 'h-40 w-40 md:h-48 md:w-48'
      : data.size === 'lg'
      ? 'h-32 w-32 md:h-36 md:w-36'
      : data.size === 'md'
      ? 'h-24 w-24 md:h-28 md:w-28'
      : 'h-20 w-20 md:h-24 md:w-24'

  const [hover, setHover] = useState(false)

  return (
    <motion.div
      style={{ ...positions[i % positions.length] }}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 1.2,
        delay: 0.05 + i * 0.09,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`absolute ${size}`}
    >
      <motion.button
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        data-cursor="button"
        className="relative flex h-full w-full items-center justify-center rounded-full border border-bone-100/12 focus:outline-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${data.hex}30, ${data.hex}0d 55%, transparent 80%)`,
          boxShadow: hover
            ? `0 0 60px ${data.hex}55, inset 0 0 30px ${data.hex}22`
            : `0 0 30px ${data.hex}22`
        }}
        aria-label={`${data.name} — ${data.family}`}
      >
        <span className="pointer-events-none flex flex-col items-center gap-1 text-center">
          <span className="font-display text-lg italic text-bone-100 md:text-xl">
            {data.name}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/70">
            {data.family}
          </span>
        </span>
        <motion.span
          initial={false}
          animate={{
            scale: hover ? 1.3 : 0.9,
            opacity: hover ? 1 : 0.4
          }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 rounded-full border"
          style={{ borderColor: data.hex }}
        />
      </motion.button>
    </motion.div>
  )
}

/* ------------------------------------------------------- PEOPLE --- */

const people = [
  {
    name: 'The Perfumer',
    role: 'Head of Composition',
    note: 'Trained in Grasse. Believes a note that is not necessary is a note that lies.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'The Distiller',
    role: 'Raw Materials',
    note: 'Walks the fields herself. Chooses the harvest before it is cut.',
    image:
      'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'The Studio',
    role: 'Design & Bottling',
    note: 'A small team of three who number every flacon and fold every letter.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80'
  }
]

function People() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
              <span>06</span>
              <span className="h-px w-16 bg-champagne-500/40" />
              The People
            </div>
            <h2 className="font-display text-6xl italic leading-[0.95] tracking-tightest text-bone-100 md:text-7xl">
              <TextReveal>Small hands.</TextReveal>
              <br />
              <TextReveal delay={0.1}>Slow work.</TextReveal>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {people.map((p, i) => (
            <PortraitCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PortraitCard({
  p,
  i
}: {
  p: (typeof people)[number]
  i: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const offset = i === 1 ? 'md:mt-16' : ''
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: i * 0.12,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`col-span-12 md:col-span-4 ${offset}`}
    >
      <div
        className="group relative overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-950"
        data-cursor="image"
        data-cursor-label="Portrait"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.img
            src={p.image}
            alt={`${p.name}, ${p.role}`}
            className="h-full w-full object-cover opacity-60 [filter:grayscale(0.6)_contrast(1.05)_brightness(0.75)] transition-all duration-1000 group-hover:opacity-75 group-hover:[filter:grayscale(0.2)_contrast(1.05)_brightness(0.8)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,168,120,0.16),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="absolute inset-x-6 bottom-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              {p.role}
            </div>
            <div className="mt-1 font-display text-3xl italic text-bone-100">
              {p.name}
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="leading-relaxed text-bone-300/85">{p.note}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------- VALUES --- */

const values = [
  { title: 'CRAFT', note: 'A hand that will not rush' },
  { title: 'QUALITY', note: 'A material we would use ourselves' },
  { title: 'AUTHENTICITY', note: 'A story without decoration' },
  { title: 'CURIOSITY', note: 'A door left open on purpose' },
  { title: 'EXPRESSION', note: 'A sentence you wear' }
]

function Values() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })
  const active = useTransform(scrollYProgress, [0, 1], [0, values.length])
  const [cur, setCur] = useState(0)
  useEffect(
    () =>
      active.on('change', (v) =>
        setCur(Math.min(values.length - 1, Math.max(0, Math.floor(v))))
      ),
    [active]
  )

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${values.length * 90}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-ink-950">
        <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
          <span>07</span>
          <span className="h-px w-16 bg-champagne-500/40" />
          Manifesto
        </div>

        <div className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden">
          {values.map((v, i) => {
            const dist = Math.abs(i - cur)
            const isActive = i === cur
            return (
              <motion.div
                key={v.title}
                className="pointer-events-none absolute inset-x-0 flex flex-col items-center text-center"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : Math.max(0, 0.15 - dist * 0.06),
                  scale: isActive ? 1 : 0.86,
                  y: (i - cur) * 24,
                  filter: isActive ? 'blur(0px)' : 'blur(6px)'
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div
                  className="font-display text-[18vw] leading-none tracking-tightest md:text-[14vw]"
                  style={{
                    color: isActive ? '#f5f0e6' : 'rgba(245,240,230,0.4)'
                  }}
                >
                  {v.title}
                </div>
                {isActive && (
                  <motion.div
                    key={`note-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="mt-4 font-display text-xl italic text-champagne-400 md:text-2xl"
                  >
                    — {v.note}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Progress */}
        <div className="mt-8 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
          <span>{String(cur + 1).padStart(2, '0')}</span>
          <div className="relative h-px w-40 bg-bone-100/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-champagne-400"
              style={{ width: `${((cur + 1) / values.length) * 100}%` }}
            />
          </div>
          <span>{String(values.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------- SURPRISE INTERACTION --- */

function AboutSurprise() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })

  const dotScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.2, 8, 26])
  const dotOpacity = useTransform(scrollYProgress, [0, 0.05, 0.5], [0, 1, 0.4])
  const bottleOpacity = useTransform(scrollYProgress, [0.35, 0.6], [0, 1])
  const bottleScale = useTransform(scrollYProgress, [0.35, 0.7], [0.8, 1])
  const bottleBlur = useTransform(scrollYProgress, [0.35, 0.6], [16, 0])
  const bottleFilter = useTransform(bottleBlur, (v) => `blur(${v}px)`)
  const nameOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])
  const stmtOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1])
  const stmtY = useTransform(scrollYProgress, [0.7, 0.9], [20, 0])

  return (
    <section ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-ink-950">
        {/* Growing dot of light */}
        <motion.div
          aria-hidden
          style={{ scale: dotScale, opacity: dotOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-4 w-4 rounded-full bg-champagne-400 blur-md" />
        </motion.div>

        {/* Emerging bottle */}
        <motion.div
          style={{
            opacity: bottleOpacity,
            scale: bottleScale,
            filter: bottleFilter
          }}
          className="relative z-10 h-[76vh] w-[46vw] min-w-[280px] max-w-[420px]"
        >
          <PerfumeBottle floating />
        </motion.div>

        {/* Name */}
        <motion.div
          style={{ opacity: nameOpacity }}
          className="pointer-events-none absolute inset-x-0 top-24 z-10 text-center"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
            No. 01 · The Beginning
          </div>
          <div className="mt-2 font-display text-5xl italic text-bone-100 md:text-7xl">
            Nuit d’Ombre
          </div>
        </motion.div>

        {/* Statement */}
        <motion.div
          style={{ opacity: stmtOpacity, y: stmtY }}
          className="absolute inset-x-0 bottom-24 z-10 text-center"
        >
          <div className="mx-auto max-w-3xl px-6 font-display text-3xl italic text-bone-100 md:text-5xl">
            This is where the story begins.
          </div>
        </motion.div>

        <div className="grain absolute inset-0" />
      </div>
    </section>
  )
}

/* --------------------------------------- CLOSING STATEMENT & CTA --- */

function ClosingStatement() {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden bg-ink-900 py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.16),transparent_70%)] blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-8 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
          <span className="h-px w-12 bg-champagne-500/40" />
          Discover your signature
          <span className="h-px w-12 bg-champagne-500/40" />
        </div>
        <h2 className="font-display text-[15vw] leading-[0.88] tracking-tightest text-bone-100 md:text-[9vw]">
          <div className="overflow-hidden">
            <WordsReveal text="Scent" />
          </div>
          <div className="overflow-hidden italic">
            <WordsReveal text="becomes" delay={0.15} />
          </div>
          <div className="overflow-hidden text-champagne-400">
            <WordsReveal text="memory." delay={0.3} />
          </div>
        </h2>
        <p className="mx-auto mt-10 max-w-xl leading-relaxed text-bone-300">
          Read the collection like an anthology — five parfums, five chapters,
          five ways to be remembered.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <MagneticButton
            variant="primary"
            onClick={() => navigate('/fragrances')}
          >
            Explore Fragrances
          </MagneticButton>
          <MagneticButton variant="ghost" onClick={() => navigate('/contact')}>
            Write to us
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- FX --- */

function FogWisps() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1200 700"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 mix-blend-screen"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="fog1" cx="0.3" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#c9a878" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#c9a878" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fog2" cx="0.7" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#f5f0e6" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f5f0e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.rect
        width="1200"
        height="700"
        fill="url(#fog1)"
        animate={{ x: [-30, 30, -30] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.rect
        width="1200"
        height="700"
        fill="url(#fog2)"
        animate={{ x: [40, -40, 40] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
