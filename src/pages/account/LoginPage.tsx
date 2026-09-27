import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MagneticButton } from '../../components/atoms/MagneticButton'
import { useAuth } from '../../context/AuthContext'
import { AccountShell, FormError, FormInput, FormLabel } from './AccountShell'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const res = await login(email, password)
    setBusy(false)
    if (!res.ok) {
      setError(res.message || 'Could not sign in.')
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <AccountShell
      eyebrow="Return"
      title="Sign in."
      subtitle="Access your fragrances, wishlist, and orders."
      footer={
        <div className="flex flex-col gap-2 md:flex-row md:justify-between">
          <span>
            New to Maison Noir?{' '}
            <Link to="/account/signup" className="text-champagne-400 hover:underline">
              Create account →
            </Link>
          </span>
          <Link to="/account/forgot" className="text-champagne-400 hover:underline">
            Forgot password?
          </Link>
        </div>
      }
    >
      <form onSubmit={submit} noValidate>
        <div className="space-y-5">
          <div>
            <FormLabel>Email</FormLabel>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <FormLabel>Password</FormLabel>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        <FormError message={error} />
        <div className="mt-8 flex items-center justify-between">
          <MagneticButton variant="primary">
            {busy ? 'Signing in…' : 'Sign in'}
          </MagneticButton>
        </div>
      </form>
    </AccountShell>
  )
}
