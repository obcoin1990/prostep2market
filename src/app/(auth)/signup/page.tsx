import { SignUpForm } from '@/components/auth/sign-up-form'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0B0B0B]">Create Account</h1>
          <p className="text-gray-600 mt-2">Start your trading discipline journey</p>
        </div>
        <div className="bg-white rounded-[12px] p-6 shadow-[0_6px_18px_rgba(11,11,11,0.06)]">
          <SignUpForm />
        </div>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#E53935] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}