'use client'

import { SignInForm } from '@/components/auth/sign-in-form'
import Link from 'next/link'
import { useT } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}>P2M</span>
            <span className="text-sm font-medium" style={{ color: '#707a8a' }}>ProStep2Market</span>
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#181a20', letterSpacing: '-0.3px' }}>
            {t('auth.welcomeBack')}
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#707a8a' }}>
            {t('auth.signInContinue')}
          </p>
        </div>

        <div className="rounded-[8px] p-6" style={{ backgroundColor: '#ffffff', border: '1px solid #eaecef', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <SignInForm />
        </div>

        <p className="text-center mt-5 text-sm" style={{ color: '#707a8a' }}>
          {t('auth.noAccount')}{' '}
          <Link href="/signup" className="font-semibold transition-colors" style={{ color: '#fcd535' }}>
            {t('auth.signUpBtn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
