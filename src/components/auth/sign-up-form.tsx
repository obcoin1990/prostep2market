'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { useT } from '@/contexts/LanguageContext'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const t = useT()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold mb-2">{t('auth.checkEmail')}</h2>
        <p className="text-gray-600">
          {t('auth.sentConfirmation', { email })}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} required />
      </div>
      <div>
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('auth.passwordMinPlaceholder')} minLength={6} required />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('auth.creatingAccount') : t('auth.signUpBtn')}
      </Button>
    </form>
  )
}
