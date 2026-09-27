import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Shared premium wrapper for /account/* pages — matches the site's dark
 * glass aesthetic without introducing new UI primitives.
 */
export function AccountShell({ eyebrow, title, subtitle, children, footer }: Props) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink-950 pt-28">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(201,168,120,0.18),transparent_70%)] blur-3xl"
      />
      <div className="grain absolute inset-0" />
      <div className="vignette absolute inset-0" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-12 gap-8 px-6 py-16">
        <div className="col-span-12 flex flex-col justify-center md:col-span-5">
          <div className="mb-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-champagne-400">
            <span className="h-px w-10 bg-champagne-500/50" />
            {eyebrow}
          </div>
          <h1 className="font-display text-6xl italic leading-[0.95] text-bone-100 md:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-md font-light leading-relaxed text-bone-300">
              {subtitle}
            </p>
          )}
          <div className="mt-10 hidden max-w-sm border-l border-champagne-500/25 pl-5 md:block">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
              Frontend demo
            </div>
            <p className="mt-2 text-sm text-bone-100/70">
              Accounts are stored locally in your browser for demonstration.
              No real authentication server is connected yet — passwords are
              never persisted in plaintext, and a real backend can replace this
              adapter without changing the UI.
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-900/70 p-8 backdrop-blur-xl md:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />
            {children}
            {footer && (
              <div className="mt-10 border-t border-bone-100/10 pt-6 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/70">
                {footer}
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/50">
            <Link to="/" className="hover:text-champagne-400">
              ← Return home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FormLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
      {children}
    </div>
  )
}

export function FormInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { className = '', ...rest } = props
  return (
    <input
      {...rest}
      className={`w-full rounded-full border border-bone-100/15 bg-black/30 px-5 py-3 text-sm text-bone-100 placeholder:text-bone-300/40 focus:border-champagne-500/60 focus:outline-none ${className}`}
    />
  )
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest2 text-red-300">
      {message}
    </div>
  )
}

export function FormNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-champagne-500/25 bg-champagne-500/5 px-4 py-3 text-xs leading-relaxed text-bone-100/80">
      {children}
    </div>
  )
}
