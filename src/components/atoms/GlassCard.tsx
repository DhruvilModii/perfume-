import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  tint?: 'neutral' | 'warm' | 'deep'
} & Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> &
  MotionProps

export function GlassCard({
  children,
  className = '',
  tint = 'neutral',
  ...rest
}: Props) {
  const tintStyle =
    tint === 'warm'
      ? 'bg-[rgba(201,168,120,0.06)] border-[rgba(201,168,120,0.18)]'
      : tint === 'deep'
      ? 'bg-[rgba(10,9,8,0.55)] border-[rgba(245,240,230,0.08)]'
      : 'bg-[rgba(245,240,230,0.035)] border-[rgba(245,240,230,0.12)]'
  return (
    <motion.div
      {...rest}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl ${tintStyle} ${className}`}
      style={{
        boxShadow:
          '0 30px 60px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,240,230,0.06)',
        ...rest.style
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(180deg,white,transparent)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />
      </div>
      {children}
    </motion.div>
  )
}
