import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MagneticButton } from './atoms/MagneticButton'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Fragrances', to: '/fragrances' },
  { label: 'Contact', to: '/contact' }
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()
  const navigate = useNavigate()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 60))

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-4 md:pt-6"
      >
        <motion.nav
          animate={{
            backgroundColor: scrolled
              ? 'rgba(10, 9, 8, 0.55)'
              : 'rgba(10, 9, 8, 0)',
            borderColor: scrolled
              ? 'rgba(245, 240, 230, 0.10)'
              : 'rgba(245, 240, 230, 0)',
            backdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
            WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'blur(0px)',
            paddingTop: scrolled ? 10 : 14,
            paddingBottom: scrolled ? 10 : 14
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-7xl items-center justify-between rounded-full border px-5 md:px-7"
        >
          <Link
            to="/"
            data-cursor="button"
            className="group flex items-center gap-2"
            aria-label="Maison Noir home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-champagne-500/40 bg-black/40">
              <span className="font-display text-lg italic text-champagne-400">
                M
              </span>
              <span className="absolute inset-0 rounded-full ring-1 ring-champagne-500/20 transition group-hover:ring-champagne-500/60" />
            </span>
            <span className="hidden font-display text-sm tracking-widest2 text-bone-100 sm:block">
              MAISON <span className="italic text-champagne-400">Noir</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active =
                l.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(l.to)
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    data-cursor="button"
                    className={`group relative inline-flex px-4 py-2 font-mono text-[11px] uppercase tracking-widest2 transition-colors ${
                      active
                        ? 'text-champagne-400'
                        : 'text-bone-100/75 hover:text-bone-50'
                    }`}
                  >
                    <span className="relative">
                      {l.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-px bg-champagne-400 transition-all duration-500 ${
                          active
                            ? 'w-full'
                            : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <MagneticButton
                variant="ring"
                onClick={() => navigate('/fragrances')}
              >
                Discover
              </MagneticButton>
            </div>
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-bone-100/15 md:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  className="absolute left-0 top-0 h-px w-full bg-bone-100"
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
                />
                <motion.span
                  className="absolute left-0 top-1/2 h-px w-full bg-bone-100"
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-px w-full bg-bone-100"
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
                />
              </span>
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col items-start gap-1 px-8">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.06,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="overflow-hidden"
                >
                  <Link
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-6xl leading-[1.05] tracking-tightest text-bone-100"
                  >
                    <span className="mr-3 align-top font-mono text-xs text-champagne-500">
                      0{i + 1}
                    </span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-14 px-8 font-mono text-[10px] uppercase tracking-widest2 text-bone-300/60">
              <div>Maison Noir · Est. 2024</div>
              <div className="mt-1">Bombay · Grasse · Paris</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
