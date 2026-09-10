import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 200 })
  const height = useTransform(smooth, [0, 1], ['0%', '100%'])
  const percent = useTransform(smooth, (v) => Math.round(v * 100))
  const [percentText, setPercentText] = useState('00')

  useEffect(() => {
    return percent.on('change', (v) =>
      setPercentText(String(v).padStart(2, '0'))
    )
  }, [percent])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
    >
      <div className="relative h-40 w-px bg-bone-100/10">
        <motion.div
          className="absolute inset-x-0 top-0 origin-top bg-champagne-400"
          style={{ height, width: 1 }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-widest2 text-bone-100/50">
        {percentText}
      </span>
    </div>
  )
}
