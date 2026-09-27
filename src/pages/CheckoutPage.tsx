import { AnimatePresence, motion } from 'framer-motion'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { WordsReveal } from '../components/atoms/TextReveal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatPrice, fragrances } from '../data/products'
import { FormError, FormInput, FormLabel } from './account/AccountShell'

type Step = 0 | 1 | 2

interface Info {
  name: string
  email: string
  phone: string
}
interface Shipping {
  address: string
  city: string
  state: string
  postal: string
  country: string
}

const SHIPPING_FEE = 250 // demo flat shipping

export default function CheckoutPage() {
  const cart = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(0)
  const [info, setInfo] = useState<Info>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: ''
  })
  const [shipping, setShipping] = useState<Shipping>({
    address: '',
    city: '',
    state: '',
    postal: '',
    country: 'India'
  })
  const [error, setError] = useState<string | null>(null)
  const placingRef = useRef(false)

  useEffect(() => {
    if (placingRef.current) return
    if (cart.items.length === 0) {
      // Nothing to check out; bounce back to fragrances.
      navigate('/fragrances', { replace: true })
    }
  }, [cart.items.length, navigate])

  const subtotal = cart.subtotal
  const shippingFee = subtotal > 0 ? SHIPPING_FEE : 0
  const total = subtotal + shippingFee

  const validateInfo = () => {
    if (!info.name.trim()) return 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) return 'Enter a valid email.'
    if (!info.phone.trim()) return 'Please enter a phone number.'
    return null
  }
  const validateShipping = () => {
    if (!shipping.address.trim()) return 'Please enter your address.'
    if (!shipping.city.trim()) return 'Please enter your city.'
    if (!shipping.state.trim()) return 'Please enter your state.'
    if (!shipping.postal.trim()) return 'Please enter a postal code.'
    if (!shipping.country.trim()) return 'Please enter your country.'
    return null
  }

  const goNext = () => {
    let err: string | null = null
    if (step === 0) err = validateInfo()
    if (step === 1) err = validateShipping()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setStep((s) => (s < 2 ? ((s + 1) as Step) : s))
  }

  const goPrev = () => {
    setError(null)
    setStep((s) => (s > 0 ? ((s - 1) as Step) : s))
  }

  const placeOrder = () => {
    // Compose demo order object, store in sessionStorage, then navigate.
    const orderRef = `MN-${Date.now().toString(36).toUpperCase()}`
    const order = {
      ref: orderRef,
      placedAt: new Date().toISOString(),
      demo: true,
      customer: info,
      shipping,
      items: cart.items.map((it) => ({
        ...it,
        product:
          fragrances.find((f) => f.id === it.productId) ?? null
      })),
      totals: { subtotal, shippingFee, total }
    }
    try {
      window.sessionStorage.setItem('maison-noir.order.latest', JSON.stringify(order))
    } catch {
      /* ignore */
    }
    placingRef.current = true
    cart.clearCart()
    navigate('/order/confirmation', { replace: true })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (step < 2) goNext()
    else placeOrder()
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink-950 pt-28">
      <div className="grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.14),transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 px-6 pb-20">
        <div className="col-span-12 mb-6">
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400">
            <span className="h-px w-10 bg-champagne-500/50" />
            Checkout
          </div>
          <h1 className="mt-3 font-display text-5xl italic leading-[0.95] text-bone-100 md:text-6xl">
            <WordsReveal text="Complete your order." />
          </h1>
          <Stepper step={step} />
        </div>

        {/* Left: forms */}
        <div className="col-span-12 md:col-span-7">
          <form onSubmit={submit} noValidate>
            <div className="relative overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-900/70 p-6 backdrop-blur-xl md:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <StepPanel key="info" title="Information">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FormLabel>Full name</FormLabel>
                        <FormInput
                          value={info.name}
                          onChange={(e) => setInfo({ ...info, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel>Email</FormLabel>
                        <FormInput
                          type="email"
                          value={info.email}
                          onChange={(e) => setInfo({ ...info, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel>Phone</FormLabel>
                        <FormInput
                          type="tel"
                          value={info.phone}
                          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                          placeholder="+91"
                          required
                        />
                      </div>
                    </div>
                    {!isAuthenticated && (
                      <div className="mt-6 rounded-lg border border-champagne-500/25 bg-champagne-500/5 px-4 py-3 text-xs leading-relaxed text-bone-100/80">
                        You are checking out as a guest.{' '}
                        <Link
                          to="/account/login"
                          state={{ from: '/checkout' }}
                          className="text-champagne-400 hover:underline"
                        >
                          Sign in
                        </Link>{' '}
                        to save this order to your account.
                      </div>
                    )}
                  </StepPanel>
                )}

                {step === 1 && (
                  <StepPanel key="shipping" title="Shipping">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormInput
                          value={shipping.address}
                          onChange={(e) =>
                            setShipping({ ...shipping, address: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <FormLabel>City</FormLabel>
                        <FormInput
                          value={shipping.city}
                          onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <FormLabel>State</FormLabel>
                        <FormInput
                          value={shipping.state}
                          onChange={(e) =>
                            setShipping({ ...shipping, state: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <FormLabel>Postal code</FormLabel>
                        <FormInput
                          value={shipping.postal}
                          onChange={(e) =>
                            setShipping({ ...shipping, postal: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <FormLabel>Country</FormLabel>
                        <FormInput
                          value={shipping.country}
                          onChange={(e) =>
                            setShipping({ ...shipping, country: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </StepPanel>
                )}

                {step === 2 && (
                  <StepPanel key="review" title="Review & Pay">
                    <ReviewList />
                    <div className="mt-6 rounded-xl border border-champagne-500/25 bg-champagne-500/5 p-5">
                      <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                        Payment
                      </div>
                      <div className="mt-2 font-display text-xl text-bone-100">
                        Payment gateway integration will be connected here.
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-bone-300/80">
                        No real payment is processed. This checkout is currently
                        a frontend demo — once a payment provider is connected,
                        card / UPI / net-banking flows will appear in this panel.
                      </p>
                    </div>
                  </StepPanel>
                )}
              </AnimatePresence>

              <FormError message={error} />

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={step === 0}
                  data-cursor="button"
                  className="font-mono text-[11px] uppercase tracking-widest2 text-bone-100/70 transition hover:text-champagne-400 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Back
                </button>
                <MagneticButton variant="primary">
                  {step < 2 ? 'Continue' : 'Place order'}
                </MagneticButton>
              </div>
            </div>
          </form>
        </div>

        {/* Right: summary */}
        <div className="col-span-12 md:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-bone-100/10 bg-ink-900/60 p-6 backdrop-blur-xl">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              Order summary
            </div>
            <ul className="mt-4 divide-y divide-bone-100/10">
              {cart.items.map((it) => {
                const product = fragrances.find((p) => p.id === it.productId)
                if (!product) return null
                return (
                  <li
                    key={`${it.productId}-${it.selectedSize}`}
                    className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-3"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md border border-bone-100/10 bg-ink-900">
                      <img src={product.image} alt="" className="h-full w-full object-cover opacity-80" />
                    </div>
                    <div>
                      <div className="font-display text-base leading-tight text-bone-100">
                        {product.name}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-widest2 text-bone-300/60">
                        {it.selectedSize} ML · ×{it.quantity}
                      </div>
                    </div>
                    <div className="font-display text-base text-bone-100">
                      {formatPrice(it.price * it.quantity)}
                    </div>
                  </li>
                )
              })}
            </ul>
            <Totals subtotal={subtotal} shipping={shippingFee} total={total} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stepper({ step }: { step: Step }) {
  const labels = ['Information', 'Shipping', 'Review']
  return (
    <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest2">
      {labels.map((l, i) => {
        const active = i === step
        const done = i < step
        return (
          <div key={l} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
                done
                  ? 'border-champagne-500/60 bg-champagne-500/15 text-champagne-400'
                  : active
                  ? 'border-champagne-500/70 text-champagne-400'
                  : 'border-bone-100/15 text-bone-300/50'
              }`}
            >
              {done ? '✓' : String(i + 1).padStart(2, '0')}
            </span>
            <span className={active ? 'text-champagne-400' : 'text-bone-300/60'}>
              {l}
            </span>
            {i < labels.length - 1 && (
              <span className="mx-1 h-px w-8 bg-bone-100/15" />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-champagne-500/50" />
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  )
}

function ReviewList() {
  const cart = useCart()
  const list = useMemo(
    () =>
      cart.items.map((it) => {
        const product = fragrances.find((p) => p.id === it.productId)
        return { ...it, product }
      }),
    [cart.items]
  )
  return (
    <div>
      <ul className="divide-y divide-bone-100/10">
        {list.map((it) => (
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
              <div className="font-display text-base text-bone-100">
                {it.product?.name}
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
    </div>
  )
}

function Totals({
  subtotal,
  shipping,
  total
}: {
  subtotal: number
  shipping: number
  total: number
}) {
  return (
    <div className="mt-4 space-y-2 border-t border-bone-100/10 pt-4 font-mono text-[11px] uppercase tracking-widest2">
      <Row k="Subtotal" v={formatPrice(subtotal)} />
      <Row k="Shipping" v={formatPrice(shipping)} />
      <div className="mt-3 flex items-baseline justify-between border-t border-bone-100/10 pt-3">
        <span className="text-bone-300/60">Total</span>
        <span className="font-display text-2xl text-bone-100">{formatPrice(total)}</span>
      </div>
    </div>
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
