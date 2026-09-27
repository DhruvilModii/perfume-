import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { MagneticButton } from '../../components/atoms/MagneticButton'
import { useAuth } from '../../context/AuthContext'
import { AccountShell, FormError, FormInput, FormLabel, FormNote } from './AccountShell'

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setNote(null)
    setBusy(true)
    const res = await requestPasswordReset(email)
    setBusy(false)
    if (!res.ok) {
      setError(res.message || 'Could not request reset.')
      return
    }
    setNote(res.message || 'Request submitted.')
  }

  return (
    <AccountShell
      eyebrow="Password"
      title="Forgotten."
      subtitle="Enter your email and we will pretend to send you a reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/account/login" className="text-champagne-400 hover:underline">
            Sign in →
          </Link>
        </>
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
        </div>
        <FormNote>
          No email will actually be sent — password reset flows require a
          backend service that is not yet connected. This form demonstrates the
          UI only.
        </FormNote>
        {note && (
          <div className="mt-4 rounded-lg border border-champagne-500/40 bg-champagne-500/10 px-4 py-3 font-mono text-[10px] uppercase tracking-widest2 text-champagne-400">
            {note}
          </div>
        )}
        <FormError message={error} />
        <div className="mt-8">
          <MagneticButton variant="primary">
            {busy ? 'Submitting…' : 'Request reset link'}
          </MagneticButton>
        </div>
      </form>
    </AccountShell>
  )
}
