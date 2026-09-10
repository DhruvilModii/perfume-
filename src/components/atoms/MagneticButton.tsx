import { motion, useMotionValue, useSpring } from 'framer-motion'
import { MouseEvent, ReactNode, useRef } from 'react'

interface Props {
  children: ReactNode
  onClick?: () => void
  className?: string
  strength?: number
  variant?: 'primary' | 'ghost' | 'ring'
  href?: string
}

/**
 * Button (or anchor) with subtle magnetic pull toward the pointer.
 * Emits data-cursor="button" so the custom cursor expands.
 */
export function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 18,
  variant = 'primary',
  href
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { damping: 20, stiffness: 240, mass: 0.5 })
  const sy = useSpring(y, { damping: 20, stiffness: 240, mass: 0.5 })

  const handleMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set(((e.clientX - cx) / rect.width) * strength)
    y.set(((e.clientY - cy) / rect.height) * strength)
  }
  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 font-mono text-[11px] uppercase tracking-widest2 transition-colors will-change-transform'

  const variantCls =
    variant === 'primary'
      ? 'border border-champagne-500/60 bg-champagne-500/10 text-bone-100 hover:bg-champagne-500/20'
      : variant === 'ring'
      ? 'border border-bone-100/25 text-bone-100 hover:border-champagne-500/70 hover:text-champagne-400'
      : 'text-bone-100/80 hover:text-champagne-400'

  const inner = (
    <motion.span
      style={{ x: sx, y: sy }}
      className="pointer-events-none flex items-center gap-3"
    >
      <span>{children}</span>
      <motion.span
        aria-hidden
        className="inline-flex items-center"
        initial={{ x: 0 }}
        whileHover={{ x: 3 }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="translate-y-px transition-transform duration-500 group-hover:translate-x-1"
        >
          <path
            d="M1 7h11m0 0L8 3m4 4L8 11"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </motion.span>
  )

  const commonProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    className: `${base} ${variantCls} ${className}`,
    'data-cursor': 'button' as const
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        {...commonProps}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} {...commonProps}>
      {inner}
    </button>
  )
}
