import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

/**
 * PATCH /api/admin/users/[id]/password
 *
 * Triggers a Supabase password-recovery email for the target user.
 * Uses the Admin API `generateLink({ type: 'recovery' })` which queues
 * the recovery email via Supabase's configured email provider.
 */
export async function PATCH(_req: NextRequest, { params }: Params) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  const admin = createAdminClient()

  // Fetch user to get current email
  const { data: authData, error: fetchError } = await admin.auth.admin.getUserById(id)
  if (fetchError || !authData.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const email = authData.user.email
  if (!email) {
    return NextResponse.json({ error: 'User has no email address' }, { status: 400 })
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  // generateLink with type 'recovery' triggers the password-reset email
  const { error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${siteUrl}/update-password` },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: `Password reset email sent to ${email}` })
}
