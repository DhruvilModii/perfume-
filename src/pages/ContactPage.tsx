import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { GlassCard } from '../components/atoms/GlassCard'
import { MagneticButton } from '../components/atoms/MagneticButton'
import { TextReveal, WordsReveal } from '../components/atoms/TextReveal'

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSurface />
      <FAQ />
      <ContactFinalCTA />
    </>
  )
}

/* ---------------------------------------------------------- HERO --- */

function ContactHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const eyebrowY = useTransform(scrollYProgress, [0, 1], [0, -60])

  // Cursor light trail
  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)
  const scx = useSpring(cx, { damping: 30, stiffness: 200, mass: 0.4 })
  const scy = useSpring(cy, { damping: 30, stiffness: 200, mass: 0.4 })

  useEffect(() => {
    const h = (e: PointerEvent) => {
      cx.set(e.clientX)
      cy.set(e.clientY)
    }
    window.addEventListener('pointermove', h, { passive: true })
    return () => window.removeEventListener('pointermove', h)
  }, [cx, cy])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[95vh] items-center overflow-hidden bg-ink-950 pt-24"
    >
      {/* Pointer-following soft light */}
      <motion.div
        aria-hidden
        style={{ x: scx, y: scy }}
        className="pointer-events-none fixed left-0 top-0 z-0 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.18),transparent_70%)] blur-3xl"
      />

      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(201,168,120,0.10),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(176,102,85,0.10),transparent_50%)]" />
      </motion.div>

      <div className="grain absolute inset-0" />
      <div className="vignette absolute inset-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-6 px-6">
        <div className="col-span-12 md:col-span-8">
          <motion.div
            style={{ y: eyebrowY }}
            className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/70"
          >
            <span className="h-px w-10 bg-champagne-500/50" />
            Let’s connect
          </motion.div>
          <motion.h1
            style={{ y: headlineY }}
            className="font-display text-[14vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[8.5vw]"
          >
            <div className="overflow-hidden">
              <WordsReveal text="Every story" />
            </div>
            <div className="overflow-hidden">
              <WordsReveal text="starts with" delay={0.15} />
            </div>
            <div className="overflow-hidden italic text-champagne-400">
              <WordsReveal text="a conversation." delay={0.3} />
            </div>
          </motion.h1>
          <TextReveal delay={0.8} as="p" className="mt-10 block max-w-lg">
            <span className="font-light leading-relaxed text-bone-300">
              Write to us about a fragrance, a private commission, or a small
              gift set. We reply personally. Never before dawn, never after
              dusk.
            </span>
          </TextReveal>
        </div>
        <div className="col-span-12 md:col-span-4">
          <ContactStat />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-bone-100/60">
        <span>Come closer</span>
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

function ContactStat() {
  return (
    <GlassCard tint="warm" className="p-6 md:p-8">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Response window
      </div>
      <div className="mt-2 font-display text-4xl italic text-bone-100">
        Within 24 hours
      </div>
      <div className="mt-1 text-sm text-bone-300/80">
        Monday to Saturday · 10:00 – 19:00 IST
      </div>
      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-champagne-500/40 to-transparent" />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
            Currently in
          </div>
          <div className="mt-1 text-bone-100">Grasse, France</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
            Next atelier
          </div>
          <div className="mt-1 text-bone-100">Bombay, Nov 2026</div>
        </div>
      </div>
    </GlassCard>
  )
}

/* ------------------------------------------------- CONTACT FORM --- */

interface ContactPayload {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const initial: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  subject: 'General',
  message: ''
}

