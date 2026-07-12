import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserDashboardClient } from './client'
import { demoTraderProfile, demoEdgeScores, demoTrades, DEMO_EMAIL } from '@/lib/demo/demo-data'

export default async function UserDashboardPage() {
  // Check demo session first
  try {
    const c = await cookies()
    if (c.get('p2m_demo_session')?.value) {
      const latestScore = demoEdgeScores[demoEdgeScores.length - 1]
      return (
        <UserDashboardClient
          userEmail={DEMO_EMAIL}
          userName="Demo Trader"
          profile={demoTraderProfile}
          tradeCount={demoTrades.length}
          edgeScore={latestScore}
        />
      )
    }
  } catch {}

  // Real user — load from Supabase
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let profile = null
  let tradeCount = 0
  let edgeScore = null

  try {
    const [profileResult, tradesResult, scoresResult] = await Promise.all([
      supabase.from('trader_profiles').select('*').eq('id', user.id).single(),
      supabase.from('trades').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('edge_scores').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
    ])
    profile = profileResult.data
    tradeCount = tradesResult.count ?? 0
    edgeScore = scoresResult.data?.[0] ?? null
  } catch {}

  return (
    <UserDashboardClient
      userEmail={user.email ?? ''}
      userName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? null}
      profile={profile}
      tradeCount={tradeCount}
      edgeScore={edgeScore}
    />
  )
}
