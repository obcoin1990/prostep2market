/**
 * POST /api/auth/register
 *
 * Registration bridge — Supabase Auth is the single identity provider.
 *
 * Flow:
 *   1. Validate input
 *   2. Create Supabase Auth user via admin API → get UUID
 *   3. Create Prisma User with id = Supabase UUID (no separate password stored here)
 *   4. Create or link Organization
 *
 * Passwords are managed entirely by Supabase Auth (bcrypt internally).
 * Prisma never stores hashedPassword.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

const RegisterSchema = z.object({
  name:             z.string().min(2),
  email:            z.string().email(),
  password:         z.string().min(8),
  organizationName: z.string().optional(),
  inviteToken:      z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = RegisterSchema.parse(body)

    const supabaseAdmin = createAdminClient()

    // Check if Prisma already has this email (belt-and-suspenders over Supabase's own check)
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    // ── Invite flow ─────────────────────────────────────────────────────────
    if (data.inviteToken) {
      const invite = await prisma.invitation.findUnique({
        where: { token: data.inviteToken },
      })
      if (!invite || invite.accepted || invite.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
      }

      // Create Supabase user — Supabase manages the password
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email:             data.email,
        password:          data.password,
        email_confirm:     true,       // auto-confirm for invite flow
        user_metadata:     { name: data.name, role: invite.role, organization_id: invite.organizationId },
      })
      if (authError || !authData.user) {
        return NextResponse.json({ error: authError?.message ?? 'Auth creation failed' }, { status: 500 })
      }

      // Create Prisma user with Supabase UUID as the primary key
      const user = await prisma.user.create({
        data: {
          id:             authData.user.id,   // Supabase UUID
          name:           data.name,
          email:          data.email,
          role:           invite.role,
          organizationId: invite.organizationId,
        },
      })

      await prisma.invitation.update({
        where: { id: invite.id },
        data:  { accepted: true },
      })

      return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 })
    }

    // ── Self-signup: create org + admin user ────────────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      const baseSlug = data.organizationName
        ? data.organizationName.toLowerCase().replace(/\s+/g, '-')
        : data.email.split('@')[1].split('.')[0]
      // Append random suffix to prevent slug collisions (WR-10)
      const slug = baseSlug + '-' + Math.random().toString(36).slice(2, 7)

      const org = await tx.organization.create({
        data: { name: data.organizationName ?? data.name + "'s Org", slug },
      })

      // Create Supabase user first to get the UUID
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email:         data.email,
        password:      data.password,
        email_confirm: true,
        user_metadata: { name: data.name, role: 'ADMIN', organization_id: org.id },
      })
      if (authError || !authData.user) {
        throw new Error(authError?.message ?? 'Auth creation failed')
      }

      const user = await tx.user.create({
        data: {
          id:             authData.user.id,   // Supabase UUID
          name:           data.name,
          email:          data.email,
          role:           'ADMIN',
          organizationId: org.id,
        },
      })

      return { user, org }
    })

    return NextResponse.json(
      { user: { id: result.user.id, email: result.user.email } },
      { status: 201 }
    )
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: err.errors }, { status: 422 })
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Registration conflict — please try again' }, { status: 409 })
    }
    // Supabase "user already registered" error
    if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    console.error('[register]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
