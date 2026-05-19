'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  FlaskConical,
  Trash2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Activity,
  BarChart3,
  User,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SimSummary {
  avg_pnl: number
  max_drawdown: number
}

interface Strategy {
  id: string
  user_id: string
  name: string
  entry_rules: unknown
  exit_rules: unknown
  risk_rules: unknown
  created_at: string
  last_tested_at: string | null
  owner_email: string
  simulation_count: number
  entry_rules_count: number
  exit_rules_count: number
  risk_rules_count: number
  sim_summary: SimSummary | null
}

interface Stats {
  totalStrategies: number
  totalSimulations: number
  avgSimsPerStrategy: number
}

interface Props {
  strategies: Strategy[]
  stats: Stats
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function StrategyDetail({ strategy }: { strategy: Strategy }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Entry Rules */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Entry Rules</h4>
          <pre className="bg-white border border-gray-200 rounded p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {JSON.stringify(strategy.entry_rules, null, 2)}
          </pre>
        </div>
        {/* Exit Rules */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Exit Rules</h4>
          <pre className="bg-white border border-gray-200 rounded p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {JSON.stringify(strategy.exit_rules, null, 2)}
          </pre>
        </div>
        {/* Risk Rules */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Risk Rules</h4>
          <pre className="bg-white border border-gray-200 rounded p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {JSON.stringify(strategy.risk_rules, null, 2)}
          </pre>
        </div>
      </div>

      {/* Simulation Summary */}
      {strategy.simulation_count > 0 && strategy.sim_summary ? (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Simulation Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Simulations Run</p>
              <p className="text-lg font-bold text-[#0A0F1C]">{strategy.simulation_count}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg PnL</p>
              <p className={`text-lg font-bold ${strategy.sim_summary.avg_pnl >= 0 ? 'text-emerald-600' : 'text-[#E53935]'}`}>
                {strategy.sim_summary.avg_pnl >= 0 ? '+' : ''}
                {strategy.sim_summary.avg_pnl.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Max Drawdown</p>
              <p className="text-lg font-bold text-[#E53935]">
                -{strategy.sim_summary.max_drawdown.toFixed(2)}%
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Last Tested</p>
              <p className="text-sm font-medium text-[#0A0F1C]">
                {strategy.last_tested_at
                  ? new Date(strategy.last_tested_at).toLocaleDateString()
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-200 pt-4 text-gray-400 text-sm">
          No simulation results yet.
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StrategyLabClient({ strategies: initialStrategies, stats }: Props) {
  const [strategies, setStrategies] = useState<Strategy[]>(initialStrategies)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this strategy and all its simulation results?')) return
    try {
      const res = await fetch(`/api/admin/strategy-lab/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setStrategies((prev) => prev.filter((s) => s.id !== id))
        if (expandedId === id) setExpandedId(null)
        toast.success('Strategy deleted')
      } else {
        const json = await res.json()
        toast.error(json.error ?? 'Failed to delete strategy')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#E53935]/10 rounded-lg">
          <FlaskConical className="h-6 w-6 text-[#E53935]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0A0F1C]">Strategy Lab Manager</h1>
          <p className="text-sm text-gray-500">View and manage trader strategies and simulations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Strategies</p>
                <p className="text-2xl font-bold text-[#0A0F1C]">{stats.totalStrategies.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Simulations Run</p>
                <p className="text-2xl font-bold text-[#0A0F1C]">{stats.totalSimulations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Sims / Strategy</p>
                <p className="text-2xl font-bold text-[#0A0F1C]">{stats.avgSimsPerStrategy.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategies Table */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left py-3 px-4">Strategy Name</th>
                  <th className="text-left py-3 px-4">Owner</th>
                  <th className="text-center py-3 px-4">Entry</th>
                  <th className="text-center py-3 px-4">Exit</th>
                  <th className="text-center py-3 px-4">Risk</th>
                  <th className="text-left py-3 px-4">Last Tested</th>
                  <th className="text-center py-3 px-4">Sims</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {strategies.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No strategies found.
                    </td>
                  </tr>
                )}
                {strategies.map((strategy) => (
                  <>
                    <tr
                      key={strategy.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#0A0F1C]">{strategy.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs">{strategy.owner_email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline">{strategy.entry_rules_count}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline">{strategy.exit_rules_count}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline">{strategy.risk_rules_count}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {strategy.last_tested_at
                          ? new Date(strategy.last_tested_at).toLocaleDateString()
                          : <span className="text-gray-300">Never</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={strategy.simulation_count > 0 ? 'success' : 'default'}>
                          {strategy.simulation_count}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            className="h-8 px-3 text-xs"
                            onClick={() =>
                              setExpandedId((prev) => (prev === strategy.id ? null : strategy.id))
                            }
                          >
                            {expandedId === strategy.id ? (
                              <ChevronUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            )}
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 px-3 text-xs text-[#E53935] border-[#E53935] hover:bg-[#E53935]/5"
                            onClick={() => handleDelete(strategy.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === strategy.id && (
                      <tr key={`${strategy.id}-detail`}>
                        <td colSpan={8} className="px-4 pb-4">
                          <StrategyDetail strategy={strategy} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
