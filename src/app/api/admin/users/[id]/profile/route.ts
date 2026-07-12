import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

/**
 * PATCH /api/admin/users/[id]/profile
 *
 * Updates mutable profile fields across both Prisma User and Supabase trader_profiles.
 *
 * Body (all optional):
 *   name           — Prisma User.name
 *   organizationId — Prisma User.organizationId (must be a valid Organization.id or null)
 *   profileType    — trader_profiles.profile_type
 *   learningPath   — trader_profiles.learning_path (JSONB)
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const tasks: Array<PromiseLike<unknown>> = []
  const admin = createAdminClient()

  // ── Prisma User fields ────────────────────────────────────────────────────
  const prismaData: Record<string, unknown> = {}
  const oldUser = await prisma.user.findUnique({ where: { id }, select: { organizationId: true } })

  if ('name' in body) prismaData.name = body.name ?? null
  if ('organizationId' in body) {
    const orgId = body.organizationId
    if (orgId !== null && orgId !== undefined) {
      if (typeof orgId !== 'string') {
        return NextResponse.json({ error: 'organizationId must be a string or null' }, { status: 400 })
      }
      // Validate the organization exists
      const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { id: true } })
      if (!org) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
      }
    }
    prismaData.organizationId = orgId ?? null
  }

  if (Object.keys(prismaData).length > 0) {
    tasks.push(
      prisma.user.update({ where: { id }, data: prismaData as any }).catch((err) => {
        // FK violation → org doesn't exist
        if (err?.code === 'P2025' || err?.code === 'P2003') {
          throw new Error('Organization not found')
        }
        throw err
      })
    )
  }

  // ── Audit log for organization reassignment (CR-07) ───────────────────────
  if ('organizationId' in body && oldUser) {
    const newOrgId = (prismaData.organizationId as string | null) ?? null
    if (oldUser.organizationId !== newOrgId) {
      tasks.push(
        admin.from('audit_logs').insert({
          actor_id: ctx.user.id,
          actor_email: ctx.user.email,
          action: 'user.organization_changed',
          target: id,
          category: 'User Management',
          metadata: {
            user_id: id,
            previous_organization_id: oldUser.organizationId,
            new_organization_id: newOrgId,
          },
        })
      )
    }
  }

  // ── trader_profiles fields ────────────────────────────────────────────────
  const profileData: Record<string, unknown> = {}
  if ('profileType' in body) profileData.profile_type = body.profileType ?? null
  if ('learningPath' in body) profileData.learning_path = body.learningPath ?? null

  if (Object.keys(profileData).length > 0) {
    profileData.updated_at = new Date().toISOString()
    tasks.push(
      admin.from('trader_profiles').update(profileData).eq('id', id)
    )
  }

  if (tasks.length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  try {
    await Promise.all(tasks)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
