import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { WordsReveal } from '../components/atoms/TextReveal'
import { StarRating } from '../components/commerce/StarRating'
import { WishlistButton } from '../components/commerce/WishlistButton'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice, fragrances, minSizePrice } from '../data/products'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const cart = useCart()
  const navigate = useNavigate()
  const items = fragrances.filter((f) => ids.includes(f.id))

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink-950 pt-32">
        <div
          aria-hidden
          className="absolute left-[10%] top-[10%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.18),transparent_70%)] blur-3xl"
        />
        <div className="grain absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16">
          <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400">
            <span className="h-px w-10 bg-champagne-500/50" />
            Your wishlist
          </div>
          <h1 className="font-display text-[12vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[7vw]">
            <div className="overflow-hidden">
              <WordsReveal text="Kept close." />
            </div>
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed text-bone-300">
            The parfums you have set aside — return to them, or move them into
            your cart when the moment is right.
          </p>
        </div>
      </section>

      <section className="relative bg-ink-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          {items.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="grid grid-cols-12 gap-6">
              {items.map((f) => (
                <motion.article
                  key={f.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group col-span-12 overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-900/60 backdrop-blur sm:col-span-6 lg:col-span-4"
                >
                  <Link
                    to={`/fragrances/${f.slug}`}
                    data-cursor="product"
                    data-cursor-label="View"
                    className="relative block aspect-[4/5] overflow-hidden"
                  >
                    <motion.img
                      src={f.image}
                      alt={f.name}
                      loading="lazy"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full w-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
                    <div
                      className="absolute inset-0 mix-blend-multiply"
                      style={{
                        background: `radial-gradient(circle at 30% 20%, ${f.accent}33, transparent 60%)`
                      }}
                    />
                    <div className="absolute right-4 top-4">
                      <WishlistButton productId={f.id} size="md" stopPropagation />
                    </div>
                    <div className="absolute inset-x-5 bottom-5">
                      <div className="font-mono text-[9px] uppercase tracking-widest2 text-champagne-400">
                        {f.brand} · No. {f.index}
                      </div>
                      <div className="mt-1 font-display text-2xl italic text-bone-100">
                        {f.name}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-3 border-t border-bone-100/10 px-5 py-4">
                    <div>
                      <StarRating value={f.rating} reviewCount={f.reviewCount} />
                      <div className="mt-1 font-display text-xl text-bone-100">
                        from {formatPrice(minSizePrice(f))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => {
                          cart.addItem(f, f.sizes[0].ml, 1)
                          cart.openCart()
                        }}
                        data-cursor="button"
                        className="rounded-full border border-champagne-500/60 bg-champagne-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-100 transition hover:bg-champagne-500/20"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/fragrances/${f.slug}`)}
                        data-cursor="button"
                        className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60 transition hover:text-champagne-400"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-bone-100/10 bg-ink-900/50 p-16 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Nothing kept aside yet
      </div>
      <h4 className="font-display text-3xl italic text-bone-100">
        The wishlist is empty.
      </h4>
      <p className="max-w-sm text-bone-300/80">
        Tap the heart on any parfum to keep it in your list — you can move it
        into the cart later.
      </p>
      <MagneticButton
        variant="primary"
        onClick={() => (window.location.href = '/fragrances')}
      >
        Browse fragrances
      </MagneticButton>
    </div>
  )
}
