'use client'

import React, { useState } from 'react'
import { Plug, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { MTConnection, MTPlatform } from '@/types/mt-connection'

// Common broker servers for autocomplete hints
const POPULAR_SERVERS = [
  'ICMarkets-Demo',
  'ICMarkets-Live01',
  'Pepperstone-Demo01',
  'Pepperstone-Live01',
  'XM.COM-Demo 3',
  'XM.COM-Real 12',
  'FusionMarkets-Demo',
  'FTMO-Demo',
]

interface MTConnectFormProps {
  onConnected: (conn: MTConnection) => void
}

export function MTConnectForm({ onConnected }: MTConnectFormProps) {
  const [platform, setPlatform]  = useState<MTPlatform>('mt5')
  const [server, setServer]      = useState('')
  const [account, setAccount]    = useState('')
  const [password, setPassword]  = useState('')
  const [showPwd, setShowPwd]    = useState(false)
  const [loading, setLoading]    = useState(false)
  const [error, setError]        = useState<string | null>(null)
  const [serverSuggestions, setServerSuggestions] = useState<string[]>([])

  const handleServerInput = (val: string) => {
    setServer(val)
    setServerSuggestions(
      val.length > 1
        ? POPULAR_SERVERS.filter((s) => s.toLowerCase().includes(val.toLowerCase()))
        : []
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!server.trim() || !account.trim() || !password.trim()) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/mt/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          brokerServer:    server.trim(),
          accountNumber:   account.trim(),
          investorPassword: password.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Connection failed')

      toast.success('MT account connected — syncing now…')
      setPassword('')
      onConnected(json.connection)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
          <Plug className="w-4 h-4 text-[#E53935]" />
          Connect MT4 / MT5 Account
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          Read-only investor password — no trades can be placed or modified.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
            <div className="flex gap-2">
              {(['mt4', 'mt5'] as MTPlatform[]).map((p) => (
<button
                  type="button"
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                    platform === p
                      ? 'bg-[#E53935] text-white border-[#E53935]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#E53935]'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Broker server */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Broker Server</label>
            <Input
              placeholder="e.g. ICMarkets-Demo01"
              value={server}
              onChange={(e) => handleServerInput(e.target.value)}
              autoComplete="off"
            />
            {serverSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg text-sm overflow-hidden">
                {serverSuggestions.map((s) => (
                  <li
                    key={s}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-gray-700"
                    onMouseDown={() => { setServer(s); setServerSuggestions([]) }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Account number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Number (Login)</label>
            <Input
              placeholder="e.g. 123456"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              type="text"
              inputMode="numeric"
            />
          </div>

          {/* Investor password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Investor Password</label>
            <div className="relative">
              <Input
                placeholder="Read-only investor password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPwd ? 'text' : 'password'}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Use the <strong>investor</strong> (read-only) password, not the master password.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#E53935] hover:bg-[#C62828] text-white"
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting…</>
            ) : (
              <><Plug className="w-4 h-4 mr-2" /> Connect Account</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
