import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p'
  amount?: number
}

/**
 * Wraps children in a clipping mask and reveals them upward when scrolled
 * into view. Uses `whileInView` so it works reliably on inline elements too.
 */
export function TextReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.1,
  once = true,
  as = 'span',
  amount = 0.4
}: Props) {
  const MotionTag = motion[as] as typeof motion.span

  return (
    <MotionTag
      className={`inline-block overflow-hidden align-bottom ${className}`}
    >
      <motion.span
        className="inline-block"
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once, amount }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.span>
    </MotionTag>
  )
}

/**
 * Splits a string into words and reveals each with a per-word stagger.
 * The outer container uses whileInView so animations reliably fire, even for
 * inline-content wrappers where IntersectionObserver behaves inconsistently.
 */
export function WordsReveal({
  text,
  className = '',
  wordClassName = '',
  stagger = 0.06,
  delay = 0,
  once = true,
  amount = 0.2
}: {
  text: string
  className?: string
  wordClassName?: string
  stagger?: number
  delay?: number
  once?: boolean
  amount?: number
}) {
  const words = text.split(' ')
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pr-[0.2em]"
        >
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1 }
            }}
            transition={{
              duration: 1,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
