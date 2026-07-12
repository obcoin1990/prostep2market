'use client'

import { useState } from 'react'
import { Key, Plus, Copy, Trash2, ExternalLink, Shield } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  scopes: string[]
  last_used_at: string | null
  expires_at: string | null
  revoked: boolean
  created_at: string
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30) return `${diffDay}d ago`
  const diffMonth = Math.floor(diffDay / 30)
  return `${diffMonth}mo ago`
}

function maskKey(prefix: string): string {
  return `${prefix}_****`
}

export default function ApiKeysPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { data: apiKeys, loading } = useRealtimeData<ApiKey[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .eq('revoked', false)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    [],
  )

  const handleCopy = async (key: ApiKey) => {
    try {
      await navigator.clipboard.writeText(maskKey(key.key_prefix))
      setCopiedId(key.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // clipboard API unavailable (non-HTTPS) — silently fail
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="API Keys & Webhooks" description="Manage API access and webhook integrations" icon={Key} />
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>API Keys</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Webhooks</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <Skeleton className="h-16 w-full rounded-lg" />
          </DashboardCardBody>
        </DashboardCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="API Keys & Webhooks"
        description="Manage API access and webhook integrations"
        icon={Key}
        action={
          <button className="rounded-lg bg-[#fcd535] px-3 py-1.5 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors">
            <Plus className="h-3.5 w-3.5 inline mr-1" />
            Create Key
          </button>
        }
      />

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>API Keys</DashboardCardTitle>
          <p className="text-xs text-white/60 mt-0.5">Keys for authenticating with the ProStep API</p>
        </DashboardCardHeader>
        <DashboardCardBody>
          {!apiKeys || apiKeys.length === 0 ? (
            <EmptyState
              icon={<Key className="w-8 h-8" />}
              title="No API keys"
              description="Create an API key to start integrating with the ProStep API."
              action={
                <button className="rounded-lg bg-[#fcd535] px-3 py-1.5 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors">
                  <Plus className="h-3.5 w-3.5 inline mr-1" />
                  Create Key
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fcd535]/15">
                      <Key className="h-4 w-4 text-[#fcd535]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{k.name}</p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span className="font-mono">{maskKey(k.key_prefix)}</span>
                        <span>·</span>
                        <span>{k.scopes?.length ? k.scopes.join(', ') : 'No scopes'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                        <span>Created {new Date(k.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>·</span>
                        <span>Last used {formatRelativeTime(k.last_used_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label="Active" variant="success" />
                    <button
                      onClick={() => handleCopy(k)}
                      className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white/60 transition-colors"
                      title={copiedId === k.id ? 'Copied!' : 'Copy key'}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-[#f6465d] transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>

      <DashboardCard>
        <DashboardCardHeader className="flex items-center justify-between">
          <DashboardCardTitle>Webhooks</DashboardCardTitle>
          <button className="text-xs text-[#fcd535] hover:underline">+ Add Webhook</button>
        </DashboardCardHeader>
        <DashboardCardBody>
          <EmptyState
            icon={<ExternalLink className="w-8 h-8" />}
            title="No webhooks configured"
            description="Set up webhooks to receive real-time notifications for trade events and alerts."
          />
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
