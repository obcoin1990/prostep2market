import Link from 'next/link'
import { ShieldOff, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand mark */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/30 flex items-center justify-center">
            <ShieldOff className="w-8 h-8 text-[#E53935]" />
          </div>
        </div>

        <Card className="border border-white/10 bg-[#0A0F1C]/80 backdrop-blur shadow-2xl">
          <CardContent className="pt-8 pb-8 px-8 text-center space-y-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#E53935] mb-2">
                403 Forbidden
              </p>
              <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
              <p className="text-white/50 text-sm leading-relaxed">
                You do not have permission to access the admin panel. This area is
                restricted to platform super-admins only.
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-white/30 mb-5">
                If you believe this is a mistake, contact your platform administrator
                and ask them to grant you the <span className="text-[#E53935] font-semibold">super_admin</span> role.
              </p>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-base font-medium rounded-[12px] bg-[#E53935] text-white hover:opacity-90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/20 text-xs mt-6">
          ProStep2Market &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
