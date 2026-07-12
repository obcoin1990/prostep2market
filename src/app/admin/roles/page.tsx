import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shield, Users, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  learner: 'Learner',
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: '#E53935',
  admin: '#0284C7',
  manager: '#8A2BE2',
  user: '#0ecb81',
  learner: '#FFC107',
}

export default async function AdminRolesPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const { data: profiles, error } = await admin
    .from('trader_profiles')
    .select('admin_role')

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load roles: {error.message}
      </div>
    )
  }

  // Count users per role
  const roleCounts: Record<string, number> = {}
  for (const p of profiles ?? []) {
    const role = (p as Record<string, unknown>).admin_role ?? 'user'
    roleCounts[role as string] = (roleCounts[role as string] ?? 0) + 1
  }

  // Build role list from actual data + system roles
  const allRoles = Object.keys(ROLE_LABELS).map(key => ({
    name: ROLE_LABELS[key] ?? key,
    key,
    users: roleCounts[key] ?? 0,
    type: key === 'super_admin' ? 'System' : key === 'admin' ? 'System' : 'Custom',
    color: ROLE_COLORS[key] ?? '#666',
  }))

  // Add any roles found in DB that aren't in our predefined list
  for (const [key, count] of Object.entries(roleCounts)) {
    if (!ROLE_LABELS[key]) {
      allRoles.push({
        name: key,
        key,
        users: count,
        type: 'Custom',
        color: '#FF8A65',
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Role Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Roles derived from user assignments in trader_profiles</p>
        </div>
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">All Roles</CardTitle>
          <p className="text-xs text-gray-400">{allRoles.length} roles · {profiles?.length ?? 0} total users</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Role</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allRoles.map((role) => (
                  <tr key={role.key} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${role.color}15` }}>
                          <Shield className="w-4 h-4" style={{ color: role.color }} />
                        </div>
                        <span className="font-medium text-gray-700">{role.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={role.type === 'System' ? 'info' : 'warning'}>{role.type}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{role.users} users</td>
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
