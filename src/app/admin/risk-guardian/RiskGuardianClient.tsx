'use client'

import React, { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Shield, AlertTriangle, Clock, Save, Info, RotateCcw,
  Zap, TrendingUp, GitBranch,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { RiskGuardianDefaults } from './defaults'
import { DEFAULT_RISK_SETTINGS } from './defaults'

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0A0F1C]">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]/50 ${
          checked ? 'bg-[#E53935]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

// ── Numeric Input Row ─────────────────────────────────────────────────────────

function NumericField({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  disabled = false,
}: {
  label: string
  description: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
  disabled?: boolean
}) {
  const handleChange = (raw: string) => {
    const n = parseFloat(raw)
    if (isNaN(n)) return
    const clamped = Math.min(max, Math.max(min, n))
    onChange(step < 1 ? Math.round(clamped / step) * step : clamped)
  }

  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-[#0A0F1C]'}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-24 text-right"
          disabled={disabled}
        />
        {suffix && <span className="text-xs text-gray-500 w-10">{suffix}</span>}
      </div>
    </div>
  )
}

// ── Section Header (enabled toggle + collapsed body) ─────────────────────────

function DetectionSection({
  icon: Icon,
  title,
  badge,
  enabled,
  onToggle,
  children,
}: {
  icon: React.ElementType
  title: string
  badge: string
  enabled: boolean
  onToggle: (v: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#E53935]" />
            <CardTitle className="text-base font-semibold text-[#0A0F1C]">{title}</CardTitle>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#E53935]/10 text-[#E53935] uppercase tracking-wide">
              {badge}
            </span>
          </div>
          <button
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggle(!enabled)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935]/50 ${
              enabled ? 'bg-[#E53935]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="divide-y divide-gray-100 pt-0">
          {children}
        </CardContent>
      )}
      {!enabled && (
        <CardContent className="pt-0 pb-3">
          <p className="text-xs text-gray-400 italic">Detection disabled — enable to configure thresholds.</p>
        </CardContent>
      )}
    </Card>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  initialSettings: RiskGuardianDefaults
}

