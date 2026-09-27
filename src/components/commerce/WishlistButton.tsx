import { motion, AnimatePresence } from 'framer-motion'
import { MouseEvent } from 'react'
import { useWishlist } from '../../context/WishlistContext'

interface Props {
  productId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  stopPropagation?: boolean
}

/**
 * A heart toggle in the Maison Noir language: bone-neutral border ring, filled
 * champagne when active. Subtle scale burst on toggle.
 */
export function WishlistButton({
  productId,
  size = 'md',
  className = '',
  stopPropagation = true
}: Props) {
  const { has, toggle } = useWishlist()
  const active = has(productId)

  const dim = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const icon = size === 'lg' ? 18 : size === 'sm' ? 12 : 14

  const handleClick = (e: MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
    toggle(productId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      data-cursor="button"
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`relative flex ${dim} items-center justify-center rounded-full border backdrop-blur transition-colors ${
        active
          ? 'border-champagne-500/70 bg-champagne-500/15 text-champagne-400'
          : 'border-bone-100/20 bg-black/25 text-bone-100/80 hover:border-champagne-500/50 hover:text-champagne-400'
      } ${className}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.svg
          key={active ? 'on' : 'off'}
          width={icon}
          height={icon}
          viewBox="0 0 24 24"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M12 21s-7-4.5-9.5-9C.5 7.5 3.5 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.5 0 6.5 3.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"
            fill={active ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </AnimatePresence>
      {active && (
        <motion.span
          key="pulse"
          initial={{ scale: 0.7, opacity: 0.5 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 rounded-full border border-champagne-500/60"
        />
      )}
    </button>
  )
}
