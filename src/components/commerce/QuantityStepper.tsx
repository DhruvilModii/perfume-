import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  className?: string
  ariaLabel?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className = '',
  ariaLabel = 'Quantity'
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  return (
    <div
      className={`inline-flex items-center rounded-full border border-bone-100/15 bg-black/30 ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        data-cursor="button"
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center rounded-l-full text-bone-100/80 transition hover:text-champagne-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 6h8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </button>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden font-mono text-[12px] tracking-widest2 text-bone-100">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        data-cursor="button"
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center rounded-r-full text-bone-100/80 transition hover:text-champagne-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M6 2v8M2 6h8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