function ContactSurface() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const bgWarmth = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-950 py-32"
    >
      <motion.div
        style={{ opacity: bgWarmth }}
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(201,168,120,0.14),transparent_60%)]" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 px-6">
        <div className="col-span-12 md:col-span-5">
          <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
            <span>01</span>
            <span className="h-px w-16 bg-champagne-500/40" />
            Write to us
          </div>
          <h2 className="font-display text-5xl italic leading-[0.95] text-bone-100 md:text-6xl">
            <TextReveal>Send us</TextReveal>
            <br />
            <TextReveal delay={0.1}>a small letter.</TextReveal>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-bone-300">
            Tell us the fragrance you love, the memory you want to bottle, or
            the question you have. The perfumer reads every message.
          </p>

          <ContactInfo />
        </div>

        <div className="col-span-12 md:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function ContactInfo() {
  const items = [
    { label: 'Email', value: 'hello@maison-noir.example', href: 'mailto:hello@maison-noir.example' },
    { label: 'Phone', value: '+33 4 93 00 00 00' },
    { label: 'Atelier', value: '12 Rue du Moulinet, Grasse' },
    { label: 'Hours', value: 'Mon – Sat · 10:00 – 19:00' }
  ]
  return (
    <div className="mt-12 space-y-4 border-t border-bone-100/10 pt-8">
      {items.map((i) => (
        <div key={i.label} className="flex items-start gap-4">
          <div className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
            {i.label}
          </div>
          {i.href ? (
            <a
              href={i.href}
              data-cursor="button"
              className="group inline-flex items-center gap-2 border-b border-transparent text-bone-100 transition hover:border-champagne-500/60"
            >
              {i.value}
              <span className="translate-y-[-1px] text-champagne-400 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                →
              </span>
            </a>
          ) : (
            <span className="text-bone-100">{i.value}</span>
          )}
        </div>
      ))}
      <div className="mt-6 flex gap-2">
        {['Instagram', 'Pinterest', 'Journal'].map((s) => (
          <a
            key={s}
            href="#"
            data-cursor="button"
            className="inline-flex items-center gap-2 rounded-full border border-bone-100/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-bone-100/70 transition hover:border-champagne-500/60 hover:text-champagne-400"
          >
            <span className="h-1 w-1 rounded-full bg-champagne-400" />
            {s}
          </a>
        ))}
      </div>
    </div>
  )
}

function ContactForm() {
  const [data, setData] = useState<ContactPayload>(initial)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({})

  const validate = useMemo(
    () => (d: ContactPayload) => {
      const e: typeof errors = {}
      if (!d.name.trim()) e.name = 'Please share your name.'
      if (!d.email.trim()) e.email = 'Please share your email.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
        e.email = 'That email doesn’t look right.'
      if (!d.message.trim() || d.message.trim().length < 10)
        e.message = 'A few more words would help.'
      return e
    },
    []
  )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const eObj = validate(data)
    setErrors(eObj)
    if (Object.keys(eObj).length) return
    setStatus('sending')
    // Frontend-only demo — never actually delivered. The confirmation state
    // makes this clear to the visitor. Wire to a backend when ready.
    await new Promise((r) => setTimeout(r, 900))
    setStatus('sent')
  }

  const reset = () => {
    setData(initial)
    setStatus('idle')
    setErrors({})
  }

  return (
    <GlassCard tint="deep" className="relative overflow-hidden p-6 md:p-10">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <SuccessState key="sent" onReset={reset} />
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            noValidate
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
              Correspondence — demo form
            </div>
            <div className="mb-6 text-xs text-bone-300/60">
              This form is for design preview. Messages are not delivered until
              a backend is connected.
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                id="name"
                label="Name"
                value={data.name}
                onChange={(v) => setData({ ...data, name: v })}
                error={errors.name}
                required
              />
              <Field
                id="email"
                type="email"
                label="Email"
                value={data.email}
                onChange={(v) => setData({ ...data, email: v })}
                error={errors.email}
                required
              />
              <Field
                id="phone"
                type="tel"
                label="Phone (optional)"
                value={data.phone}
                onChange={(v) => setData({ ...data, phone: v })}
              />
              <div>
                <FieldShellLabel htmlFor="subject">Subject</FieldShellLabel>
                <div className="relative">
                  <select
                    id="subject"
                    value={data.subject}
                    onChange={(e) => setData({ ...data, subject: e.target.value })}
                    className="peer w-full appearance-none rounded-lg border border-bone-100/15 bg-black/30 px-4 py-3 text-bone-100 outline-none transition focus:border-champagne-500/70 focus:ring-2 focus:ring-champagne-500/25"
                  >
                    <option className="bg-ink-900">General</option>
                    <option className="bg-ink-900">Private commission</option>
                    <option className="bg-ink-900">Gifting</option>
                    <option className="bg-ink-900">Press</option>
                    <option className="bg-ink-900">Wholesale</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-bone-100/50"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="M1 3l4 4 4-4"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <FieldShellLabel htmlFor="message">Message</FieldShellLabel>
              <textarea
                id="message"
                rows={5}
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
                required
                minLength={10}
                aria-invalid={!!errors.message}
                className={`peer w-full rounded-lg border bg-black/30 px-4 py-3 text-bone-100 outline-none transition focus:ring-2 focus:ring-champagne-500/25 ${
                  errors.message
                    ? 'border-red-400/60'
                    : 'border-bone-100/15 focus:border-champagne-500/70'
                }`}
                placeholder="Write your letter…"
              />
              {errors.message && (
                <div className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-red-300/80">
                  {errors.message}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="max-w-sm text-xs text-bone-300/60">
                By sending, you agree to our correspondence policy — a small,
                slow list, never sold, never spammed.
              </div>
              <MagneticButton variant="primary">
                {status === 'sending' ? 'Sealing…' : 'Send message'}
              </MagneticButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <FieldShellLabel htmlFor={id}>{label}</FieldShellLabel>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`peer w-full rounded-lg border bg-black/30 px-4 py-3 text-bone-100 outline-none transition focus:ring-2 focus:ring-champagne-500/25 ${
          error
            ? 'border-red-400/60'
            : 'border-bone-100/15 focus:border-champagne-500/70'
        }`}
      />
      {error && (
        <div className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-red-300/80">
          {error}
        </div>
      )}
    </div>
  )
}

