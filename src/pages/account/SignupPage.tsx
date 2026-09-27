import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagneticButton } from '../../components/atoms/MagneticButton'
import { useAuth } from '../../context/AuthContext'
import { AccountShell, FormError, FormInput, FormLabel, FormNote } from './AccountShell'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    const res = await signup(name, email, password)
    setBusy(false)
    if (!res.ok) {
      setError(res.message || 'Could not create account.')
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <AccountShell
      eyebrow="Welcome"
      title="Create account."
      subtitle="Start your own anthology of Maison Noir parfums."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/account/login" className="text-champagne-400 hover:underline">
            Sign in →
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormLabel>Name</FormLabel>
            <FormInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </div>
          <div className="md:col-span-2">
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
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <FormLabel>Confirm password</FormLabel>
            <FormInput
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        <FormNote>
          This account is stored locally in your browser for demonstration. A
          real authentication backend can be connected without changing the UI.
        </FormNote>
        <FormError message={error} />
        <div className="mt-8">
          <MagneticButton variant="primary">
            {busy ? 'Creating…' : 'Create account'}
          </MagneticButton>
        </div>
      </form>
    </AccountShell>
  )
}
