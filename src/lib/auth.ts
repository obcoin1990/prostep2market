/**
 * Server-side session helper for React Server Components and page-level auth.
 *
 * NextAuth has been removed. Supabase Auth is the single identity provider.
 * Use getPageSession() in RSC pages instead of getServerSession(authOptions).
 *
 * NOTE (WR-07 resolved): Roles are now read from Prisma on every request, so
 * stale JWT role issues from the old NextAuth JWT strategy no longer apply.
 */

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export interface PageSession {
  id:             string
  email:          string
  name:           string | null
  role:           string
  organizationId: string | null
}

/**
 * Use in Server Component pages.
 * Returns the authenticated user merged with their Prisma role/orgId,
 * or null if unauthenticated or no Prisma record exists.
 *
 * @example
 * const session = await getPageSession()
 * if (!session) redirect('/login')
 * if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) redirect('/dashboard/learner')
 */
export async function getPageSession(): Promise<PageSession | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const prismaUser = await prisma.user.findUnique({
      where:  { id: user.id },
      select: { role: true, organizationId: true, name: true },
    })
    if (!prismaUser) return null

    return {
      id:             user.id,
      email:          user.email ?? '',
      name:           prismaUser.name,
      role:           prismaUser.role,
      organizationId: prismaUser.organizationId,
    }
  } catch {
    return null
  }
}
