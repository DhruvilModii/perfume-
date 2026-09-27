import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fragrances } from '../data/products'

interface WishlistContextValue {
  ids: string[]
  toggle: (productId: string) => void
  add: (productId: string) => void
  remove: (productId: string) => void
  has: (productId: string) => boolean
  count: number
  clear: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)
const STORAGE_KEY = 'maison-noir.wishlist.v1'

function loadInitial(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id) => fragrances.some((f) => f.id === id))
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => loadInitial())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      /* localStorage unavailable */
    }
  }, [ids])

  const add = useCallback((productId: string) => {
    setIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }, [])

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId))
  }, [])

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const has = useCallback((productId: string) => ids.includes(productId), [ids])
  const clear = useCallback(() => setIds([]), [])
  const count = useMemo(() => ids.length, [ids])

  const value: WishlistContextValue = { ids, toggle, add, remove, has, count, clear }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
