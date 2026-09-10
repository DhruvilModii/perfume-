import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Global Lenis smooth-scroll instance.
 * - Heavy cinematic ease
 * - Skipped on touch devices (native touch scrolling stays crisp)
 * - Skipped when prefers-reduced-motion is set
 * - Survives React StrictMode double-invocation (each mount owns its instance)
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || isTouch) return

    let lenis: Lenis | null = null
    let raf = 0
    try {
      lenis = new Lenis({
        duration: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1
      })
    } catch (err) {
      // If Lenis fails to initialise for any reason, fall back silently
      // to native scroll — the site is fully functional without it.
      // eslint-disable-next-line no-console
      console.warn('[lenis] init failed, falling back to native scroll', err)
      return
    }

    const loop = (time: number) => {
      lenis?.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      const w = window as unknown as { __lenis?: Lenis }
      if (w.__lenis === lenis) delete w.__lenis
    }
  }, [])
}
