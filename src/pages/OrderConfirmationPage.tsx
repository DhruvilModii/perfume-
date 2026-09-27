import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { WordsReveal } from '../components/atoms/TextReveal'
import { CartItem } from '../context/CartContext'
import { Fragrance, formatPrice } from '../data/products'

interface DemoOrder {
  ref: string
  placedAt: string
  demo?: boolean
  customer: { name: string; email: string; phone: string }
  shipping: {
    address: string
    city: string
    state: string
    postal: string
    country: string
  }
  items: Array<CartItem & { product: Fragrance | null }>
  totals: { subtotal: number; shippingFee: number; total: number }
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<DemoOrder | null>(null)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('maison-noir.order.latest')
      if (raw) setOrder(JSON.parse(raw))
    } catch {
      setOrder(null)
    }
  }, [])

  if (!order) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 pt-28 text-center">
        <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
          Nothing to confirm
        </div>
        <h1 className="font-display text-6xl italic text-bone-100">
          No recent order.
        </h1>
        <p className="max-w-md text-bone-300">
          Complete a checkout to see the confirmation here.
        </p>
        <MagneticButton
          variant="primary"
          onClick={() => (window.location.href = '/fragrances')}
        >
          Browse fragrances
        </MagneticButton>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink-950 pt-28">
      <div className="grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.2),transparent_70%)] blur-3xl"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-12 gap-8 px-6 pb-20">
        <div className="col-span-12 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-champagne-500/60 bg-champagne-500/10"
          >
            <svg width="22" height="22" viewBox="0 0 22 22">
              <motion.path
                d="M4 11l5 5 9-11"
                stroke="#e0c99a"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </motion.div>
          <div className="mb-4 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400">
            Order received
          </div>
          <h1 className="font-display text-5xl italic leading-[0.95] text-bone-100 md:text-6xl">
            <WordsReveal text="Thank you." />
          </h1>
          <p className="mt-4 text-bone-300">
            Order reference{' '}
            <span className="font-mono text-champagne-400">{order.ref}</span> ·{' '}
            {new Date(order.placedAt).toLocaleString()}
          </p>
          {order.demo && (
            <p className="mt-3 inline-block rounded-full border border-champagne-500/40 bg-champagne-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              Frontend demo — no real order was placed
            </p>
          )}
        </div>

        <div className="col-span-12 mt-6 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7">
            <div className="rounded-2xl border border-bone-100/10 bg-ink-900/60 p-6 backdrop-blur">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                What you ordered
              </div>
              <ul className="divide-y divide-bone-100/10">
                {order.items.map((it) => (
                  <li
                    key={`${it.productId}-${it.selectedSize}`}
                    className="grid grid-cols-[60px_1fr_auto] items-center gap-4 py-3"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md border border-bone-100/10 bg-ink-900">
                      {it.product && (
                        <img
                          src={it.product.image}
                          alt=""
                          className="h-full w-full object-cover opacity-80"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-display text-base leading-tight text-bone-100">
                        {it.product?.name ?? 'Fragrance'}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/60">
                        {it.selectedSize} ML · ×{it.quantity}
                      </div>
                    </div>
                    <div className="font-display text-base text-bone-100">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-bone-100/10 pt-4 font-mono text-[11px] uppercase tracking-widest2">
                <Row k="Subtotal" v={formatPrice(order.totals.subtotal)} />
                <Row k="Shipping" v={formatPrice(order.totals.shippingFee)} />
                <div className="mt-3 flex items-baseline justify-between border-t border-bone-100/10 pt-3">
                  <span className="text-bone-300/60">Total</span>
                  <span className="font-display text-2xl text-bone-100">
                    {formatPrice(order.totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="rounded-2xl border border-bone-100/10 bg-ink-900/60 p-6 backdrop-blur">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                Ships to
              </div>
              <div className="font-display text-lg text-bone-100">
                {order.customer.name}
              </div>
              <div className="mt-1 text-sm text-bone-300">
                {order.shipping.address}
                <br />
                {order.shipping.city}, {order.shipping.state} {order.shipping.postal}
                <br />
                {order.shipping.country}
              </div>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
                {order.customer.email} · {order.customer.phone}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <MagneticButton
                variant="primary"
                onClick={() => (window.location.href = '/fragrances')}
              >
                Continue reading
              </MagneticButton>
              <Link
                to="/"
                data-cursor="button"
                className="font-mono text-[11px] uppercase tracking-widest2 text-bone-100/70 hover:text-champagne-400"
              >
                Return home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-bone-300/60">{k}</span>
      <span className="text-bone-100">{v}</span>
    </div>
  )
}
