'use client'

import { SignUpForm } from '@/components/auth/sign-up-form'
import Link from 'next/link'
import { useT } from '@/contexts/LanguageContext'

export default function SignUpPage() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}>P2M</span>
            <span className="text-sm font-medium" style={{ color: '#707a8a' }}>ProStep2Market</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0B0B0B]">{t('auth.createAccount')}</h1>
          <p className="text-gray-600 mt-2">{t('auth.startJourney')}</p>
        </div>
        <div className="bg-white rounded-[12px] p-6 shadow-[0_6px_18px_rgba(11,11,11,0.06)]">
          <SignUpForm />
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          {t('auth.haveAccount')}{' '}
          <Link href="/login" className="text-[#E53935] hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
