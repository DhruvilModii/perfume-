import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type CursorMode = 'default' | 'button' | 'image' | 'product' | 'hidden'

/**
 * Two-layered custom cursor: a small dot that tracks 1:1, plus a soft ring
 * that trails with inertia and morphs based on the hovered element type.
 *
 * Elements opt into cursor behaviour with `data-cursor="button|image|product"`
 * on themselves or any ancestor.
 */
export function CustomCursor() {
  const [mode, setMode] = useState<CursorMode>('default')
  const [label, setLabel] = useState<string>('')
  const [enabled, setEnabled] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { damping: 25, stiffness: 220, mass: 0.6 })
  const ringY = useSpring(y, { damping: 25, stiffness: 220, mass: 0.6 })

  const rafRef = useRef<number | null>(null)
  const targetPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (isTouch || prefersReduced) return

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-active')

    const move = (e: PointerEvent) => {
      targetPos.current.x = e.clientX
      targetPos.current.y = e.clientY
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(sync)
      }
    }
    const sync = () => {
      x.set(targetPos.current.x)
      y.set(targetPos.current.y)
      rafRef.current = null
    }

    const findCursorAncestor = (el: Element | null): HTMLElement | null => {
      let cur: Element | null = el
      while (cur && cur !== document.body) {
        if (cur instanceof HTMLElement && cur.dataset.cursor) return cur
        cur = cur.parentElement
      }
      return null
    }

    const over = (e: PointerEvent) => {
      const target = findCursorAncestor(e.target as Element | null)
      if (!target) {
        setMode('default')
        setLabel('')
        return
      }
      const c = target.dataset.cursor as CursorMode | undefined
      if (c === 'button' || c === 'image' || c === 'product') {
        setMode(c)
        setLabel(target.dataset.cursorLabel ?? '')
      } else {
        setMode('default')
        setLabel('')
      }
    }

    const out = () => {
      setMode('hidden')
    }
    const enter = () => setMode('default')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', over, { passive: true })
    document.addEventListener('mouseleave', out)
    document.addEventListener('mouseenter', enter)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', over)
      document.removeEventListener('mouseleave', out)
      document.removeEventListener('mouseenter', enter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [x, y])

  if (!enabled) return null

  const ringSize = (() => {
    switch (mode) {
      case 'button':
        return 72
      case 'image':
        return 90
      case 'product':
        return 110
      default:
        return 34
    }
  })()

  return (
    <>
      {/* Ring — soft, glassy, morphs with mode */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: mode === 'hidden' ? 0 : 1,
            backgroundColor:
              mode === 'default'
                ? 'rgba(245, 240, 230, 0)'
                : 'rgba(201, 168, 120, 0.08)',
            borderColor:
              mode === 'default'
                ? 'rgba(245, 240, 230, 0.55)'
                : 'rgba(201, 168, 120, 0.7)'
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.6 }}
          style={{
            translateX: '-50%',
            translateY: '-50%',
            borderRadius: '9999px',
            borderWidth: 1,
            borderStyle: 'solid',
            backdropFilter: mode !== 'default' ? 'blur(4px)' : undefined,
            WebkitBackdropFilter: mode !== 'default' ? 'blur(4px)' : undefined,
            boxShadow:
              mode !== 'default'
                ? '0 0 40px rgba(201, 168, 120, 0.25)'
                : '0 0 12px rgba(245, 240, 230, 0.15)'
          }}
          className="flex items-center justify-center"
        >
          {mode === 'product' && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-400">
              {label || 'View'}
            </span>
          )}
          {mode === 'image' && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone-100">
              {label || 'Look'}
            </span>
          )}
          {mode === 'button' && (
            <span className="h-1 w-1 rounded-full bg-champagne-400" />
          )}
        </motion.div>
      </motion.div>

      {/* Dot — precise pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101]"
        style={{ x, y }}
      >
        <motion.div
          animate={{
            opacity: mode === 'hidden' || mode !== 'default' ? 0 : 1
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: 4,
            height: 4,
            translateX: '-50%',
            translateY: '-50%',
            borderRadius: '9999px',
            backgroundColor: 'var(--accent-warm)',
            boxShadow: '0 0 10px rgba(224, 201, 154, 0.7)'
          }}
        />
      </motion.div>
    </>
  )
}
