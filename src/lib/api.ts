/**
 * API auth helpers — Supabase Auth is the single identity source.
 *
 * requireAuth() / requireRole() return the same session shape that all
 * existing API routes already consume (session.user.id, .role, .organizationId),
 * so callers need no changes.
 *
 * Identity chain:
 *   1. Supabase server client verifies the JWT cookie → returns user UUID
 *   2. Prisma User (keyed by the same UUID) provides role & organizationId
 *   3. Both are merged into the AuthSession object returned to callers
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export interface AuthSession {
  user: {
    id:             string   // Supabase UUID == Prisma User.id
    email:          string
    name:           string | null
    role:           string   // Prisma Role enum value
    organizationId: string | null
  }
}

/**
 * Verifies the caller is authenticated.
 * Returns { session } on success or { error: NextResponse } on failure.
 *
 * The Prisma user record is looked up to provide role & organizationId.
 * If no Prisma record exists yet (e.g. race during registration), returns 401.
 */
export async function requireAuth(): Promise<
  { session: AuthSession; error?: never } | { error: NextResponse; session?: never }
> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  // Fetch role + orgId from Prisma (single source of truth for LMS roles)
  const prismaUser = await prisma.user.findUnique({
    where:  { id: user.id },
    select: { role: true, organizationId: true, name: true },
  })

  if (!prismaUser) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  return {
    session: {
      user: {
        id:             user.id,
        email:          user.email ?? '',
        name:           prismaUser.name,
        role:           prismaUser.role,
        organizationId: prismaUser.organizationId,
      },
    },
  }
}

/**
 * Like requireAuth(), but additionally enforces one of the given roles.
 * Returns 403 if the user's Prisma role is not in the allowed list.
 */
export async function requireRole(roles: Role[]): Promise<
  { session: AuthSession; error?: never } | { error: NextResponse; session?: never }
> {
  const { session, error } = await requireAuth()
  if (error) return { error }

  if (!roles.includes(session!.user.role as Role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { session }
}

export function apiError(message: unknown, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}
