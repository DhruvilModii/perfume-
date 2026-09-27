import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
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
  const cart = useCart()
  const wishlist = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()

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
            {/* Wishlist */}
            <Link
              to="/wishlist"
              data-cursor="button"
              aria-label={`Wishlist${wishlist.count ? ` (${wishlist.count})` : ''}`}
              className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-bone-100/15 text-bone-100/80 transition hover:border-champagne-500/50 hover:text-champagne-400 md:flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path
                  d="M12 21s-7-4.5-9.5-9C.5 7.5 3.5 4 7 4c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.5 0 6.5 3.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <CountBadge count={wishlist.count} />
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => cart.openCart()}
              data-cursor="button"
              aria-label={`Open cart${cart.totalQuantity ? ` (${cart.totalQuantity})` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-bone-100/15 text-bone-100/80 transition hover:border-champagne-500/50 hover:text-champagne-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h3l2 12h10l2-9H8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="21" r="1.2" fill="currentColor" />
                <circle cx="18" cy="21" r="1.2" fill="currentColor" />
              </svg>
              <CountBadge count={cart.totalQuantity} />
            </button>

            {/* Account (desktop) */}
            <div className="relative hidden md:block">
              <AccountMenu
                user={user}
                isAuthenticated={isAuthenticated}
                logout={logout}
                onNavigate={(p) => navigate(p)}
              />
            </div>

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

            <ul className="mt-10 flex flex-col items-start gap-1 px-8 font-mono text-[12px] uppercase tracking-widest2">
              <motion.li
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.5 }}
              >
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-bone-100/80"
                >
                  <span>Wishlist</span>
                  {wishlist.count > 0 && (
                    <span className="rounded-full border border-champagne-500/60 bg-champagne-500/10 px-2 py-0.5 text-[9px] text-champagne-400">
                      {wishlist.count}
                    </span>
                  )}
                </Link>
              </motion.li>
              <motion.li
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.36, duration: 0.5 }}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    cart.openCart()
                  }}
                  className="flex items-center gap-3 py-2 text-bone-100/80"
                >
                  <span>Cart</span>
                  {cart.totalQuantity > 0 && (
                    <span className="rounded-full border border-champagne-500/60 bg-champagne-500/10 px-2 py-0.5 text-[9px] text-champagne-400">
                      {cart.totalQuantity}
                    </span>
                  )}
                </button>
              </motion.li>
              <motion.li
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="flex items-center gap-3 py-2 text-bone-100/80"
                  >
                    Sign out ({user?.name})
                  </button>
                ) : (
                  <Link
                    to="/account/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-bone-100/80"
                  >
                    Sign in
                  </Link>
                )}
              </motion.li>
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

function CountBadge({ count }: { count: number }) {
  if (!count) return null
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border border-ink-950 bg-champagne-500 px-1 font-mono text-[9px] tracking-widest2 text-ink-950"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  )
}

function AccountMenu({
  user,
  isAuthenticated,
  logout,
  onNavigate
}: {
  user: { name: string; email: string } | null
  isAuthenticated: boolean
  logout: () => void
  onNavigate: (path: string) => void
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        data-cursor="button"
        aria-label="Account"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-bone-100/15 text-bone-100/80 transition hover:border-champagne-500/50 hover:text-champagne-400"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="8"
            r="4"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-bone-100/10 bg-ink-950/95 shadow-xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent" />
            {isAuthenticated ? (
              <>
                <div className="border-b border-bone-100/10 px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
                    Signed in
                  </div>
                  <div className="mt-1 font-display text-base text-bone-100">
                    {user?.name}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] tracking-widest2 text-bone-300/60">
                    {user?.email}
                  </div>
                </div>
                <MenuItem onClick={() => onNavigate('/wishlist')}>Wishlist</MenuItem>
                <MenuItem
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                >
                  Sign out
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => onNavigate('/account/login')}>Sign in</MenuItem>
                <MenuItem onClick={() => onNavigate('/account/signup')}>Create account</MenuItem>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="button"
      className="flex w-full items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-widest2 text-bone-100/80 transition hover:bg-champagne-500/10 hover:text-champagne-400"
    >
      {children}
      <span aria-hidden>→</span>
    </button>
  )
}
