import { SignInForm } from '@/components/auth/sign-in-form'
import Link from 'next/link'

/**
 * Login — Binance light transactional mode.
 * White canvas (#ffffff), gray-blue hairlines (#eaecef),
 * yellow primary CTA (#fcd535) from SignInForm → Button component.
 */
export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}
            >
              P2M
            </span>
            <span className="text-sm font-medium" style={{ color: '#707a8a' }}>
              ProStep2Market
            </span>
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#181a20', letterSpacing: '-0.3px' }}
          >
            Welcome Back
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#707a8a' }}>
            Sign in to continue your journey
          </p>
        </div>

        {/* Card — Binance buy-crypto-amount-card style */}
        <div
          className="rounded-[8px] p-6"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <SignInForm />
        </div>

        {/* Footer link */}
        <p className="text-center mt-5 text-sm" style={{ color: '#707a8a' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold transition-colors"
            style={{ color: '#fcd535' }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
