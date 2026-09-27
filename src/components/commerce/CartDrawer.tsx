import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { fragrances, formatPrice } from '../../data/products'
import { QuantityStepper } from './QuantityStepper'

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeCart])

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-drawer"
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-bone-100/10 bg-ink-950/95 shadow-[-40px_0_60px_rgba(0,0,0,0.5)]"
          >
            <div className="pointer-events-none absolute inset-0">
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    'radial-gradient(120% 60% at 80% 10%, rgba(201,168,120,0.16), transparent 55%)'
                }}
              />
              <div className="grain absolute inset-0" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-bone-100/10 px-6 py-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                  Your selection
                </div>
                <div className="mt-1 font-display text-2xl italic text-bone-100">
                  Cart · {items.length} {items.length === 1 ? 'parfum' : 'parfums'}
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                data-cursor="button"
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
            <div className="relative flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
              {items.length === 0 ? (
                <EmptyCart onClose={closeCart} />
              ) : (
                <ul className="flex flex-col divide-y divide-bone-100/10">
                  <AnimatePresence initial={false}>
                    {items.map((it) => {
                      const product = fragrances.find((p) => p.id === it.productId)
                      if (!product) return null
                      return (
                        <motion.li
                          key={`${it.productId}-${it.selectedSize}`}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="grid grid-cols-[80px_1fr] gap-4 py-5"
                        >
                          <Link
                            to={`/fragrances/${product.slug}`}
                            onClick={closeCart}
                            data-cursor="product"
                            data-cursor-label="View"
                            className="relative aspect-[4/5] overflow-hidden rounded-lg border border-bone-100/10 bg-ink-900"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover opacity-80"
                            />
                            <div
                              className="absolute inset-0 mix-blend-multiply"
                              style={{
                                background: `radial-gradient(circle at 30% 20%, ${product.accent}44, transparent 60%)`
                              }}
                            />
                          </Link>
                          <div className="flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <Link
                                  to={`/fragrances/${product.slug}`}
                                  onClick={closeCart}
                                  className="font-display text-lg leading-tight text-bone-100 hover:text-champagne-400"
                                >
                                  {product.name}
                                </Link>
                                <button
                                  onClick={() => removeItem(it.productId, it.selectedSize)}
                                  data-cursor="button"
                                  aria-label={`Remove ${product.name}`}
                                  className="mt-1 text-bone-300/60 transition hover:text-champagne-400"
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
                              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest2 text-bone-300/60">
                                {product.fragranceFamily} · {it.selectedSize} ML
                              </div>
                            </div>
                            <div className="mt-3 flex items-end justify-between">
                              <QuantityStepper
                                value={it.quantity}
                                onChange={(q) =>
                                  updateQuantity(it.productId, it.selectedSize, q)
                                }
                                max={product.stock || 99}
                                ariaLabel={`Quantity for ${product.name}`}
                              />
                              <div className="text-right">
                                <div className="font-display text-lg text-bone-100">
                                  {formatPrice(it.price * it.quantity)}
                                </div>
                                <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/50">
                                  {formatPrice(it.price)} ea
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative border-t border-bone-100/10 bg-ink-950/85 px-6 py-5 backdrop-blur">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                      Subtotal
                    </div>
                    <motion.div
                      key={subtotal}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-1 font-display text-3xl text-bone-100"
                    >
                      {formatPrice(subtotal)}
                    </motion.div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-widest2 text-bone-300/45">
                      Shipping calculated at checkout
                    </div>
                  </div>
                  <button
                    onClick={clearCart}
                    data-cursor="button"
                    className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60 transition hover:text-champagne-400"
                  >
                    Clear
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  data-cursor="button"
                  className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full border border-champagne-500/60 bg-champagne-500/10 py-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100 transition hover:bg-champagne-500/20"
                >
                  Proceed to checkout
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  >
                    <path
                      d="M1 7h11m0 0L8 3m4 4L8 11"
                      stroke="currentColor"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Nothing chosen yet
      </div>
      <h4 className="font-display text-3xl italic text-bone-100">Your cart is quiet.</h4>
      <p className="max-w-xs text-bone-300/80">
        Wander through the anthology and pick a parfum that reads like you.
      </p>
      <Link
        to="/fragrances"
        onClick={onClose}
        data-cursor="button"
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-champagne-500/60 bg-champagne-500/10 px-6 py-3 font-mono text-[11px] uppercase tracking-widest2 text-bone-100 hover:bg-champagne-500/20"
      >
        Browse fragrances
      </Link>
    </div>
  )
}
