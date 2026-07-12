'use client'

import { useState } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface ApiKeyActionsProps {
  keyId: string
  keyPrefix: string
  isRevoked: boolean
  onRevoked?: () => void
}

export function ApiKeyActions({ keyId, keyPrefix, isRevoked, onRevoked }: ApiKeyActionsProps) {
  const [revoking, setRevoking] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(keyPrefix)
      toast.success('Key prefix copied to clipboard')
    } catch {
      toast.error('Failed to copy — try using a secure (HTTPS) connection')
    }
  }

  async function handleRevoke() {
    if (!confirm('Revoke this API key? This cannot be undone.')) return
    setRevoking(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('api_keys')
        .update({ revoked: true, revoked_at: new Date().toISOString() })
        .eq('id', keyId)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('API key revoked')
        onRevoked?.()
      }
    } catch {
      toast.error('Failed to revoke key')
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
        title="Copy key prefix"
      >
        <Copy className="w-4 h-4" />
      </button>
      {!isRevoked && (
        <button
          onClick={handleRevoke}
          disabled={revoking}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          title="Revoke key"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
