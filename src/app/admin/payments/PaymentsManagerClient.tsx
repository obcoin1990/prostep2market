'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { CreditCard, ChevronDown, ChevronUp, Eye, EyeOff, Save, ToggleLeft, ToggleRight } from 'lucide-react'
import type { PaymentGatewayRow } from './page'

interface Props {
  initialGateways: PaymentGatewayRow[]
}

type GatewayProvider = 'stripe' | 'paypal' | 'paymob'

const GATEWAY_META: Record<GatewayProvider, { label: string; color: string }> = {
  stripe: { label: 'Stripe', color: '#635BFF' },
  paypal: { label: 'PayPal', color: '#003087' },
  paymob: { label: 'Paymob', color: '#0A7CFF' },
}

const DEFAULT_GATEWAY_FIELDS = {
  active: false,
  test_mode: true,
  public_key: null as string | null,
  secret_key: null as string | null,
  webhook_url: null as string | null,
  webhook_secret: null as string | null,
  extra_config: null as Record<string, unknown> | null,
}

function getGateway(gateways: PaymentGatewayRow[], provider: string): PaymentGatewayRow {
  return gateways.find((g) => g.provider === provider) ?? {
    id: '',
    provider,
    updated_at: null,
    ...DEFAULT_GATEWAY_FIELDS,
  }
}

function GatewayCard({
  provider,
  gateways,
  onUpdate,
}: {
  provider: GatewayProvider
  gateways: PaymentGatewayRow[]
  onUpdate: (updated: PaymentGatewayRow) => void
}) {
  const meta = GATEWAY_META[provider]
  const gateway = getGateway(gateways, provider)

  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState({
    public_key: gateway.public_key ?? '',
    secret_key: gateway.secret_key ?? '',
    webhook_url: gateway.webhook_url ?? '',
    webhook_secret: gateway.webhook_secret ?? '',
    test_mode: gateway.test_mode,
    extra_config: gateway.extra_config ? JSON.stringify(gateway.extra_config, null, 2) : '',
  })
  const [showSecret, setShowSecret] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSave() {
    let extra_config: Record<string, unknown> | null = null
    if (provider === 'paymob' && form.extra_config.trim()) {
      try {
        extra_config = JSON.parse(form.extra_config)
      } catch {
        toast.error('Invalid JSON in extra config')
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          public_key: form.public_key,
          secret_key: form.secret_key,
          webhook_url: form.webhook_url,
          webhook_secret: form.webhook_secret,
          test_mode: form.test_mode,
          extra_config,
          active: gateway.active,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save')
      onUpdate(json.data)
      // Update local form with masked values from server
      setForm((prev) => ({
        ...prev,
        secret_key: json.data.secret_key ?? '',
        webhook_secret: json.data.webhook_secret ?? '',
      }))
      toast.success(`${meta.label} settings saved`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving gateway')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive() {
    setToggling(true)
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, active: !gateway.active }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to toggle')
      onUpdate(json.data)
      toast.success(`${meta.label} ${!gateway.active ? 'activated' : 'deactivated'}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error toggling gateway')
    } finally {
      setToggling(false)
    }
  }

  return (
    <Card className={gateway.active ? 'border-[#2E7D32]/30' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: meta.color + '20' }}
            >
              <CreditCard className="w-5 h-5" style={{ color: meta.color }} />
            </div>
            <div>
              <CardTitle>{meta.label}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {gateway.active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="default">Inactive</Badge>
                )}
                {gateway.test_mode && (
                  <Badge variant="warning">Test Mode</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleActive}
              disabled={toggling}
              className="text-gray-500 hover:text-[#E53935] disabled:opacity-50 transition-colors"
              title={gateway.active ? 'Deactivate' : 'Activate'}
            >
              {gateway.active ? (
                <ToggleRight className="w-7 h-7 text-[#2E7D32]" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public Key</label>
              <input
                type="text"
                name="public_key"
                value={form.public_key}
                onChange={handleChange}
                placeholder={`${meta.label} public key`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  name="secret_key"
                  value={form.secret_key}
                  onChange={handleChange}
                  placeholder={`${meta.label} secret key`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="text"
                name="webhook_url"
                value={form.webhook_url}
                onChange={handleChange}
                placeholder="https://yourdomain.com/api/webhooks/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
              <div className="relative">
                <input
                  type={showWebhookSecret ? 'text' : 'password'}
                  name="webhook_secret"
                  value={form.webhook_secret}
                  onChange={handleChange}
                  placeholder="Webhook signing secret"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`${provider}_test_mode`}
                name="test_mode"
                checked={form.test_mode}
                onChange={handleChange}
                className="h-4 w-4 accent-[#E53935]"
              />
              <label htmlFor={`${provider}_test_mode`} className="text-sm font-medium text-gray-700">
                Test Mode (use sandbox credentials)
              </label>
            </div>

            {provider === 'paymob' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Config (JSON)
                </label>
                <textarea
                  name="extra_config"
                  value={form.extra_config}
                  onChange={handleChange}
                  rows={5}
                  placeholder='{"integration_id": "...", "iframe_id": "..."}'
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935] resize-y"
                />
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : `Save ${meta.label}`}
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {gateway.updated_at && (
        <div className="px-6 pb-3 text-xs text-gray-400">
          Last updated: {new Date(gateway.updated_at).toLocaleString()}
        </div>
      )}
    </Card>
  )
}

export function PaymentsManagerClient({ initialGateways }: Props) {
  const [gateways, setGateways] = useState<PaymentGatewayRow[]>(initialGateways)

  function handleUpdate(updated: PaymentGatewayRow) {
    setGateways((prev) => {
      const exists = prev.some((g) => g.provider === updated.provider)
      if (exists) {
        // If this one was just activated, deactivate others
        return prev.map((g) => {
          if (g.provider === updated.provider) return updated
          if (updated.active) return { ...g, active: false }
          return g
        })
      }
      return [...prev, updated]
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0F1C]">Payment Gateway Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Configure payment providers for subscriptions</p>
      </div>

      <Alert variant="info">
        <span className="text-sm text-blue-800">
          API keys are stored in the database. Use environment variables in production for added security.
        </span>
      </Alert>

      <Alert variant="warning">
        <span className="text-sm text-[#E53935]">
          Only one gateway should be active at a time for subscriptions. Activating a gateway will automatically deactivate all others.
        </span>
      </Alert>

      <div className="space-y-4">
        {(['stripe', 'paypal', 'paymob'] as GatewayProvider[]).map((provider) => (
          <GatewayCard
            key={provider}
            provider={provider}
            gateways={gateways}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  )
}
