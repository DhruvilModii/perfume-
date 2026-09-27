import { motion } from 'framer-motion'

interface Props {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showValue?: boolean
}

/**
 * Compact rating readout in the Maison Noir language.
 * Champagne-coloured filled star glyphs on a bone-neutral background.
 */
export function StarRating({
  value,
  reviewCount,
  size = 'sm',
  className = '',
  showValue = true
}: Props) {
  const dim = size === 'lg' ? 16 : size === 'md' ? 13 : 11
  const gap = size === 'lg' ? 'gap-1' : 'gap-[3px]'
  const rounded = Math.round(value * 2) / 2
  return (
    <div className={`flex items-center ${gap} ${className}`} aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className={`flex ${gap}`} role="img">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.floor(rounded)
          const half = !filled && i + 0.5 <= rounded
          return (
            <Star
              key={i}
              size={dim}
              fill={filled ? 1 : half ? 0.5 : 0}
            />
          )
        })}
      </div>
      {showValue && (
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-bone-300/70">
          {value.toFixed(1)}
          {reviewCount != null && (
            <span className="text-bone-300/40"> · {reviewCount}</span>
          )}
        </span>
      )}
    </div>
  )
}

function Star({ size, fill }: { size: number; fill: 0 | 0.5 | 1 }) {
  const id = `star-clip-${Math.random().toString(36).slice(2, 8)}`
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={fill === 1 ? 24 : fill === 0.5 ? 12 : 0} height="24" />
        </clipPath>
      </defs>
      <path
        d="M12 3l2.7 5.9 6.5.8-4.8 4.4 1.3 6.4L12 17.8 6.3 20.5l1.3-6.4L2.8 9.7l6.5-.8L12 3z"
        fill="none"
        stroke="rgba(245,240,230,0.35)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M12 3l2.7 5.9 6.5.8-4.8 4.4 1.3 6.4L12 17.8 6.3 20.5l1.3-6.4L2.8 9.7l6.5-.8L12 3z"
        fill="#e0c99a"
        clipPath={`url(#${id})`}
      />
    </motion.svg>
  )
}
