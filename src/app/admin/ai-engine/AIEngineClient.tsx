'use client'

import React, { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Brain, Zap, FileText, BarChart2, Eye, Activity, ExternalLink, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AIEngineSettings } from './page'

// ── Constants ─────────────────────────────────────────────────────────────────

const MODELS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] as const

const FEATURE_TOGGLES: {
  key: keyof AIEngineSettings
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    key: 'analysis_enabled',
    label: 'Trade Analysis',
    description: 'AI-powered post-trade analysis and insights for each journal entry.',
    icon: <BarChart2 className="w-4 h-4" />,
  },
  {
    key: 'pattern_detection_enabled',
    label: 'Pattern Detection',
    description: 'Detects recurring trading patterns and behavioral signals.',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    key: 'behavioral_analysis_enabled',
    label: 'Behavioral Analysis',
    description: 'Analyses emotional and psychological drivers behind trades.',
    icon: <Brain className="w-4 h-4" />,
  },
  {
    key: 'pdf_reports_enabled',
    label: 'PDF Reports',
    description: 'Generates downloadable AI-written PDF performance reports.',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    key: 'ai_insights_enabled',
    label: 'AI Insights Feed',
    description: 'Surface personalised AI insights on the dashboard home.',
    icon: <Eye className="w-4 h-4" />,
  },
]

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]/50 ${
        checked ? 'bg-[#E53935]' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function persistSettings(settings: AIEngineSettings): Promise<void> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'ai_engine', value: settings }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Save failed')
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  initialSettings: AIEngineSettings
}

export function AIEngineClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<AIEngineSettings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // For model config — explicit save
  const handleModelSave = useCallback(async () => {
    setSaving(true)
    try {
      await persistSettings(settings)
      toast.success('Model configuration saved')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [settings])

  // For feature toggles — debounced auto-save
  const handleToggle = useCallback(
    (key: keyof AIEngineSettings, value: boolean) => {
      const next = { ...settings, [key]: value }
      setSettings(next)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        try {
          await persistSettings(next)
          toast.success('Feature toggle saved')
        } catch (err: unknown) {
          toast.error(err instanceof Error ? err.message : 'Failed to save toggle')
        }
      }, 500)
    },
    [settings]
  )

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-6 h-6 text-[#E53935]" />
            <h1 className="text-2xl font-bold text-[#0A0F1C]">AI Engine Controls</h1>
          </div>
          <p className="text-sm text-gray-500">
            Configure AI model parameters and enable or disable AI features platform-wide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — Model Configuration */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-[#E53935]" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  OpenAI Model
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]"
                >
                  {MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  gpt-4o-mini is fastest and most cost-effective for routine analysis.
                </p>
              </div>

              {/* Max Tokens */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Max Tokens</label>
                  <span className="text-sm font-mono font-bold text-[#E53935]">
                    {settings.max_tokens}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={100}
                  value={settings.max_tokens}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, max_tokens: parseInt(e.target.value, 10) }))
                  }
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#E53935' }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>500</span>
                  <span>4000</span>
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">Temperature</label>
                  <span className="text-sm font-mono font-bold text-[#E53935]">
                    {settings.temperature.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={Math.round(settings.temperature * 10)}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      temperature: parseInt(e.target.value, 10) / 10,
                    }))
                  }
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#E53935' }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.0 (precise)</span>
                  <span>1.0 (creative)</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#E53935] hover:bg-[#C62828] text-white"
                onClick={handleModelSave}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving…' : 'Save Model Config'}
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT — Feature Toggles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-[#E53935]" />
                Feature Toggles
              </CardTitle>
              <p className="text-xs text-gray-400">Changes auto-save after 500ms</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {FEATURE_TOGGLES.map(({ key, label, description, icon }) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 text-gray-500 flex-shrink-0">{icon}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0A0F1C]">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    <ToggleSwitch
                      checked={settings[key] as boolean}
                      onChange={(v) => handleToggle(key, v)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* API Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-4 h-4 text-[#E53935]" />
              API Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Tracked via OpenAI Dashboard</p>
                <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                  Token consumption, cost breakdowns, and rate limit status are monitored directly
                  in the OpenAI usage dashboard. Visit{' '}
                  <a
                    href="https://platform.openai.com/usage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium hover:text-blue-800"
                  >
                    platform.openai.com/usage
                  </a>{' '}
                  for real-time statistics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
