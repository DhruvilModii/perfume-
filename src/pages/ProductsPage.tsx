import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/atoms/GlassCard'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { PerfumeBottle } from '../components/atoms/PerfumeBottle'
import { TextReveal, WordsReveal } from '../components/atoms/TextReveal'
import {
  Audience,
  FragranceCategory,
  Fragrance,
  audiences,
  categories,
  formatPrice,
  fragrances
} from '../data/products'

type Category = FragranceCategory | 'All'
type AudienceFilter = Audience | 'All'
type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export default function ProductsPage() {
  const [query, setQuery] = useState('')
  const [audience, setAudience] = useState<AudienceFilter>('All')
  const [category, setCategory] = useState<Category>('All')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000])
  const [sort, setSort] = useState<SortKey>('featured')
  const [detail, setDetail] = useState<Fragrance | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = fragrances.filter((f) => {
      if (audience !== 'All' && f.audience !== audience) return false
      if (category !== 'All' && f.category !== category) return false
      const minPrice = Math.min(...f.sizes.map((s) => s.price))
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) return false
      if (!q) return true
      return (
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.fragranceFamily.toLowerCase().includes(q) ||
        [...f.topNotes, ...f.heartNotes, ...f.baseNotes]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    })
    switch (sort) {
      case 'price-asc':
        return [...list].sort(
          (a, b) => Math.min(...a.sizes.map((s) => s.price)) - Math.min(...b.sizes.map((s) => s.price))
        )
      case 'price-desc':
        return [...list].sort(
          (a, b) => Math.min(...b.sizes.map((s) => s.price)) - Math.min(...a.sizes.map((s) => s.price))
        )
      case 'newest':
        return [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew))
      default:
        return [...list].sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured)
        )
    }
  }, [query, audience, category, priceRange, sort])

  const featured = filtered.find((f) => f.featured) ?? filtered[0]

  return (
    <>
      <ProductsHero />
      <ControlsBar
        query={query}
        setQuery={setQuery}
        audience={audience}
        setAudience={setAudience}
        category={category}
        setCategory={setCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sort={sort}
        setSort={setSort}
        count={filtered.length}
      />

      {featured && (
        <FeaturedFragrance f={featured} onOpen={() => setDetail(featured)} />
      )}

      <ProductGrid
        list={filtered.filter((f) => f.id !== featured?.id)}
        onOpen={(f) => setDetail(f)}
      />

      <ProductsFinalCTA />

      <ProductDetail fragrance={detail} onClose={() => setDetail(null)} />
    </>
  )
}

/* ---------------------------------------------------------- HERO --- */

function ProductsHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const bottleScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const headlineX = useTransform(scrollYProgress, [0, 1], [0, -60])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const glow = useTransform(scrollYProgress, [0, 1], [0.5, 1])

  // Cursor parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { damping: 30, stiffness: 120 })
  const smy = useSpring(my, { damping: 30, stiffness: 120 })
  useEffect(() => {
    const h = (e: PointerEvent) => {
      mx.set((e.clientX - window.innerWidth / 2) / window.innerWidth)
      my.set((e.clientY - window.innerHeight / 2) / window.innerHeight)
    }
    window.addEventListener('pointermove', h, { passive: true })
    return () => window.removeEventListener('pointermove', h)
  }, [mx, my])
  const bx = useTransform(smx, (v) => v * 40)
  const bpy = useTransform(smy, (v) => v * 20)

  return (
    <section
      ref={ref}
      className="relative flex min-h-[95vh] items-center overflow-hidden bg-ink-950 pt-28"
    >
      <motion.div
        aria-hidden
        style={{ scale: glow, y: bgY }}
        className="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.20),rgba(201,168,120,0)_70%)] blur-3xl"
      />
      <div className="grain absolute inset-0" />
      <div className="vignette absolute inset-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6 px-6">
        <div className="col-span-12 md:col-span-7">
          <div className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/70">
            <span className="h-px w-10 bg-champagne-500/50" />
            The Collection
          </div>
          <motion.h1
            style={{ x: headlineX }}
            className="font-display text-[15vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[10vw]"
          >
            <div className="overflow-hidden">
              <WordsReveal text="Find your" />
            </div>
            <div className="overflow-hidden italic text-champagne-400">
              <WordsReveal text="signature." delay={0.15} />
            </div>
          </motion.h1>
          <TextReveal delay={0.6} as="p" className="mt-10 block max-w-lg">
            <span className="font-light leading-relaxed text-bone-300">
              Six parfums, each written to leave an impression. Filter by
              character, by note, by price — read them the way you want to.
            </span>
          </TextReveal>
        </div>
        <div className="col-span-12 flex justify-center md:col-span-5">
          <motion.div
            style={{ y: bottleY, scale: bottleScale, x: bx }}
            className="relative h-[62vh] w-[65vw] max-w-[380px]"
          >
            <motion.div style={{ y: bpy }} className="h-full">
              <PerfumeBottle floating />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------- CONTROLS BAR --- */

function ControlsBar({
  query,
  setQuery,
  audience,
  setAudience,
  category,
  setCategory,
  priceRange,
  setPriceRange,
  sort,
  setSort,
  count
}: {
  query: string
  setQuery: (v: string) => void
  audience: AudienceFilter
  setAudience: (v: AudienceFilter) => void
  category: Category
  setCategory: (v: Category) => void
  priceRange: [number, number]
  setPriceRange: (v: [number, number]) => void
  sort: SortKey
  setSort: (v: SortKey) => void
  count: number
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const audFilters: AudienceFilter[] = ['All', ...audiences]
  const catFilters: Category[] = ['All', ...categories]

  return (
    <section className="sticky top-16 z-30 border-y border-bone-100/10 bg-ink-950/80 py-4 backdrop-blur-xl md:top-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 md:flex-row md:items-center md:justify-between">
        {/* Audience segmented pills */}
        <div className="scrollbar-none -mx-6 flex items-center gap-1 overflow-x-auto px-6 md:mx-0 md:px-0">
          {audFilters.map((a) => (
            <button
              key={a}
              data-cursor="button"
              onClick={() => setAudience(a)}
              className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 transition-all ${
                audience === a
                  ? 'border-champagne-500/70 bg-champagne-500/10 text-champagne-400'
                  : 'border-bone-100/15 text-bone-100/70 hover:border-champagne-500/40 hover:text-bone-100'
              }`}
            >
              {a === 'All' ? 'All' : a}
            </button>
          ))}
          <div className="mx-2 h-4 w-px bg-bone-100/15" />
          <button
            data-cursor="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="shrink-0 rounded-full border border-bone-100/15 px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-100/70 transition hover:border-champagne-500/40 hover:text-bone-100"
          >
            {filtersOpen ? 'Hide filters' : 'Filters'}
          </button>
        </div>

        {/* Right: search + sort + count */}
        <div className="flex items-center gap-3">
          <div className="relative flex w-full items-center md:w-64">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              className="pointer-events-none absolute left-3 text-bone-100/50"
            >
              <circle cx="6" cy="6" r="4" stroke="currentColor" fill="none" />
              <path
                d="M9 9l4 4"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, family…"
              className="w-full rounded-full border border-bone-100/15 bg-black/30 py-2 pl-9 pr-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100 placeholder:normal-case placeholder:tracking-normal placeholder:text-bone-300/40 focus:border-champagne-500/60 focus:outline-none"
              aria-label="Search fragrances"
            />
          </div>
          <SortSelect sort={sort} setSort={setSort} />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60 md:inline">
            {String(count).padStart(2, '0')} shown
          </span>
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            key="filters-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 px-6 pb-4 pt-6">
              <div className="col-span-12 md:col-span-5">
                <FieldLabel>Fragrance family</FieldLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {catFilters.map((c) => (
                    <button
                      key={c}
                      data-cursor="button"
                      onClick={() => setCategory(c)}
                      className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 transition ${
                        category === c
                          ? 'border-champagne-500/70 bg-champagne-500/10 text-champagne-400'
                          : 'border-bone-100/15 text-bone-100/70 hover:border-champagne-500/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                <FieldLabel>Price · up to {formatPrice(priceRange[1])}</FieldLabel>
                <input
                  type="range"
                  min={1000}
                  max={6000}
                  step={100}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="mt-4 w-full accent-champagne-500"
                  aria-label="Maximum price"
                />
                <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
                  <span>{formatPrice(1000)}</span>
                  <span>{formatPrice(6000)}</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3">
                <FieldLabel>Reset</FieldLabel>
                <button
                  onClick={() => {
                    setAudience('All')
                    setCategory('All')
                    setPriceRange([0, 6000])
                    setQuery('')
                  }}
                  data-cursor="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-bone-100/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-100 transition hover:border-champagne-500/50 hover:text-champagne-400"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
      {children}
    </div>
  )
}

function SortSelect({
  sort,
  setSort
}: {
  sort: SortKey
  setSort: (s: SortKey) => void
}) {
  const options: { value: SortKey; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'newest', label: 'Newest' }
  ]
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        data-cursor="button"
        className="appearance-none rounded-full border border-bone-100/15 bg-black/30 py-2 pl-4 pr-9 font-mono text-[11px] uppercase tracking-widest2 text-bone-100 focus:border-champagne-500/60 focus:outline-none"
        aria-label="Sort"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-900">
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-bone-100/50"
        width="10"
        height="10"
        viewBox="0 0 10 10"
      >
        <path
          d="M1 3l4 4 4-4"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

/* ----------------------------------------- FEATURED FRAGRANCE --- */

function FeaturedFragrance({
  f,
  onOpen
}: {
  f: Fragrance
  onOpen: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const light = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.9, 0.5])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-24"
      onMouseEnter={() => {}}
    >
      <motion.div
        aria-hidden
        style={{ opacity: light }}
        className="absolute right-[-10%] top-1/2 h-[80vmin] w-[80vmin] -translate-y-1/2 rounded-full"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{
            background: `radial-gradient(closest-side, ${f.accent}44, transparent 70%)`
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-8 px-6">
        <div className="col-span-12 md:col-span-6">
          <div className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400">
            <span>Featured</span>
            <span className="h-px w-10 bg-champagne-500/50" />
            <span>No. {f.index}</span>
          </div>
          <h2 className="font-display text-6xl italic leading-[0.95] text-bone-100 md:text-8xl">
            <WordsReveal text={f.name} />
          </h2>
          <div className="mt-3 font-mono text-[11px] uppercase tracking-widest2 text-bone-300/70">
            {f.fragranceFamily}
          </div>
          <p className="mt-6 max-w-md leading-relaxed text-bone-300">
            {f.description}
          </p>

          <NotesPyramid f={f} />

          <div className="mt-8 flex flex-wrap items-end gap-6">
            <div className="flex gap-4">
              {f.sizes.slice(0, 2).map((s) => (
                <div key={s.ml}>
                  <div className="font-display text-3xl text-bone-100">
                    {formatPrice(s.price)}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                    {s.ml} ML
                  </div>
                </div>
              ))}
            </div>
            <MagneticButton variant="primary" onClick={onOpen}>
              View Fragrance
            </MagneticButton>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-950"
            data-cursor="product"
            data-cursor-label="Featured"
          >
            <motion.img
              style={{ y: imgY }}
              src={f.image}
              alt={f.name}
              className="h-full w-full object-cover opacity-70 transition-all duration-1000 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
            <div className="absolute inset-0 opacity-70 mix-blend-multiply" style={{
              background: `radial-gradient(circle at 30% 20%, ${f.accent}33, transparent 60%)`
            }}/>

            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                  Best for {f.bestFor}
                </div>
                <div className="mt-1 font-display text-2xl italic text-bone-100">
                  {f.tagline}
                </div>
              </div>
              <IndicatorRow f={f} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------- PRODUCT GRID (asymmetric) --- */

function ProductGrid({
  list,
  onOpen
}: {
  list: Fragrance[]
  onOpen: (f: Fragrance) => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-baseline justify-between">
          <h3 className="font-display text-3xl italic text-bone-100 md:text-4xl">
            The Anthology
          </h3>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
            {String(list.length).padStart(2, '0')} parfums
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid auto-rows-[280px] grid-cols-12 gap-4 md:auto-rows-[320px] md:gap-6">
            {list.map((f, i) => {
              const layout = layoutFor(i)
              return (
                <ProductCard
                  key={f.id}
                  f={f}
                  layout={layout}
                  onOpen={() => onOpen(f)}
                  hovered={hoveredId === f.id}
                  onHover={(h) => setHoveredId(h ? f.id : null)}
                  someoneElseHovered={
                    hoveredId !== null && hoveredId !== f.id
                  }
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

type CardLayout = {
  span: string
  variant: 'tall' | 'wide' | 'square' | 'minimal'
}

function layoutFor(i: number): CardLayout {
  // Editorial rhythm — some tall, some wide, some square, one minimal.
  const patterns: CardLayout[] = [
    { span: 'col-span-12 md:col-span-7 md:row-span-2', variant: 'wide' },
    { span: 'col-span-12 md:col-span-5 md:row-span-2', variant: 'tall' },
    { span: 'col-span-12 md:col-span-4', variant: 'square' },
    { span: 'col-span-12 md:col-span-4', variant: 'minimal' },
    { span: 'col-span-12 md:col-span-4', variant: 'square' },
    { span: 'col-span-12 md:col-span-6', variant: 'wide' },
    { span: 'col-span-12 md:col-span-6', variant: 'square' }
  ]
  return patterns[i % patterns.length]
}

function ProductCard({
  f,
  layout,
  onOpen,
  hovered,
  onHover,
  someoneElseHovered
}: {
  f: Fragrance
  layout: CardLayout
  onOpen: () => void
  hovered: boolean
  onHover: (h: boolean) => void
  someoneElseHovered: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isMinimal = layout.variant === 'minimal'

  return (
    <motion.article
      ref={cardRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onOpen}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="product"
      data-cursor-label="View"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      animate={{
        opacity: someoneElseHovered ? 0.55 : 1,
        filter: someoneElseHovered ? 'blur(0.5px)' : 'blur(0px)'
      }}
      className={`group relative overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-900/70 backdrop-blur ${layout.span}`}
    >
      {/* Media */}
      {!isMinimal && (
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1.01 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={f.image}
            alt={f.name}
            loading="lazy"
            className="h-full w-full object-cover opacity-70 [filter:contrast(1.05)_saturate(0.9)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
          <div
            className="absolute inset-0 opacity-70 mix-blend-multiply"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${f.accent}33, transparent 60%)`
            }}
          />
        </motion.div>
      )}
      {isMinimal && (
        <div className="absolute inset-0 bg-ink-900">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${f.accent}22, transparent 60%)`
            }}
          />
        </div>
      )}

      {/* Chip */}
      <div className="relative z-10 flex items-center justify-between p-5 md:p-6">
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-bone-100/70">
          No. {f.index}
        </span>
        <div className="flex items-center gap-2">
          {f.isNew && (
            <span className="rounded-full border border-champagne-500/70 bg-champagne-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest2 text-champagne-400">
              New
            </span>
          )}
          <span
            className="rounded-full border border-bone-100/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest2 text-bone-100/70 backdrop-blur"
            style={{ background: `${f.accent}11` }}
          >
            {f.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-5 bottom-5 z-10 md:inset-x-6 md:bottom-6">
        <div className="mb-2 flex items-baseline justify-between">
          <h4 className="font-display text-2xl leading-tight text-bone-100 md:text-3xl">
            {f.name}
          </h4>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
            transition={{ duration: 0.4 }}
            className="hidden font-mono text-[10px] uppercase tracking-widest2 text-champagne-400 md:inline"
          >
            View →
          </motion.span>
        </div>
        <p className="mb-4 line-clamp-2 max-w-sm font-light leading-relaxed text-bone-300/80">
          {f.tagline}
        </p>
        <div className="flex items-end justify-between border-t border-bone-100/10 pt-3">
          <div>
            <div className="font-display text-xl text-bone-100 md:text-2xl">
              {formatPrice(Math.min(...f.sizes.map((s) => s.price)))}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
              from {f.sizes[0].ml} ML
            </div>
          </div>
          <IndicatorRow f={f} tiny />
        </div>
      </div>

      {/* Hover hairline */}
      <span
        className={`pointer-events-none absolute inset-x-6 top-1/2 h-px bg-gradient-to-r from-transparent via-champagne-400/30 to-transparent transition-opacity duration-700 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Focus ring */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-all group-focus-visible:ring-champagne-500/60" />
    </motion.article>
  )
}

function IndicatorRow({
  f,
  tiny = false
}: {
  f: Fragrance
  tiny?: boolean
}) {
  const size = tiny ? 'h-1 w-1' : 'h-1.5 w-1.5'
  return (
    <div className="flex flex-col items-end gap-1">
      <MicroBar label="Intensity" value={f.intensity} dotSize={size} />
      <MicroBar label="Longevity" value={f.longevity} dotSize={size} />
    </div>
  )
}

function MicroBar({
  label,
  value,
  dotSize
}: {
  label: string
  value: number
  dotSize: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
        {label}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`${dotSize} rounded-full ${
              i < value ? 'bg-champagne-400' : 'bg-bone-100/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------- NOTES PYRAMID --- */

function NotesPyramid({ f }: { f: Fragrance }) {
  return (
    <div className="mt-8 space-y-3">
      <NoteRow label="Top" notes={f.topNotes} accent={f.accent} depth={0} />
      <NoteRow label="Heart" notes={f.heartNotes} accent={f.accent} depth={1} />
      <NoteRow label="Base" notes={f.baseNotes} accent={f.accent} depth={2} />
    </div>
  )
}

function NoteRow({
  label,
  notes,
  accent,
  depth
}: {
  label: string
  notes: string[]
  accent: string
  depth: number
}) {
  return (
    <div className="flex items-baseline gap-4">
      <div className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        {label}
      </div>
      <div
        className="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-bone-100"
        style={{
          fontSize: `${1.6 - depth * 0.15}rem`,
          lineHeight: 1.15,
          color: depth === 2 ? '#e0d9c9' : '#f5f0e6'
        }}
      >
        {notes.map((n, i) => (
          <span key={n} className="inline-flex items-center gap-2">
            <span>{n}</span>
            {i < notes.length - 1 && (
              <span className="text-bone-300/40">·</span>
            )}
          </span>
        ))}
      </div>
      <span
        className="h-3 w-3 rounded-full"
        style={{
          background: accent,
          opacity: depth === 0 ? 0.4 : depth === 1 ? 0.7 : 1
        }}
      />
    </div>
  )
}

/* ------------------------------------------------ EMPTY STATE --- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-bone-100/10 bg-ink-900/50 p-16 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Nothing to read yet
      </div>
      <h4 className="font-display text-3xl italic text-bone-100">
        The anthology is silent.
      </h4>
      <p className="max-w-sm text-bone-300/80">
        Loosen a filter, or search a note you love. The parfums are all here —
        just hidden by the choices you made.
      </p>
    </div>
  )
}

/* ---------------------------------------------- PRODUCT DETAIL --- */

function ProductDetail({
  fragrance,
  onClose
}: {
  fragrance: Fragrance | null
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [size, setSize] = useState(0)
  useEffect(() => {
    setSize(0)
  }, [fragrance?.id])

  useEffect(() => {
    if (!fragrance) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [fragrance, onClose])

  return (
    <AnimatePresence>
      {fragrance && (
        <motion.div
          key="detail"
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${fragrance.name} details`}
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden border-l border-bone-100/10 bg-ink-950/95 shadow-[-40px_0_60px_rgba(0,0,0,0.5)]"
          >
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background: `radial-gradient(120% 60% at 80% 10%, ${fragrance.accent}33, transparent 55%)`
                }}
              />
              <div className="grain absolute inset-0" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-bone-100/10 px-6 py-4">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                No. {fragrance.index} · {fragrance.fragranceFamily}
              </div>
              <button
                onClick={onClose}
                data-cursor="button"
                aria-label="Close details"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bone-100/15 text-bone-100 transition hover:border-champagne-500/60 hover:text-champagne-400"
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M1 1l10 10M11 1L1 11"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-12 md:p-8">
                {/* Bottle */}
                <div className="md:col-span-5">
                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-900">
                    <div className="h-[85%] w-[65%]">
                      <PerfumeBottle accent={fragrance.accent} floating />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <MetaBox k="Intensity" v={`${fragrance.intensity}/5`} />
                    <MetaBox k="Longevity" v={`${fragrance.longevity}/5`} />
                    <MetaBox k="Best for" v={fragrance.bestFor} />
                  </div>
                </div>

                {/* Info */}
                <div className="md:col-span-7">
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                    {fragrance.audience} · {fragrance.category}
                  </div>
                  <h3 className="mt-1 font-display text-5xl italic leading-[0.95] text-bone-100 md:text-6xl">
                    {fragrance.name}
                  </h3>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                    {fragrance.tagline}
                  </div>
                  <p className="mt-5 leading-relaxed text-bone-300">
                    {fragrance.description}
                  </p>
                  <p className="mt-3 italic leading-relaxed text-bone-300/70">
                    {fragrance.story}
                  </p>

                  <NotesPyramid f={fragrance} />

                  {/* Sizes */}
                  <div className="mt-8">
                    <FieldLabel>Choose size</FieldLabel>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {fragrance.sizes.map((s, i) => (
                        <button
                          key={s.ml}
                          onClick={() => setSize(i)}
                          data-cursor="button"
                          className={`rounded-lg border px-4 py-3 text-left transition ${
                            size === i
                              ? 'border-champagne-500/70 bg-champagne-500/10 text-bone-100'
                              : 'border-bone-100/15 text-bone-100/80 hover:border-champagne-500/40'
                          }`}
                        >
                          <div className="font-display text-lg">
                            {s.ml} ML
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                            {formatPrice(s.price)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        fragrance.available === false
                          ? 'bg-bone-100/40'
                          : 'bg-champagne-400'
                      }`}
                    />
                    {fragrance.available === false
                      ? 'Waitlist only'
                      : 'In stock · ships in oak'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="relative flex items-center justify-between gap-3 border-t border-bone-100/10 bg-ink-950/85 px-6 py-4 backdrop-blur">
              <div>
                <div className="font-display text-2xl text-bone-100">
                  {formatPrice(fragrance.sizes[size].price)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                  {fragrance.sizes[size].ml} ML · incl. taxes
                </div>
              </div>
              <div className="flex gap-2">
                <MagneticButton
                  variant="ghost"
                  onClick={() => navigate('/contact')}
                >
                  Enquire
                </MagneticButton>
                <MagneticButton variant="primary">Reserve</MagneticButton>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MetaBox({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-bone-100/10 bg-black/30 p-3">
      <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
        {k}
      </div>
      <div className="mt-1 font-display text-lg text-bone-100">{v}</div>
    </div>
  )
}

/* ------------------------------------------------- FINAL CTA --- */

function ProductsFinalCTA() {
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden bg-ink-900 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.18),transparent_70%)] blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
          <span className="h-px w-12 bg-champagne-500/40" />
          One left to choose
          <span className="h-px w-12 bg-champagne-500/40" />
        </div>
        <h2 className="font-display text-[13vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[7.5vw]">
          <div className="overflow-hidden">
            <WordsReveal text="Your next signature" />
          </div>
          <div className="overflow-hidden italic text-champagne-400">
            <WordsReveal text="is waiting." delay={0.15} />
          </div>
        </h2>
        <div className="mt-10 flex justify-center gap-3">
          <MagneticButton variant="primary" onClick={() => navigate('/contact')}>
            Speak to the perfumer
          </MagneticButton>
          <MagneticButton variant="ghost" onClick={() => navigate('/about')}>
            About the house
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