function FieldShellLabel({
  htmlFor,
  children
}: {
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[10px] uppercase tracking-widest2 text-bone-300/70"
    >
      {children}
    </label>
  )
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4 py-10 text-center"
    >
      <motion.svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        initial={{ scale: 0.8, rotate: -6 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.circle
          cx="36"
          cy="36"
          r="32"
          stroke="#c9a878"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M22 37l10 10 20-22"
          stroke="#e0c99a"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.svg>
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Preview submission received
      </div>
      <h3 className="font-display text-4xl italic leading-tight text-bone-100">
        Your message has been sealed.
      </h3>
      <p className="max-w-md text-bone-300">
        This form is a design preview — nothing has left your device. When a
        backend is wired up, we’ll reply personally within a day.
      </p>
      <button
        onClick={onReset}
        data-cursor="button"
        className="mt-3 inline-flex items-center gap-2 border-b border-champagne-500/60 pb-1 font-mono text-[11px] uppercase tracking-widest2 text-bone-100"
      >
        Write another letter
      </button>
    </motion.div>
  )
}

/* ---------------------------------------------------------- FAQ --- */

const faq = [
  {
    q: 'How long does delivery take?',
    a: 'Placeholder — we typically ship within a few days from our nearest atelier. Actual times will be added when logistics are finalised.'
  },
  {
    q: 'Which fragrance should I choose?',
    a: 'Write to us with a scent memory you love and we’ll suggest two parfums from the anthology that quietly match.'
  },
  {
    q: 'Do you offer samples?',
    a: 'Yes — a discovery set with 2 ml vials of all five parfums is available on request while stocks last.'
  },
  {
    q: 'How can I contact the fragrance team?',
    a: 'Use the letter above, or write to hello@maison-noir.example — placeholder address until we announce the real one.'
  }
]

function FAQ() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
              <span>02</span>
              <span className="h-px w-16 bg-champagne-500/40" />
              A few gentle answers
            </div>
            <h2 className="font-display text-5xl italic leading-[0.95] text-bone-100 md:text-6xl">
              <TextReveal>Before you</TextReveal>
              <br />
              <TextReveal delay={0.1}>write.</TextReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7">
            <div className="border-t border-bone-100/10">
              {faq.map((item, i) => (
                <FAQItem
                  key={item.q}
                  item={item}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                  visible={inView}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQItem({
  item,
  open,
  onToggle,
  visible,
  delay
}: {
  item: (typeof faq)[number]
  open: boolean
  onToggle: () => void
  visible: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-bone-100/10"
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        data-cursor="button"
        className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-champagne-400"
      >
        <span className="font-display text-xl text-bone-100 group-hover:text-champagne-400 md:text-2xl">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bone-100/15"
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M5 1v8M1 5h8"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-12 leading-relaxed text-bone-300">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ---------------------------------------------------- FINAL CTA --- */

function ContactFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.16),transparent_70%)] blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="mb-8 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/60">
          <span className="h-px w-12 bg-champagne-500/40" />
          Come closer
          <span className="h-px w-12 bg-champagne-500/40" />
        </div>
        <h2 className="font-display text-[13vw] leading-[0.9] tracking-tightest text-bone-100 md:text-[8vw]">
          <div className="overflow-hidden">
            <WordsReveal text="Leave a message." />
          </div>
          <div className="overflow-hidden italic text-champagne-400">
            <WordsReveal text="Leave an impression." delay={0.15} />
          </div>
        </h2>
        <div className="mt-10 flex justify-center gap-3">
          <MagneticButton
            variant="primary"
            onClick={() => {
              document
                .querySelector('form')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
          >
            Get in touch
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
