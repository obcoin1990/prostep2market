import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { StrategyLabClient } from './StrategyLabClient'

export default async function StrategyLabPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Fetch all strategies
  const { data: strategies } = await admin
    .from('strategies')
    .select('*')
    .order('created_at', { ascending: false })

  const strategyIds = (strategies ?? []).map((s) => s.id)
  const userIds = [...new Set((strategies ?? []).map((s) => s.user_id))]

  // Simulation counts
  let simCounts: Record<string, number> = {}
  let simResults: Record<string, { avg_pnl: number; max_drawdown: number }> = {}

  if (strategyIds.length > 0) {
    const { data: sims } = await admin
      .from('simulation_results')
      .select('strategy_id, results')
      .in('strategy_id', strategyIds)

    for (const sim of sims ?? []) {
      simCounts[sim.strategy_id] = (simCounts[sim.strategy_id] ?? 0) + 1
      // Accumulate for avg computation
      if (sim.results) {
        const r = sim.results as Record<string, number>
        const existing = simResults[sim.strategy_id]
        if (!existing) {
          simResults[sim.strategy_id] = {
            avg_pnl: r.pnl ?? 0,
            max_drawdown: r.max_drawdown ?? 0,
          }
        } else {
          // simple running avg — we'll do proper avg on client with count
          simResults[sim.strategy_id] = {
            avg_pnl: existing.avg_pnl + (r.pnl ?? 0),
            max_drawdown: Math.max(existing.max_drawdown, r.max_drawdown ?? 0),
          }
        }
      }
    }

    // Average the pnl
    for (const id of strategyIds) {
      if (simResults[id] && simCounts[id] > 0) {
        simResults[id].avg_pnl = simResults[id].avg_pnl / simCounts[id]
      }
    }
  }

  // Get user emails
  const emailMap: Record<string, string> = {}
  for (const uid of userIds) {
    try {
      const { data: userData } = await admin.auth.admin.getUserById(uid)
      if (userData?.user?.email) emailMap[uid] = userData.user.email
    } catch {
      emailMap[uid] = uid
    }
  }

  const enrichedStrategies = (strategies ?? []).map((s) => ({
    ...s,
    owner_email: emailMap[s.user_id] ?? s.user_id,
    simulation_count: simCounts[s.id] ?? 0,
    sim_summary: simResults[s.id] ?? null,
    entry_rules_count: Array.isArray(s.entry_rules)
      ? s.entry_rules.length
      : typeof s.entry_rules === 'object' && s.entry_rules
      ? Object.keys(s.entry_rules).length
      : 0,
    exit_rules_count: Array.isArray(s.exit_rules)
      ? s.exit_rules.length
      : typeof s.exit_rules === 'object' && s.exit_rules
      ? Object.keys(s.exit_rules).length
      : 0,
    risk_rules_count: Array.isArray(s.risk_rules)
      ? s.risk_rules.length
      : typeof s.risk_rules === 'object' && s.risk_rules
      ? Object.keys(s.risk_rules).length
      : 0,
  }))

  const totalStrategies = enrichedStrategies.length
  const totalSimulations = Object.values(simCounts).reduce((a, b) => a + b, 0)
  const avgSimsPerStrategy = totalStrategies > 0 ? totalSimulations / totalStrategies : 0

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <StrategyLabClient
          strategies={enrichedStrategies}
          stats={{ totalStrategies, totalSimulations, avgSimsPerStrategy }}
        />
      </div>
    </div>
  )
}
