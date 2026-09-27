import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { WordsReveal } from '../components/atoms/TextReveal'
import { QuantityStepper } from '../components/commerce/QuantityStepper'
import { StarRating } from '../components/commerce/StarRating'
import { WishlistButton } from '../components/commerce/WishlistButton'
import { useCart } from '../context/CartContext'
import {
  Fragrance,
  formatPrice,
  getFragranceBySlug,
  getRelated
} from '../data/products'

export default function ProductDetailPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const fragrance = getFragranceBySlug(slug)

  if (!fragrance) return <ProductNotFound />
  return <ProductDetailInner key={fragrance.id} fragrance={fragrance} navigate={navigate} />
}

function ProductDetailInner({
  fragrance,
  navigate
}: {
  fragrance: Fragrance
  navigate: ReturnType<typeof useNavigate>
}) {
  const [sizeIndex, setSizeIndex] = useState(
    Math.min(1, fragrance.sizes.length - 1)
  )
  const [quantity, setQuantity] = useState(1)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const cart = useCart()

  const selectedSize = fragrance.sizes[sizeIndex]
  const outOfStock = fragrance.stock <= 0
  const maxQty = Math.max(1, fragrance.stock)

  const discountPct = fragrance.discount
  const listPrice = fragrance.originalPrice

  useEffect(() => {
    setQuantity(1)
  }, [fragrance.id, sizeIndex])

  const related = useMemo(() => getRelated(fragrance, 3), [fragrance])

  const handleAdd = () => {
    if (outOfStock) return
    cart.addItem(fragrance, selectedSize.ml, quantity)
    cart.openCart()
  }
  const handleBuyNow = () => {
    if (outOfStock) return
    cart.addItem(fragrance, selectedSize.ml, quantity)
    navigate('/checkout')
  }

  return (
    <>
      {/* Hero row: gallery + info */}
      <section className="relative overflow-hidden bg-ink-950 pt-28">
        <div
          aria-hidden
          className="absolute left-1/2 top-[30%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(closest-side, ${fragrance.accent}33, transparent 70%)`
          }}
        />
        <div className="grain absolute inset-0" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 px-6 pb-16">
          {/* Breadcrumb */}
          <div className="col-span-12 mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
            <Link to="/" className="hover:text-champagne-400">Home</Link>
            <span>/</span>
            <Link to="/fragrances" className="hover:text-champagne-400">Fragrances</Link>
            <span>/</span>
            <span className="text-champagne-400">{fragrance.name}</span>
          </div>

          {/* Gallery */}
          <div className="col-span-12 md:col-span-7">
            <Gallery
              images={fragrance.gallery}
              index={galleryIndex}
              onIndex={setGalleryIndex}
              accent={fragrance.accent}
              alt={fragrance.name}
            />
          </div>

          {/* Info */}
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              <span>{fragrance.brand}</span>
              <span className="h-px w-8 bg-champagne-500/50" />
              <span>No. {fragrance.index}</span>
            </div>
            <h1 className="mt-4 font-display text-5xl italic leading-[0.95] text-bone-100 md:text-6xl">
              <WordsReveal text={fragrance.name} />
            </h1>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/70">
              {fragrance.audience} · {fragrance.category} · {fragrance.fragranceFamily}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <StarRating
                value={fragrance.rating}
                reviewCount={fragrance.reviewCount}
                size="md"
              />
            </div>

            <p className="mt-6 leading-relaxed text-bone-300">
              {fragrance.description}
            </p>

            {/* Price */}
            <div className="mt-8 flex items-end gap-4">
              <div className="font-display text-5xl text-bone-100">
                {formatPrice(selectedSize.price)}
              </div>
              {discountPct && listPrice && sizeIndex === 0 && (
                <>
                  <div className="pb-2 font-mono text-[12px] tracking-widest2 text-bone-300/50 line-through">
                    {formatPrice(listPrice)}
                  </div>
                  <span className="mb-2 rounded-full border border-champagne-500/60 bg-champagne-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest2 text-champagne-400">
                    −{discountPct}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
              {selectedSize.ml} ML · incl. taxes
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <Label>Choose size</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {fragrance.sizes.map((s, i) => (
                  <button
                    key={s.ml}
                    onClick={() => setSizeIndex(i)}
                    data-cursor="button"
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      sizeIndex === i
                        ? 'border-champagne-500/70 bg-champagne-500/10 text-bone-100'
                        : 'border-bone-100/15 text-bone-100/80 hover:border-champagne-500/40'
                    }`}
                  >
                    <div className="font-display text-lg">{s.ml} ML</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                      {formatPrice(s.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-6">
              <div>
                <Label>Quantity</Label>
                <div className="mt-3">
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    max={maxQty}
                    min={1}
                  />
                </div>
              </div>
              <div>
                <Label>Availability</Label>
                <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/70">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      outOfStock ? 'bg-bone-100/40' : 'bg-champagne-400'
                    }`}
                  />
                  {outOfStock
                    ? 'Waitlist only'
                    : fragrance.stock < 5
                    ? `Only ${fragrance.stock} left`
                    : 'In stock'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton variant="primary" onClick={handleAdd}>
                {outOfStock ? 'Waitlist' : 'Add to Cart'}
              </MagneticButton>
              <MagneticButton variant="ring" onClick={handleBuyNow}>
                Buy Now
              </MagneticButton>
              <WishlistButton productId={fragrance.id} size="lg" stopPropagation={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Notes + meta */}
      <section className="relative overflow-hidden bg-ink-900 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-6">
          <div className="col-span-12 md:col-span-7">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              <span className="h-px w-10 bg-champagne-500/50" />
              Composition
            </div>
            <div className="space-y-4">
              <NoteRow label="Top" notes={fragrance.topNotes} accent={fragrance.accent} depth={0} />
              <NoteRow label="Heart" notes={fragrance.heartNotes} accent={fragrance.accent} depth={1} />
              <NoteRow label="Base" notes={fragrance.baseNotes} accent={fragrance.accent} depth={2} />
            </div>
            <p className="mt-10 max-w-2xl italic leading-relaxed text-bone-300/80">
              {fragrance.story}
            </p>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <Meta label="Intensity" value={`${fragrance.intensity}/5`} />
              <Meta label="Longevity" value={`${fragrance.longevity}/5`} />
              <Meta label="Best for" value={fragrance.bestFor} />
              <Meta label="Audience" value={fragrance.audience} />
              <Meta label="Family" value={fragrance.fragranceFamily} span />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection fragrance={fragrance} />

      {/* Related */}
      {related.length > 0 && <RelatedRow list={related} />}
    </>
  )
}

/* ------------------------------------------------------- GALLERY --- */

function Gallery({
  images,
  index,
  onIndex,
  accent,
  alt
}: {
  images: string[]
  index: number
  onIndex: (n: number) => void
  accent: string
  alt: string
}) {
  const image = images[index] ?? images[0]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[80px_1fr] md:gap-6">
      {/* Thumbs */}
      <div className="order-2 flex gap-3 md:order-1 md:flex-col">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => onIndex(i)}
            data-cursor="image"
            aria-label={`Show image ${i + 1}`}
            className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg border transition md:w-full ${
              i === index
                ? 'border-champagne-500/70'
                : 'border-bone-100/10 hover:border-champagne-500/40'
            }`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-75"
            />
          </button>
        ))}
      </div>

      {/* Main */}
      <div
        className="order-1 relative aspect-[4/5] overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-900 md:order-2"
        data-cursor="product"
        data-cursor-label="Look"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={image}
            src={image}
            alt={alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${accent}33, transparent 60%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------- REVIEWS --- */

function ReviewsSection({ fragrance }: { fragrance: Fragrance }) {
  const dist = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]
    for (const r of fragrance.reviews) {
      const b = Math.min(5, Math.max(1, Math.round(r.rating)))
      counts[b - 1] += 1
    }
    const total = counts.reduce((s, c) => s + c, 0) || 1
    return counts.map((c, i) => ({ stars: i + 1, count: c, pct: (c / total) * 100 }))
  }, [fragrance.reviews])

  return (
    <section className="relative bg-ink-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-baseline justify-between">
          <h3 className="font-display text-3xl italic text-bone-100 md:text-4xl">
            Reader impressions
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
            Sample data
          </span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <div className="rounded-2xl border border-bone-100/10 bg-ink-900/60 p-6 backdrop-blur">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                Overall
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-display text-6xl text-bone-100">
                  {fragrance.rating.toFixed(1)}
                </div>
                <StarRating value={fragrance.rating} showValue={false} size="md" />
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
                {fragrance.reviewCount} reviews
              </div>
              <div className="mt-6 space-y-2">
                {dist
                  .slice()
                  .reverse()
                  .map((d) => (
                    <div key={d.stars} className="flex items-center gap-3">
                      <span className="w-6 font-mono text-[10px] text-bone-300/60">
                        {d.stars}★
                      </span>
                      <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-bone-100/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-champagne-400"
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-[10px] text-bone-300/50">
                        {d.count}
                      </span>
                    </div>
                  ))}
              </div>
              <p className="mt-6 font-mono text-[9px] leading-relaxed text-bone-300/50">
                Displayed reviews are illustrative samples. Real customer reviews
                will appear here once the reviews API is connected.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <ul className="divide-y divide-bone-100/10">
              {fragrance.reviews.map((r) => (
                <li key={r.id} className="py-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <div className="font-display text-lg text-bone-100">
                        {r.title || 'A note on this parfum'}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                        {r.author} · {new Date(r.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {r.sample && (
                          <span className="ml-2 text-champagne-400">Sample</span>
                        )}
                      </div>
                    </div>
                    <StarRating value={r.rating} showValue={false} size="sm" />
                  </div>
                  <p className="mt-3 leading-relaxed text-bone-300">{r.text}</p>
                </li>
              ))}
              {fragrance.reviews.length === 0 && (
                <li className="py-5 text-bone-300/60">No reviews yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- RELATED --- */

function RelatedRow({ list }: { list: Fragrance[] }) {
  return (
    <section className="relative bg-ink-900 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-baseline justify-between">
          <h3 className="font-display text-3xl italic text-bone-100 md:text-4xl">
            Read next
          </h3>
          <Link
            to="/fragrances"
            data-cursor="button"
            className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400 hover:underline"
          >
            The full anthology →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {list.map((f) => (
            <Link
              key={f.id}
              to={`/fragrances/${f.slug}`}
              data-cursor="product"
              data-cursor-label="View"
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-950"
            >
              <motion.img
                src={f.image}
                alt={f.name}
                loading="lazy"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="font-mono text-[9px] uppercase tracking-widest2 text-champagne-400">
                  No. {f.index}
                </div>
                <div className="mt-1 font-display text-2xl italic text-bone-100">
                  {f.name}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                  from {formatPrice(Math.min(...f.sizes.map((s) => s.price)))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- 404 --- */

function ProductNotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 pt-28 text-center">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.15),transparent_70%)] blur-3xl"
      />
      <div className="grain absolute inset-0" />
      <div className="relative z-10">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
          404 · Fragrance not found
        </div>
        <h1 className="font-display text-6xl italic text-bone-100">
          That parfum has drifted away.
        </h1>
        <p className="mt-4 max-w-md text-bone-300">
          The URL you followed does not lead to any fragrance in the anthology.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <MagneticButton variant="primary" onClick={() => (window.location.href = '/fragrances')}>
            Browse fragrances
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------- SMALL --- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
      {children}
    </div>
  )
}

function Meta({
  label,
  value,
  span = false
}: {
  label: string
  value: string
  span?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-bone-100/10 bg-black/25 p-4 ${
        span ? 'col-span-2' : ''
      }`}
    >
      <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/60">
        {label}
      </div>
      <div className="mt-1 font-display text-xl text-bone-100">{value}</div>
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
            {i < notes.length - 1 && <span className="text-bone-300/40">·</span>}
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
