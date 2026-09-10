import { motion, MotionValue, useMotionValue, useTransform } from 'framer-motion'

interface Props {
  scrollProgress?: MotionValue<number>
  className?: string
  /** Optional accent color override for the liquid */
  accent?: string
  /** If true, adds a soft floating idle animation */
  floating?: boolean
}

/**
 * SVG perfume bottle rendered as a first-class illustration.
 * Uses gradients, inner reflections, and a floating cap so it holds up at
 * hero scale without pixel artefacts. Reacts to a scroll progress value
 * (0..1) to shift and scale as the user leaves the hero.
 */
export function PerfumeBottle({
  scrollProgress,
  className = '',
  accent = '#c9a878',
  floating = true
}: Props) {
  // Fall back to an inert motion value so hook order is stable.
  const fallback = useMotionValue(0)
  const src = scrollProgress ?? fallback

  const scale = useTransform(src, [0, 1], [1, 1.18])
  const y = useTransform(src, [0, 1], [0, -60])
  const rotate = useTransform(src, [0, 1], [-2, 3])

  return (
    <motion.div
      className={`relative ${floating ? 'float-slow' : ''} ${className}`}
      style={{ scale, y, rotate }}
    >
      {/* Ambient light behind the bottle */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${accent}55, ${accent}00 70%)`,
          filter: 'blur(30px)'
        }}
      />
      <svg
        viewBox="0 0 220 360"
        className="soft-glow h-full w-full"
        aria-label="Perfume bottle"
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f0e6" stopOpacity="0.18" />
            <stop offset="45%" stopColor="#f5f0e6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0a0908" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a1611" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1a17" />
            <stop offset="55%" stopColor="#3a342c" />
            <stop offset="100%" stopColor="#0a0908" />
          </linearGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a7654" />
            <stop offset="50%" stopColor="#e0c99a" />
            <stop offset="100%" stopColor="#8a7654" />
          </linearGradient>
          <radialGradient id="highlight" cx="0.3" cy="0.2" r="0.6">
            <stop offset="0%" stopColor="#f5f0e6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f5f0e6" stopOpacity="0" />
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Cap */}
        <rect
          x="88"
          y="18"
          width="44"
          height="42"
          rx="4"
          fill="url(#cap)"
          stroke="#0a0908"
          strokeWidth="0.75"
        />
        <rect
          x="94"
          y="22"
          width="32"
          height="3"
          rx="1.5"
          fill="#e0c99a"
          opacity="0.35"
        />
        {/* Collar */}
        <rect x="94" y="60" width="32" height="14" fill="url(#rim)" />
        {/* Neck */}
        <rect x="100" y="74" width="20" height="16" fill="url(#cap)" />
        {/* Bottle body */}
        <path
          d="M60 100 Q60 90 78 90 H142 Q160 90 160 100 V310 Q160 340 130 340 H90 Q60 340 60 310 Z"
          fill="url(#glass)"
          stroke="rgba(245,240,230,0.18)"
          strokeWidth="1"
        />
        {/* Liquid */}
        <path
          d="M68 170 Q68 160 84 160 H136 Q152 160 152 170 V300 Q152 330 128 330 H92 Q68 330 68 300 Z"
          fill="url(#liquid)"
          opacity="0.9"
        />
        <path
          d="M68 172 Q110 158 152 172"
          stroke={accent}
          strokeWidth="1"
          fill="none"
          opacity="0.7"
        />
        {/* Highlight */}
        <path
          d="M74 108 Q74 100 88 100 H98 V310 Q98 328 92 328 Q74 328 74 300 Z"
          fill="url(#highlight)"
          opacity="0.7"
          filter="url(#softBlur)"
        />
        {/* Label */}
        <g opacity="0.9">
          <rect
            x="84"
            y="210"
            width="52"
            height="60"
            fill="rgba(10,9,8,0.65)"
            stroke="rgba(224,201,154,0.35)"
            strokeWidth="0.5"
          />
          <text
            x="110"
            y="228"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontStyle="italic"
            fontSize="10"
            fill="#e0c99a"
            letterSpacing="0.1em"
          >
            MAISON
          </text>
          <text
            x="110"
            y="242"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontStyle="italic"
            fontSize="10"
            fill="#e0c99a"
            letterSpacing="0.1em"
          >
            NOIR
          </text>
          <line
            x1="94"
            y1="250"
            x2="126"
            y2="250"
            stroke="#8a7654"
            strokeWidth="0.4"
          />
          <text
            x="110"
            y="260"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize="4"
            fill="#a09585"
            letterSpacing="0.28em"
          >
            EAU DE PARFUM
          </text>
        </g>
        <ellipse cx="110" cy="332" rx="42" ry="4" fill="#0a0908" opacity="0.6" />
      </svg>
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 h-6 w-3/5 -translate-x-1/2 rounded-full bg-black/70 blur-2xl"
      />
    </motion.div>
  )
}
