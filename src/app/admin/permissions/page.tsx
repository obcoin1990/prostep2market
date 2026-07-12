import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shield, CheckCircle2, XCircle, Edit3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DEFAULT_PERMISSION_MATRIX = [
  { module: 'User Management', super_admin: true, admin: true, manager: true, user: false, learner: false },
  { module: 'Role & Permissions', super_admin: true, admin: false, manager: false, user: false, learner: false },
  { module: 'Trader DNA', super_admin: true, admin: true, manager: false, user: true, learner: true },
  { module: 'Billing & Payments', super_admin: true, admin: true, manager: false, user: false, learner: false },
  { module: 'Security Center', super_admin: true, admin: false, manager: false, user: false, learner: false },
  { module: 'Audit Logs', super_admin: true, admin: true, manager: false, user: false, learner: false },
  { module: 'AI Engine', super_admin: true, admin: true, manager: false, user: false, learner: false },
  { module: 'Risk Guardian', super_admin: true, admin: true, manager: false, user: false, learner: false },
  { module: 'Education Content', super_admin: true, admin: true, manager: true, user: true, learner: true },
  { module: 'Notifications', super_admin: true, admin: true, manager: true, user: false, learner: false },
  { module: 'System Health', super_admin: true, admin: true, manager: false, user: false, learner: false },
  { module: 'Feature Flags', super_admin: true, admin: false, manager: false, user: false, learner: false },
]

const ROLES = ['super_admin', 'admin', 'manager', 'user', 'learner']
const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  learner: 'Learner',
}

function PermissionIcon({ allowed }: { allowed: boolean }) {
  return allowed
    ? <CheckCircle2 className="w-4 h-4 text-green-400" />
    : <XCircle className="w-4 h-4 text-gray-300" />
}

export default async function AdminPermissionsPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Try to load custom permission matrix from admin_settings
  const { data: setting } = await admin
    .from('admin_settings')
    .select('value')
    .eq('key', 'permission_matrix')
    .maybeSingle()

  const matrix = (setting?.value as Array<Record<string, unknown>> | null) ?? DEFAULT_PERMISSION_MATRIX

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Permission Matrix</h1>
          <p className="text-sm text-gray-500 mt-0.5">Feature-level permissions mapped to each role</p>
        </div>
        <Badge variant="info">{matrix.length} modules · {ROLES.length} roles</Badge>
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">Module Permissions</CardTitle>
          <p className="text-xs text-gray-400">✓ = full access — ✗ = no access</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-6 font-medium text-gray-400 text-xs uppercase tracking-wide">Module</th>
                  {ROLES.map((role) => (
                    <th key={role} className="text-center py-2 px-3 font-medium text-gray-400 text-xs uppercase tracking-wide">{ROLE_LABELS[role] ?? role}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {matrix.map((row) => (
                  <tr key={row.module as string} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-6">
                      <span className="font-medium text-gray-700">{row.module as string}</span>
                    </td>
                    {ROLES.map((role) => (
                      <td key={role} className="py-3 px-3 text-center">
                        <PermissionIcon allowed={!!(row as Record<string, unknown>)[role]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
