import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminContext } from '@/lib/admin/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))
  const search = searchParams.get('search') ?? ''

  const adminSupabase = createAdminClient()

  // Fetch auth users (paginated via Supabase admin API)
  const emailMap: Record<string, string> = {}
  const bannedMap: Record<string, boolean> = {}
  try {
    let p = 1
    while (true) {
      const { data: usersPage, error } = await adminSupabase.auth.admin.listUsers({ page: p, perPage: 1000 })
      if (error || !usersPage?.users?.length) break
      for (const u of usersPage.users) {
        if (u.email) emailMap[u.id] = u.email
        bannedMap[u.id] = !!u.banned_until && new Date(u.banned_until) > new Date()
      }
      if (usersPage.users.length < 1000) break
      p++
    }
  } catch (e) {
    console.error('Failed to list auth users:', e)
  }

  // Filter by search
  let userIds: string[] | null = null
  if (search) {
    userIds = Object.entries(emailMap)
      .filter(([, email]) => email.toLowerCase().includes(search.toLowerCase()))
      .map(([id]) => id)
    if (userIds.length === 0) {
      return NextResponse.json({ success: true, users: [], total: 0 })
    }
  }

  let query = adminSupabase
    .from('trader_profiles')
    .select(
      'id, profile_type, risk_personality_score, emotional_stability_score, decision_making_score, trading_behavior_score, learning_style_score, learning_path, admin_role, created_at, completed_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (userIds !== null) {
    query = query.in('id', userIds)
  }

  const { data: profiles, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const enriched = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.id] ?? null,
    banned: bannedMap[p.id] ?? false,
  }))

  return NextResponse.json({ success: true, users: enriched, total: count ?? 0 })
}

// ─── POST /api/admin/users ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: { email: string; password: string; profile_type: string; full_name?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password, profile_type, full_name } = body
  if (!email || !password || !profile_type) {
    return NextResponse.json({ error: 'email, password, and profile_type are required' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  const { data: newUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: full_name ?? email.split('@')[0] },
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })
  if (!newUser.user) return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })

  // Create Prisma User record (required for auth + feature access)
  await prisma.user.create({
    data: {
      id: newUser.user.id,
      name: full_name ?? email.split('@')[0],
      email,
      role: 'LEARNER',
    },
  }).catch(async (err) => {
    // Rollback: delete the Supabase auth user if Prisma create fails
    await adminSupabase.auth.admin.deleteUser(newUser.user.id)
    console.error('Failed to create Prisma user:', err)
  })

  const now = new Date().toISOString()
  const { error: profileError } = await adminSupabase
    .from('trader_profiles')
    .insert([{
      id: newUser.user.id,
      profile_type,
      risk_personality_score: 75,
      emotional_stability_score: 78,
      decision_making_score: 76,
      trading_behavior_score: 80,
      learning_style_score: 77,
      learning_path: 'beginner',
      dashboard_layout: { widgets: ['edgeScore', 'alerts', 'quickActions', 'tradeStats', 'insights'] },
      alert_thresholds: { risk: 2.0, consistency: 1.5, emotion: 3.0 },
      created_at: now,
      updated_at: now,
    }])

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(newUser.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    user: { id: newUser.user.id, email: newUser.user.email, profile_type, created_at: newUser.user.created_at },
  }, { status: 201 })
}
