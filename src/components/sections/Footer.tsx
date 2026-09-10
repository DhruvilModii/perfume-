import { motion } from 'framer-motion'
import { useState } from 'react'
import { WordsReveal } from '../atoms/TextReveal'

/**
 * The final scene. A cinematic, oversized closing statement, three legible
 * columns of information beneath it, and a soft signature line at the bottom.
 */
export function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-bone-100/10 bg-ink-950 pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(201,168,120,0.18),transparent_60%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* Big closing line */}
        <div className="pb-16">
          <h2 className="font-display text-[19vw] leading-[0.85] tracking-tightest text-bone-100 md:text-[13vw]">
            <div className="overflow-hidden">
              <WordsReveal text="Scent" />
            </div>
            <div className="overflow-hidden italic">
              <WordsReveal text="your" delay={0.15} />
            </div>
            <div className="overflow-hidden text-champagne-400">
              <WordsReveal text="story." delay={0.3} />
            </div>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-8 border-t border-bone-100/10 py-12">
          <div className="col-span-12 md:col-span-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-champagne-500/40 bg-black/40 font-display italic text-champagne-400">
                M
              </span>
              <span className="font-display text-lg tracking-widest2 text-bone-100">
                MAISON <span className="italic">Noir</span>
              </span>
            </div>
            <p className="max-w-xs font-light leading-relaxed text-bone-300/80">
              A dark parfumerie house. Slow-crafted extraits, made in Grasse,
              rested for a full moon, delivered in oak.
            </p>
            <div className="mt-8 flex gap-3">
              <SocialPill label="Instagram" />
              <SocialPill label="Pinterest" />
              <SocialPill label="Journal" />
            </div>
          </div>

          <div className="col-span-6 md:col-span-2">
            <FooterCol
              title="House"
              items={['About', 'The Perfumer', 'Ateliers', 'Journal']}
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <FooterCol
              title="Discover"
              items={['Signature', 'Anthology', 'Coffret', 'Discovery Set']}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Newsletter />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-bone-100/10 py-8 md:flex-row md:items-center md:justify-between">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
            © 2024 – 2026 Maison Noir · All parfums numbered
          </div>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
            <a href="#" data-cursor="button" className="hover:text-bone-100">
              Privacy
            </a>
            <a href="#" data-cursor="button" className="hover:text-bone-100">
              Terms
            </a>
            <a href="#" data-cursor="button" className="hover:text-bone-100">
              Care & Longevity
            </a>
          </div>
        </div>
      </div>

      {/* Huge outlined tag */}
      <div className="pointer-events-none relative z-0 -mt-8 overflow-hidden pb-4">
        <div className="text-outline whitespace-nowrap text-center font-display text-[24vw] italic leading-none">
          maison·noir·maison
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-4 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it}>
            <a
              href="#"
              data-cursor="button"
              className="group inline-flex items-center gap-1 text-bone-100/80 transition-colors hover:text-bone-100"
            >
              <span>{it}</span>
              <span className="inline-block translate-y-[-1px] text-champagne-400 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialPill({ label }: { label: string }) {
  return (
    <a
      href="#"
      data-cursor="button"
      className="inline-flex items-center gap-2 rounded-full border border-bone-100/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest2 text-bone-100/70 transition hover:border-champagne-500/60 hover:text-champagne-400"
    >
      <span className="h-1 w-1 rounded-full bg-champagne-400" />
      {label}
    </a>
  )
}

function Newsletter() {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value) return
    setSent(true)
    setTimeout(() => setSent(false), 3200)
    setValue('')
  }
  return (
    <div>
      <div className="mb-4 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
        Correspondence
      </div>
      <p className="mb-4 max-w-xs font-light leading-relaxed text-bone-300/80">
        Rare drops. Perfumer's letters. Never more than once a month.
      </p>
      <form
        onSubmit={submit}
        className="group relative flex items-center gap-2 border-b border-bone-100/20 pb-2 transition-colors focus-within:border-champagne-500/70"
      >
        <input
          type="email"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="your@address"
          className="flex-1 bg-transparent py-1 font-light text-bone-100 outline-none placeholder:text-bone-300/40"
        />
        <button
          type="submit"
          data-cursor="button"
          className="font-mono text-[10px] uppercase tracking-widest2 text-bone-100 transition hover:text-champagne-400"
        >
          Subscribe →
        </button>
      </form>
      <motion.div
        initial={false}
        animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : -4 }}
        transition={{ duration: 0.4 }}
        className="mt-3 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400"
        aria-live="polite"
      >
        {sent ? 'Received. Watch for the moon.' : ''}
      </motion.div>
    </div>
  )
}
