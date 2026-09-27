import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * FRONTEND-ONLY authentication scaffold.
 *
 * No real backend, no real password reset. Passwords are never stored in
 * plaintext — a lightweight non-cryptographic fingerprint is kept locally
 * only to demonstrate the sign-in flow. Replace `authAdapter` with a real
 * API adapter (fetch/axios) when a backend exists.
 */

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface StoredCredential extends AuthUser {
  passwordFingerprint: string
}

export interface AuthResult {
  ok: boolean
  message?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  signup: (name: string, email: string, password: string) => Promise<AuthResult>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const USERS_KEY = 'maison-noir.auth.users.v1'
const SESSION_KEY = 'maison-noir.auth.session.v1'

/**
 * Non-cryptographic fingerprint (djb2 hash). NOT for security. It's only
 * used so we don't persist raw passwords locally. Any real auth must be
 * server-side.
 */
function fingerprint(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) ^ input.charCodeAt(i)
  }
  // Mix in a fixed pepper so the string doesn't look meaningful.
  return `fp_${(h >>> 0).toString(36)}_${input.length}`
}

function readUsers(): StoredCredential[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredCredential[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredCredential[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    /* ignore */
  }
}

function readSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function writeSession(user: AuthUser | null) {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === 'undefined' ? null : readSession()
  )

  useEffect(() => {
    writeSession(user)
  }, [user])

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (!name.trim()) return { ok: false, message: 'Please enter your name.' }
      if (!EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email.' }
      if (password.length < 8)
        return { ok: false, message: 'Password must be at least 8 characters.' }
      const users = readUsers()
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: 'An account with that email already exists.' }
      }
      const newUser: StoredCredential = {
        id: `user_${Math.random().toString(36).slice(2, 10)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordFingerprint: fingerprint(password)
      }
      writeUsers([...users, newUser])
      setUser({ id: newUser.id, name: newUser.name, email: newUser.email })
      return { ok: true }
    },
    []
  )

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email.' }
      const users = readUsers()
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!found) return { ok: false, message: 'No account found for that email.' }
      if (found.passwordFingerprint !== fingerprint(password)) {
        return { ok: false, message: 'Incorrect password.' }
      }
      setUser({ id: found.id, name: found.name, email: found.email })
      return { ok: true }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const requestPasswordReset = useCallback(
    async (email: string): Promise<AuthResult> => {
      if (!EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email.' }
      // No email delivery is possible without a backend. Return an honest
      // demo response — the UI presents this clearly to the user.
      return {
        ok: true,
        message:
          'Demo only — a real reset email would be sent once the backend is connected.'
      }
    },
    []
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      requestPasswordReset
    }),
    [user, login, signup, logout, requestPasswordReset]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
