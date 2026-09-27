import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fragrances, Fragrance } from '../data/products'

export interface CartItem {
  productId: string
  selectedSize: number // ml
  quantity: number
  price: number // unit price at add time (snapshot)
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Fragrance, sizeMl: number, quantity?: number) => void
  removeItem: (productId: string, sizeMl: number) => void
  updateQuantity: (productId: string, sizeMl: number, quantity: number) => void
  clearCart: () => void
  subtotal: number
  totalQuantity: number
  hasItem: (productId: string, sizeMl: number) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'maison-noir.cart.v1'

function loadInitial(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    // Validate + drop any items whose product/size no longer exists
    return parsed.filter((it) => {
      const f = fragrances.find((p) => p.id === it.productId)
      return !!f && f.sizes.some((s) => s.ml === it.selectedSize)
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadInitial())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* localStorage unavailable — silently ignore */
    }
  }, [items])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addItem = useCallback(
    (product: Fragrance, sizeMl: number, quantity: number = 1) => {
      const size = product.sizes.find((s) => s.ml === sizeMl)
      if (!size) return
      setItems((prev) => {
        const idx = prev.findIndex(
          (it) => it.productId === product.id && it.selectedSize === sizeMl
        )
        const capacity = Math.max(1, product.stock || 99)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = {
            ...next[idx],
            quantity: Math.min(capacity, next[idx].quantity + quantity)
          }
          return next
        }
        return [
          ...prev,
          {
            productId: product.id,
            selectedSize: sizeMl,
            quantity: Math.min(capacity, quantity),
            price: size.price
          }
        ]
      })
    },
    []
  )

  const removeItem = useCallback((productId: string, sizeMl: number) => {
    setItems((prev) =>
      prev.filter(
        (it) => !(it.productId === productId && it.selectedSize === sizeMl)
      )
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, sizeMl: number, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (it) => !(it.productId === productId && it.selectedSize === sizeMl)
          )
        }
        const product = fragrances.find((p) => p.id === productId)
        const capacity = Math.max(1, product?.stock || 99)
        return prev.map((it) =>
          it.productId === productId && it.selectedSize === sizeMl
            ? { ...it, quantity: Math.min(capacity, quantity) }
            : it
        )
      })
    },
    []
  )

  const clearCart = useCallback(() => setItems([]), [])

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  )
  const totalQuantity = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  )

  const hasItem = useCallback(
    (productId: string, sizeMl: number) =>
      items.some(
        (it) => it.productId === productId && it.selectedSize === sizeMl
      ),
    [items]
  )

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalQuantity,
    hasItem
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
