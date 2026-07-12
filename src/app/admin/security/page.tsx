import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shield, Lock, Smartphone, Globe, Users, CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminSecurityPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Fetch real user count and auth settings
  const [{ count: totalUsers }, { data: settings }] = await Promise.all([
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }),
    admin.from('admin_settings').select('value').eq('key', 'security_settings').maybeSingle(),
  ])

  const securityConfig = (settings?.value ?? {}) as Record<string, unknown>
  const mfaEnabled = (securityConfig.mfa_required_for_admins as boolean) ?? true
  const mfaGracePeriod = (securityConfig.mfa_grace_period_days as number) ?? 7
  const sessionDuration = (securityConfig.session_duration_hours as number) ?? 24
  const inactivityTimeout = (securityConfig.inactivity_timeout_minutes as number) ?? 30
  const maxConcurrentSessions = (securityConfig.max_concurrent_sessions as number) ?? 5
  const ipAllowlist = (securityConfig.ip_allowlist as Array<{ name: string; range: string; status: string }>) ?? []

  // Auth provider info (from Supabase config — read-only)
  const authProviders = [
    { name: 'Email / Password', status: 'Enabled', icon: Lock },
    { name: 'Google OAuth', status: 'Enabled', icon: Globe },
    { name: 'SSO / SAML', status: 'Disabled', icon: Shield },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Security Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">MFA policy, session controls, IP allowlisting, and auth configuration</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/30">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-xs font-semibold text-green-400">Secure</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: String(totalUsers ?? 0), color: '#0ecb81' },
          { label: 'MFA Required', value: mfaEnabled ? 'Yes' : 'No', color: mfaEnabled ? '#0ecb81' : '#FFC107' },
          { label: 'Session Limit', value: `${sessionDuration}h`, color: '#0284C7' },
          { label: 'IP Rules', value: String(ipAllowlist.length), color: '#8A2BE2' },
        ].map((s) => (
          <Card key={s.label} variant="light" className="border border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-bold text-gray-700 mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">MFA Policy</CardTitle>
            <p className="text-xs text-gray-400">Multi-factor authentication enforcement settings</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Require MFA for All Admins</p>
                  <p className="text-xs text-gray-400">Enforce 2FA for all admin role users</p>
                </div>
              </div>
              <Badge variant={mfaEnabled ? 'success' : 'warning'}>{mfaEnabled ? 'Enabled' : 'Disabled'}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">MFA Grace Period</p>
                  <p className="text-xs text-gray-400">Days before mandatory enrollment</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{mfaGracePeriod} days</span>
            </div>
          </CardContent>
        </Card>

        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">Session Controls</CardTitle>
            <p className="text-xs text-gray-400">Manage user session policies</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Session Duration</p>
                  <p className="text-xs text-gray-400">Max session length before re-auth</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{sessionDuration} hours</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Inactivity Timeout</p>
                  <p className="text-xs text-gray-400">Auto sign-out after idle period</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{inactivityTimeout} min</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Max Concurrent Sessions</p>
                  <p className="text-xs text-gray-400">Sessions per user limit</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{maxConcurrentSessions}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">IP Allowlist</CardTitle>
            <p className="text-xs text-gray-400">Restrict admin access to trusted IP ranges</p>
          </CardHeader>
          <CardContent>
            {ipAllowlist.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No IP rules configured.</p>
            ) : (
              <div className="space-y-2">
                {ipAllowlist.map((ip) => (
                  <div key={ip.range} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{ip.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{ip.range}</p>
                    </div>
                    <Badge variant={ip.status === 'Active' ? 'success' : 'default'}>{ip.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">Auth Providers</CardTitle>
            <p className="text-xs text-gray-400">Configured authentication providers</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {authProviders.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      <p.icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{p.name}</p>
                  </div>
                  <Badge variant={p.status === 'Enabled' ? 'success' : 'default'}>{p.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