export function RiskGuardianClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<RiskGuardianDefaults>(initialSettings)
  const [saving, setSaving] = useState(false)

  const set = useCallback(
    <K extends keyof RiskGuardianDefaults>(key: K, value: RiskGuardianDefaults[K]) => {
      setSettings((s) => ({ ...s, [key]: value }))
    },
    []
  )

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/risk-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Save failed')
      toast.success('Risk Guardian defaults saved')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [settings])

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-[#E53935]" />
            <h1 className="text-2xl font-bold text-[#0A0F1C]">Risk Guardian Rules Editor</h1>
          </div>
          <p className="text-sm text-gray-500">
            Set platform-wide default thresholds for all new users.
          </p>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <span className="font-semibold">These are DEFAULTS for new users.</span> Existing users
            keep their personal settings and are not affected by changes here. Abuse-detection
            thresholds apply to all users regardless of their profile type.
          </p>
        </div>

        {/* ── Session & Trade Limits ── */}
        <Card variant="light" className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
              <Clock className="w-4 h-4 text-[#E53935]" />
              Session &amp; Trade Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100">
            <NumericField
              label="Max Session Duration"
              description="Maximum trading session length before a fatigue alert is triggered."
              value={settings.max_session_duration}
              onChange={(v) => set('max_session_duration', v)}
              min={30} max={480} suffix="min"
            />
            <NumericField
              label="Max Trades Per Session"
              description="Hard cap on number of trades allowed in a single session."
              value={settings.max_trades_per_session}
              onChange={(v) => set('max_trades_per_session', v)}
              min={5} max={200} suffix="trades"
            />
            <NumericField
              label="Max Trades Per Rolling Window"
              description="Maximum trades allowed within a rolling time window (e.g. 1 hour)."
              value={settings.max_trades_per_window}
              onChange={(v) => set('max_trades_per_window', v)}
              min={1} max={50} suffix="trades"
            />
            <NumericField
              label="Exposure Multiplier"
              description="Position size multiplier ceiling relative to the user's base risk unit."
              value={settings.exposure_multiplier}
              onChange={(v) => set('exposure_multiplier', v)}
              min={1.0} max={3.0} step={0.1} suffix="×"
            />
          </CardContent>
        </Card>

        {/* ── Alert Toggles ── */}
        <Card variant="light" className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
              <AlertTriangle className="w-4 h-4 text-[#E53935]" />
              Alert Toggles
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100">
            <ToggleSwitch
              checked={settings.fatigue_warning_enabled}
              onChange={(v) => set('fatigue_warning_enabled', v)}
              label="Fatigue Warning"
              description="Alert the user when session duration approaches the maximum limit."
            />
            <ToggleSwitch
              checked={settings.revenge_trading_alert_enabled}
              onChange={(v) => set('revenge_trading_alert_enabled', v)}
              label="Revenge Trading Alert"
              description="Detect and warn when rapid successive losing trades are detected."
            />
            <div className="py-3">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A0F1C]">Emotional Instability Threshold</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Score (1–10) above which an emotional instability alert is triggered.
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Input
                    type="number"
                    min={1} max={10} step={1}
                    value={settings.emotional_instability_threshold}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10)
                      if (!isNaN(n)) set('emotional_instability_threshold', Math.min(10, Math.max(1, n)))
                    }}
                    className="w-20 text-right"
                  />
                  <span className="text-xs text-gray-500">/ 10</span>
                </div>
              </div>
              <div className="mt-3">
                <input
                  type="range" min={1} max={10} step={1}
                  value={settings.emotional_instability_threshold}
                  onChange={(e) => set('emotional_instability_threshold', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#E53935' }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 (lenient)</span>
                  <span>10 (strict)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Abuse Detection: Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Abuse Detection
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── Abusive Scalping ── */}
        <DetectionSection
          icon={Zap}
          title="Abusive Scalping"
          badge="GRDN-08"
          enabled={settings.scalping_enabled}
          onToggle={(v) => set('scalping_enabled', v)}
        >
          <NumericField
            label="Minimum Trade Duration"
            description="Trades closed in less than this time are counted as scalps."
            value={settings.scalping_min_duration_seconds}
            onChange={(v) => set('scalping_min_duration_seconds', v)}
            min={5} max={300} suffix="sec"
          />
          <NumericField
            label="Max Scalp Trades Per Day"
            description="Alert fires when this many sub-threshold-duration trades occur in a single day."
            value={settings.scalping_max_trades_per_day}
            onChange={(v) => set('scalping_max_trades_per_day', v)}
            min={1} max={100} suffix="trades"
          />
        </DetectionSection>

        {/* ── Arbitrage-Like Behavior ── */}
        <DetectionSection
          icon={TrendingUp}
          title="Arbitrage-Like Behavior"
          badge="GRDN-09"
          enabled={settings.arbitrage_enabled}
          onToggle={(v) => set('arbitrage_enabled', v)}
        >
          <NumericField
            label="Max Average Trade Duration"
            description="Average duration (seconds) across recent trades for the pattern to trigger."
            value={settings.arbitrage_max_avg_duration_seconds}
            onChange={(v) => set('arbitrage_max_avg_duration_seconds', v)}
            min={5} max={300} suffix="sec"
          />
          <NumericField
            label="Minimum Win Rate"
            description="Win rate threshold (%) — must be exceeded alongside other conditions."
            value={settings.arbitrage_min_win_rate}
            onChange={(v) => set('arbitrage_min_win_rate', v)}
            min={50} max={100} suffix="%"
          />
          <NumericField
            label="Maximum Risk-Reward Ratio"
            description="Avg RR below this value combined with high win rate signals arbitrage."
            value={settings.arbitrage_max_rr}
            onChange={(v) => set('arbitrage_max_rr', v)}
            min={0.1} max={2.0} step={0.05} suffix="RR"
          />
        </DetectionSection>

        {/* ── Hedging Behavior ── */}
        <DetectionSection
          icon={GitBranch}
          title="Hedging Behavior"
          badge="GRDN-10"
          enabled={settings.hedging_enabled}
          onToggle={(v) => set('hedging_enabled', v)}
        >
          <NumericField
            label="Opposing-Position Time Window"
            description="Positions on the same symbol within this window are checked for hedging."
            value={settings.hedging_time_window_seconds}
            onChange={(v) => set('hedging_time_window_seconds', v)}
            min={30} max={3600} suffix="sec"
          />
          <NumericField
            label="Lot-Size Similarity Tolerance"
            description="Maximum relative lot-size difference (e.g. 0.10 = within 10%) to flag as a hedge pair."
            value={settings.hedging_lot_size_tolerance}
            onChange={(v) => set('hedging_lot_size_tolerance', v)}
            min={0.01} max={0.5} step={0.01} suffix="ratio"
          />
        </DetectionSection>

        {/* ── Save / Reset ── */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="text-gray-600"
            onClick={() => {
              setSettings(DEFAULT_RISK_SETTINGS)
              toast.info('Defaults restored — click Save to persist')
            }}
            disabled={saving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button
            className="bg-[#E53935] hover:bg-[#C62828] text-white px-8"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving…' : 'Save Defaults'}
          </Button>
        </div>
      </div>
    </div>
  )
}
