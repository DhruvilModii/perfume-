import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { CustomCursor } from '../CustomCursor'
import { Navbar } from '../Navbar'
import { ScrollProgress } from '../ScrollProgress'
import { Footer } from '../sections/Footer'
import { CartDrawer } from '../commerce/CartDrawer'
import { useLenis } from '../../hooks/useLenis'

/**
 * Shared shell for every page: Lenis, custom cursor, nav, scroll progress,
 * animated page transitions, and the global footer.
 */
export function SiteLayout() {
  useLenis()
  const location = useLocation()
  const outlet = useOutlet()

  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-ink-950 text-bone-100">
      <CustomCursor />
      <Navbar />
      <ScrollProgress />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <Footer />
      <CartDrawer />
    </div>
  )
}

// Small helper for pages that want a section wrapper with grain + vignette baked in
export function SectionShell({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`relative overflow-hidden ${className}`}>{children}</section>
  )
}
