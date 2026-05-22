import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

type Params = { params: Promise<{ id: string }> }

const VALID_ROLES: Role[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'LEARNER']

/**
 * PATCH /api/admin/users/[id]/role
 *
 * Updates the user's role in Prisma AND syncs trader_profiles.admin_role
 * so both systems stay consistent.
 *
 * Body: { role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "LEARNER" }
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  let body: { role?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const role = body.role as Role | undefined
  if (!role || !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
      { status: 400 }
    )
  }

  // Prisma role is the primary source of truth for LMS access
  await prisma.user.update({ where: { id }, data: { role } })

  // Sync trader_profiles.admin_role so getAdminUser() check stays accurate
  const adminRoleValue = role === 'SUPER_ADMIN' ? 'super_admin' : null
  const admin = createAdminClient()
  await admin
    .from('trader_profiles')
    .update({ admin_role: adminRoleValue, updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ success: true, role, adminRole: adminRoleValue })
}
