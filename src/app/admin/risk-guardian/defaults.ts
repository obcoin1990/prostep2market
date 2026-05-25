// Shared defaults — no server imports, safe to import from Client Components

export interface RiskGuardianDefaults {
  // Existing thresholds
  max_session_duration: number
  max_trades_per_session: number
  max_trades_per_window: number
  exposure_multiplier: number
  fatigue_warning_enabled: boolean
  revenge_trading_alert_enabled: boolean
  emotional_instability_threshold: number

  // Scalping
  scalping_enabled: boolean
  scalping_min_duration_seconds: number
  scalping_max_trades_per_day: number

  // Arbitrage
  arbitrage_enabled: boolean
  arbitrage_max_avg_duration_seconds: number
  arbitrage_min_win_rate: number
  arbitrage_max_rr: number

  // Hedging
  hedging_enabled: boolean
  hedging_time_window_seconds: number
  hedging_lot_size_tolerance: number
}

export const DEFAULT_RISK_SETTINGS: RiskGuardianDefaults = {
  max_session_duration: 120,
  max_trades_per_session: 20,
  max_trades_per_window: 10,
  exposure_multiplier: 1.5,
  fatigue_warning_enabled: true,
  revenge_trading_alert_enabled: true,
  emotional_instability_threshold: 6,

  scalping_enabled: true,
  scalping_min_duration_seconds: 60,
  scalping_max_trades_per_day: 10,

  arbitrage_enabled: true,
  arbitrage_max_avg_duration_seconds: 60,
  arbitrage_min_win_rate: 80,
  arbitrage_max_rr: 0.5,

  hedging_enabled: true,
  hedging_time_window_seconds: 300,
  hedging_lot_size_tolerance: 0.1,
}
