import { SignInForm } from '@/components/auth/sign-in-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0B0B0B]">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
        </div>
        <div className="bg-white rounded-[12px] p-6 shadow-[0_6px_18px_rgba(11,11,11,0.06)]">
          <SignInForm />
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#E53935] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
