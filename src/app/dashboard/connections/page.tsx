'use client'

import { Cable, Link2, Unlink, CheckCircle2, AlertCircle, RefreshCw, Plus, Upload } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface MtConnection {
  id: string
  user_id: string
  platform: 'mt4' | 'mt5'
  broker_server: string
  account_number: string
  metaapi_account_id: string | null
  status: 'pending' | 'connecting' | 'connected' | 'disconnected' | 'error'
  sync_error: string | null
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

export default function ConnectionsDashboardPage() {
  const supabase = createClient()

  const { data: connections, loading } = useRealtimeData<MtConnection[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('mt_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    [],
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Account Connections" description="Manage your MT4/MT5 and broker connections" icon={Cable} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    )
  }

  const mtConnections = (connections ?? []).filter((c) => c.platform === 'mt4' || c.platform === 'mt5')

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Account Connections"
        description="Manage your MT4/MT5 and broker connections"
        icon={Cable}
        action={
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Connection
          </button>
        }
      />

      {mtConnections.length === 0 ? (
        <DashboardCard>
          <DashboardCardBody>
            <EmptyState
              title="No connections yet"
              description="Connect your MT4/MT5 account to automatically sync trades and track performance."
            />
          </DashboardCardBody>
        </DashboardCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mtConnections.map((conn) => {
            const isActive = conn.status === 'connected'
            const lastSync = conn.last_sync_at ? formatTimeAgo(conn.last_sync_at) : 'Never'
            return (
              <DashboardCard key={conn.id} className="hover:border-white/20 transition-colors">
                <DashboardCardBody>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? 'bg-[#0ecb81]/15' : 'bg-[#f6465d]/15'}`}>
                        <Cable className={`h-5 w-5 ${isActive ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{conn.platform.toUpperCase()} Account</p>
                        <p className="text-[11px] text-white/60">{conn.broker_server ?? 'Unknown Broker'}</p>
                      </div>
                    </div>
                    <StatusBadge
                      label={conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
                      variant={isActive ? 'active' : conn.status === 'error' ? 'danger' : 'warning'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-white/60">Account Number</span>
                      <p className="font-mono text-white/80 mt-0.5">{conn.account_number ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-white/60">Status</span>
                      <p className="font-semibold text-white mt-0.5">{conn.status}</p>
                    </div>
                  </div>

                  {conn.sync_error && (
                    <div className="mt-3 rounded-lg bg-[#f6465d]/10 border border-[#f6465d]/20 px-3 py-2">
                      <p className="text-[10px] text-[#f6465d]">{conn.sync_error}</p>
                    </div>
                  )}

                  {isActive && (
                    <div className="mt-4 flex items-center gap-3">
                      <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-white/60 hover:bg-white/5 transition-colors">
                        <RefreshCw className="h-3 w-3" />
                        Sync Now
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-[#f6465d]/60 hover:bg-[#f6465d]/5 transition-colors">
                        <Unlink className="h-3 w-3" />
                        Disconnect
                      </button>
                      <span className="text-[10px] text-white/50 ml-auto">Synced {lastSync}</span>
                    </div>
                  )}

                  {!isActive && (
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-white/60 hover:bg-white/5 transition-colors">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reconnect
                    </button>
                  )}
                </DashboardCardBody>
              </DashboardCard>
            )
          })}

          <DashboardCard className="border-dashed hover:border-white/20 transition-colors">
            <DashboardCardBody className="flex flex-col items-center justify-center py-12">
              <Upload className="h-8 w-8 text-white/50 mb-3" />
              <p className="text-sm text-white/60">Import Trades from CSV</p>
              <p className="text-xs text-white/50 mt-1">Manual trade import available</p>
            </DashboardCardBody>
          </DashboardCard>
        </div>
      )}

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Data Sources</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          <div className="space-y-3">
            {[
              { source: 'MT5 Read-Only', status: mtConnections.some((c) => c.platform === 'mt5' && c.status === 'connected') ? 'Connected' : 'Not Connected', color: mtConnections.some((c) => c.platform === 'mt5' && c.status === 'connected') ? '#0ecb81' : '#9ea3ad' },
              { source: 'MT4 Read-Only', status: mtConnections.some((c) => c.platform === 'mt4' && c.status === 'connected') ? 'Connected' : 'Not Connected', color: mtConnections.some((c) => c.platform === 'mt4' && c.status === 'connected') ? '#0ecb81' : '#9ea3ad' },
              { source: 'Manual Entry', status: 'Available', color: '#fcd535' },
              { source: 'CSV Import', status: 'Available', color: '#fcd535' },
            ].map((ds) => (
              <div key={ds.source} className="flex items-center justify-between py-2">
                <span className="text-xs text-white/80">{ds.source}</span>
                <span className="text-[10px] font-medium" style={{ color: ds.color }}>{ds.status}</span>
              </div>
            ))}
          </div>
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
