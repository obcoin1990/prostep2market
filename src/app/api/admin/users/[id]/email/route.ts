import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

/**
 * PATCH /api/admin/users/[id]/email
 *
 * Updates the user's email immediately via the Supabase Admin API
 * (no confirmation email required — admin override).
 * Also updates Prisma User.email to keep both in sync.
 *
 * Body: { email: string }
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Update Supabase Auth email immediately (admin override, no confirmation)
  const { error: authError } = await admin.auth.admin.updateUserById(id, { email })
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Keep Prisma in sync
  try {
    await prisma.user.update({ where: { id }, data: { email } })
  } catch (prismaErr: any) {
    // Unique constraint violation = email already in use
    if (prismaErr?.code === 'P2002') {
      return NextResponse.json({ error: 'That email is already used by another account' }, { status: 409 })
    }
    // Non-fatal: Prisma record may not exist yet (race); Supabase is authoritative
  }

  return NextResponse.json({ success: true, email })
}
