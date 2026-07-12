export const DEMO_USER_ID = 'demo-user-0000-0000-000000000000'
export const DEMO_EMAIL = 'demo@prostep2market.com'
export const DEMO_PASSWORD = 'Demo123!'

export const demoTraderProfile = {
  id: DEMO_USER_ID,
  profile_type: 'analyst',
  risk_personality_score: 78,
  emotional_stability_score: 65,
  decision_making_score: 82,
  trading_behavior_score: 71,
  learning_style_score: 88,
  learning_path: 'visual',
  dashboard_layout: { primaryWidget: 'performance', widgetOrder: ['performance', 'alerts', 'metrics'] },
  alert_thresholds: { riskSensitivity: 'medium', alertFrequency: 'normal' },
  completed_at: '2026-05-10T08:00:00Z',
  created_at: '2026-05-10T08:00:00Z',
  updated_at: '2026-05-19T12:00:00Z',
}

export const demoEdgeScores = [
  { id: 'edge-01', user_id: DEMO_USER_ID, date: '2026-07-03', discipline_score: 72, risk_score: 68, emotional_stability_score: 60, consistency_score: 74, strategy_adherence_score: 78, composite_score: 70.4, rank: 'developing', created_at: '2026-07-03T23:00:00Z' },
  { id: 'edge-02', user_id: DEMO_USER_ID, date: '2026-07-04', discipline_score: 75, risk_score: 70, emotional_stability_score: 62, consistency_score: 76, strategy_adherence_score: 80, composite_score: 72.6, rank: 'developing', created_at: '2026-07-04T23:00:00Z' },
  { id: 'edge-03', user_id: DEMO_USER_ID, date: '2026-07-05', discipline_score: 74, risk_score: 71, emotional_stability_score: 64, consistency_score: 75, strategy_adherence_score: 79, composite_score: 72.6, rank: 'developing', created_at: '2026-07-05T23:00:00Z' },
  { id: 'edge-04', user_id: DEMO_USER_ID, date: '2026-07-06', discipline_score: 78, risk_score: 73, emotional_stability_score: 65, consistency_score: 78, strategy_adherence_score: 82, composite_score: 75.2, rank: 'consistent', created_at: '2026-07-06T23:00:00Z' },
  { id: 'edge-05', user_id: DEMO_USER_ID, date: '2026-07-07', discipline_score: 80, risk_score: 72, emotional_stability_score: 67, consistency_score: 80, strategy_adherence_score: 84, composite_score: 76.6, rank: 'consistent', created_at: '2026-07-07T23:00:00Z' },
  { id: 'edge-06', user_id: DEMO_USER_ID, date: '2026-07-08', discipline_score: 82, risk_score: 74, emotional_stability_score: 68, consistency_score: 81, strategy_adherence_score: 83, composite_score: 77.6, rank: 'consistent', created_at: '2026-07-08T23:00:00Z' },
  { id: 'edge-07', user_id: DEMO_USER_ID, date: '2026-07-09', discipline_score: 84, risk_score: 76, emotional_stability_score: 71, consistency_score: 82, strategy_adherence_score: 85, composite_score: 79.6, rank: 'consistent', created_at: '2026-07-09T23:00:00Z' },
]

export const demoTrades = [
  { id: 'trade-01', user_id: DEMO_USER_ID, symbol: 'EUR/USD', entry_price: 1.0845, exit_price: 1.0892, stop_loss: 1.0820, take_profit: 1.0900, lot_size: 0.5, entry_time: '2026-07-08T08:15:00Z', exit_time: '2026-07-08T10:30:00Z', session: 'london', result: 'win', pnl: 235, confidence_score: 4, stress_score: 2, emotional_state: 'confident', triggers: ['breakout', 'support'], pre_trade_plan_adherence: 5, notes: 'Clean breakout trade on EU session open' },
  { id: 'trade-02', user_id: DEMO_USER_ID, symbol: 'GBP/USD', entry_price: 1.2760, exit_price: 1.2730, stop_loss: 1.2790, take_profit: 1.2680, lot_size: 0.3, entry_time: '2026-07-08T09:45:00Z', exit_time: '2026-07-08T11:15:00Z', session: 'london', result: 'loss', pnl: -90, confidence_score: 3, stress_score: 4, emotional_state: 'frustrated', triggers: ['news_event'], pre_trade_plan_adherence: 3, notes: 'Entered before NFP data, got stopped out' },
  { id: 'trade-03', user_id: DEMO_USER_ID, symbol: 'USD/JPY', entry_price: 149.30, exit_price: 149.85, stop_loss: 149.00, take_profit: 150.20, lot_size: 0.4, entry_time: '2026-07-08T13:00:00Z', exit_time: '2026-07-08T15:45:00Z', session: 'newyork', result: 'win', pnl: 220, confidence_score: 4, stress_score: 2, emotional_state: 'confident', triggers: ['trend_following'], pre_trade_plan_adherence: 4, notes: 'Trend continuation trade, partial TP hit' },
  { id: 'trade-04', user_id: DEMO_USER_ID, symbol: 'AUD/USD', entry_price: 0.6630, exit_price: 0.6655, stop_loss: 0.6610, take_profit: 0.6680, lot_size: 0.3, entry_time: '2026-07-08T22:30:00Z', exit_time: '2026-07-09T01:15:00Z', session: 'asian', result: 'win', pnl: 75, confidence_score: 3, stress_score: 3, emotional_state: 'neutral', triggers: ['range_trading'], pre_trade_plan_adherence: 4, notes: 'Asian session range play' },
  { id: 'trade-05', user_id: DEMO_USER_ID, symbol: 'XAU/USD', entry_price: 2015, exit_price: 1998, stop_loss: 2022, take_profit: 1990, lot_size: 0.2, entry_time: '2026-07-08T14:30:00Z', exit_time: '2026-07-08T16:00:00Z', session: 'newyork', result: 'loss', pnl: -340, confidence_score: 2, stress_score: 5, emotional_state: 'fearful', triggers: ['fomo', 'breakout_failure'], pre_trade_plan_adherence: 2, notes: 'FOMO entry after gold spike, reversed hard' },
  { id: 'trade-06', user_id: DEMO_USER_ID, symbol: 'EUR/USD', entry_price: 1.0860, exit_price: 1.0840, stop_loss: 1.0880, take_profit: 1.0810, lot_size: 0.5, entry_time: '2026-07-09T07:30:00Z', exit_time: '2026-07-09T09:00:00Z', session: 'london', result: 'loss', pnl: -100, confidence_score: 3, stress_score: 4, emotional_state: 'frustrated', triggers: ['revenge'], pre_trade_plan_adherence: 2, notes: 'Revenge trade after previous day loss' },
  { id: 'trade-07', user_id: DEMO_USER_ID, symbol: 'GBP/JPY', entry_price: 190.20, exit_price: 190.95, stop_loss: 189.80, take_profit: 191.50, lot_size: 0.3, entry_time: '2026-07-09T08:15:00Z', exit_time: '2026-07-09T10:30:00Z', session: 'london', result: 'win', pnl: 225, confidence_score: 5, stress_score: 1, emotional_state: 'confident', triggers: ['momentum'], pre_trade_plan_adherence: 5, notes: 'Perfect momentum trade, A+ setup' },
  { id: 'trade-08', user_id: DEMO_USER_ID, symbol: 'USD/CAD', entry_price: 1.3610, exit_price: 1.3580, stop_loss: 1.3635, take_profit: 1.3540, lot_size: 0.4, entry_time: '2026-07-09T11:00:00Z', exit_time: '2026-07-09T13:30:00Z', session: 'newyork', result: 'win', pnl: 120, confidence_score: 4, stress_score: 2, emotional_state: 'neutral', triggers: ['resistance'], pre_trade_plan_adherence: 4, notes: 'Resistance bounce, executed to plan' },
  { id: 'trade-09', user_id: DEMO_USER_ID, symbol: 'EUR/GBP', entry_price: 0.8500, exit_price: 0.8525, stop_loss: 0.8480, take_profit: 0.8550, lot_size: 0.3, entry_time: '2026-07-09T14:00:00Z', exit_time: '2026-07-09T15:45:00Z', session: 'newyork', result: 'win', pnl: 75, confidence_score: 3, stress_score: 3, emotional_state: 'neutral', triggers: ['cross_pair'], pre_trade_plan_adherence: 4, notes: 'Cross pair mean reversion' },
  { id: 'trade-10', user_id: DEMO_USER_ID, symbol: 'XAU/USD', entry_price: 2005, exit_price: 2018, stop_loss: 2000, take_profit: 2025, lot_size: 0.2, entry_time: '2026-07-09T15:30:00Z', exit_time: '2026-07-09T17:00:00Z', session: 'newyork', result: 'win', pnl: 260, confidence_score: 4, stress_score: 2, emotional_state: 'confident', triggers: ['support_bounce'], pre_trade_plan_adherence: 5, notes: 'Gold support bounce at 2000 handle' },
  { id: 'trade-11', user_id: DEMO_USER_ID, symbol: 'AUD/USD', entry_price: 0.6640, exit_price: 0.6620, stop_loss: 0.6660, take_profit: 0.6590, lot_size: 0.4, entry_time: '2026-07-07T23:45:00Z', exit_time: '2026-07-08T02:00:00Z', session: 'asian', result: 'loss', pnl: -80, confidence_score: 3, stress_score: 3, emotional_state: 'neutral', triggers: ['false_breakout'], pre_trade_plan_adherence: 3, notes: 'False breakout on Asian open' },
  { id: 'trade-12', user_id: DEMO_USER_ID, symbol: 'NZD/USD', entry_price: 0.6090, exit_price: 0.6120, stop_loss: 0.6070, take_profit: 0.6150, lot_size: 0.3, entry_time: '2026-07-07T09:00:00Z', exit_time: '2026-07-07T11:30:00Z', session: 'london', result: 'win', pnl: 90, confidence_score: 3, stress_score: 2, emotional_state: 'confident', triggers: ['dovish_rbnz'], pre_trade_plan_adherence: 4, notes: 'RBNZ reaction trade' },
  { id: 'trade-13', user_id: DEMO_USER_ID, symbol: 'EUR/USD', entry_price: 1.0850, exit_price: 1.0865, stop_loss: 1.0835, take_profit: 1.0880, lot_size: 0.6, entry_time: '2026-07-07T12:00:00Z', exit_time: '2026-07-07T14:15:00Z', session: 'newyork', result: 'win', pnl: 90, confidence_score: 4, stress_score: 2, emotional_state: 'confident', triggers: ['eu_news'], pre_trade_plan_adherence: 4, notes: 'US session continuation' },
  { id: 'trade-14', user_id: DEMO_USER_ID, symbol: 'GBP/USD', entry_price: 1.2740, exit_price: 1.2780, stop_loss: 1.2720, take_profit: 1.2810, lot_size: 0.4, entry_time: '2026-07-07T14:30:00Z', exit_time: '2026-07-07T16:00:00Z', session: 'newyork', result: 'win', pnl: 160, confidence_score: 4, stress_score: 2, emotional_state: 'confident', triggers: ['usd_weakness'], pre_trade_plan_adherence: 5, notes: 'USD weakness across the board' },
  { id: 'trade-15', user_id: DEMO_USER_ID, symbol: 'USD/JPY', entry_price: 148.80, exit_price: 148.40, stop_loss: 149.10, take_profit: 148.00, lot_size: 0.3, entry_time: '2026-07-07T10:30:00Z', exit_time: '2026-07-07T12:00:00Z', session: 'london', result: 'win', pnl: 120, confidence_score: 4, stress_score: 2, emotional_state: 'confident', triggers: ['boj_intervention'], pre_trade_plan_adherence: 4, notes: 'BOJ verbal intervention trade' },
]

export const demoAlerts = [
  { id: 'alert-01', user_id: DEMO_USER_ID, type: 'overtrading', severity: 'warning', title: 'Overtrading Warning', message: '9 trades today — 80% above your daily average. Quality over quantity.', suggested_action: 'Review your trade frequency. Consider ending your session.', trade_ids: ['trade-01', 'trade-02', 'trade-03', 'trade-04', 'trade-05', 'trade-06', 'trade-07', 'trade-08', 'trade-09'], triggered_at: '2026-07-09T10:14:00Z', acknowledged: false },
  { id: 'alert-02', user_id: DEMO_USER_ID, type: 'revenge_trading', severity: 'critical', title: 'Revenge Trading Detected', message: 'After 3 consecutive losses you increased position size by 300%. Step away for 20 minutes.', suggested_action: 'Take a mandatory 20-minute cooldown break.', trade_ids: ['trade-06'], triggered_at: '2026-07-09T11:02:00Z', acknowledged: false },
  { id: 'alert-03', user_id: DEMO_USER_ID, type: 'fatigue', severity: 'warning', title: 'Fatigue Risk Elevated', message: '4.5 hours continuous trading. Decision quality drops significantly after 3 hours.', suggested_action: 'Take a 30-minute break. Your accuracy drops 31% after 3 hours.', trade_ids: [], triggered_at: '2026-07-09T12:30:00Z', acknowledged: false },
  { id: 'alert-04', user_id: DEMO_USER_ID, type: 'risk_escalation', severity: 'info', title: 'Exposure Warning', message: 'Current exposure exceeds normal profile by 40%. Review open positions.', suggested_action: 'Consider reducing position sizes or closing low-conviction trades.', trade_ids: ['trade-03', 'trade-04'], triggered_at: '2026-07-09T13:15:00Z', acknowledged: false },
  { id: 'alert-05', user_id: DEMO_USER_ID, type: 'emotional_instability', severity: 'warning', title: 'Emotional Escalation Detected', message: 'Post-trade emotions trending negative across 3 consecutive trades.', suggested_action: 'Complete a psychology check-in exercise from your Trader DNA profile.', trade_ids: ['trade-02', 'trade-05', 'trade-06'], triggered_at: '2026-07-09T09:30:00Z', acknowledged: true, acknowledged_at: '2026-07-09T09:45:00Z' },
]

export const demoRiskGuardianSettings = {
  user_id: DEMO_USER_ID,
  max_session_duration: 120,
  max_trades_per_session: 50,
  max_trades_per_window: 8,
  exposure_multiplier: 1.30,
  fatigue_warning_enabled: true,
  revenge_trading_alert_enabled: true,
  emotional_instability_threshold: 5,
  updated_at: '2026-07-09T12:00:00Z',
}

export const demoMTConnections = [
  { id: 'mt-conn-01', user_id: DEMO_USER_ID, platform: 'mt5', broker_server: 'ICMarkets-Demo01', account_number: '51234567', metaapi_account_id: 'metaapi-001', status: 'connected', last_sync_at: '2026-07-09T16:00:00Z', created_at: '2026-05-15T10:00:00Z', updated_at: '2026-07-09T16:00:00Z' },
  { id: 'mt-conn-02', user_id: DEMO_USER_ID, platform: 'mt4', broker_server: 'Pepperstone-Demo01', account_number: '87654321', metaapi_account_id: 'metaapi-002', status: 'connected', last_sync_at: '2026-07-09T15:45:00Z', created_at: '2026-05-20T14:00:00Z', updated_at: '2026-07-09T15:45:00Z' },
]

export const demoMTAccountStats = [
  { id: 'mt-stat-01', connection_id: 'mt-conn-01', user_id: DEMO_USER_ID, balance: 12450.00, equity: 12780.50, margin: 2340.00, free_margin: 10440.50, margin_level: 546.18, profit: 330.50, currency: 'USD', leverage: 500, snapshot_at: '2026-07-09T16:00:00Z' },
  { id: 'mt-stat-02', connection_id: 'mt-conn-02', user_id: DEMO_USER_ID, balance: 50000.00, equity: 50215.00, margin: 1800.00, free_margin: 48415.00, margin_level: 2789.72, profit: 215.00, currency: 'USD', leverage: 200, snapshot_at: '2026-07-09T15:45:00Z' },
]

export const demoMTOpenPositions = [
  { id: 'mt-pos-01', connection_id: 'mt-conn-01', user_id: DEMO_USER_ID, position_id: 'pos-1001', symbol: 'EUR/USD', platform: 'mt5', order_type: 'buy', volume: 0.5, open_price: 1.0860, current_price: 1.0885, stop_loss: 1.0835, take_profit: 1.0910, profit: 125.00, swap: -2.50, commission: -3.50, magic_number: 1001, open_time: '2026-07-09T08:15:00Z', last_updated: '2026-07-09T16:00:00Z' },
  { id: 'mt-pos-02', connection_id: 'mt-conn-01', user_id: DEMO_USER_ID, position_id: 'pos-1002', symbol: 'GBP/JPY', platform: 'mt5', order_type: 'buy', volume: 0.3, open_price: 190.50, current_price: 191.20, stop_loss: 190.00, take_profit: 191.80, profit: 97.50, swap: -1.80, commission: -2.10, magic_number: 1002, open_time: '2026-07-09T09:30:00Z', last_updated: '2026-07-09T16:00:00Z' },
  { id: 'mt-pos-03', connection_id: 'mt-conn-02', user_id: DEMO_USER_ID, position_id: 'pos-2001', symbol: 'AUD/USD', platform: 'mt4', order_type: 'sell', volume: 0.4, open_price: 0.6645, current_price: 0.6625, stop_loss: 0.6670, take_profit: 0.6600, profit: 80.00, swap: -1.20, commission: -2.80, magic_number: 2001, open_time: '2026-07-09T10:00:00Z', last_updated: '2026-07-09T15:45:00Z' },
]

export const demoClosedTrades = demoTrades.slice(0, 10).map((t, i) => ({
  id: `mt-closed-${i + 1}`,
  connection_id: 'mt-conn-01',
  user_id: DEMO_USER_ID,
  deal_id: `deal-${1000 + i}`,
  position_id: `pos-${2000 + i}`,
  symbol: t.symbol,
  platform: 'mt5',
  order_type: (t.pnl && t.pnl > 0) ? 'buy' : 'sell',
  volume: t.lot_size,
  open_price: t.entry_price,
  close_price: t.exit_price,
  stop_loss: t.stop_loss,
  take_profit: t.take_profit,
  profit: t.pnl,
  swap: -((i * 0.43 + 0.77) % 3).toFixed(2),
  commission: -(t.lot_size * 7),
  magic_number: 1000 + i,
  open_time: t.entry_time,
  close_time: t.exit_time,
  duration_seconds: Math.floor((new Date(t.exit_time).getTime() - new Date(t.entry_time).getTime()) / 1000),
  synced_at: '2026-07-09T16:00:00Z',
}))

export const demoEducationPaths = [
  { id: 'path-beginner', name: 'Beginner Foundation', description: 'Start here — learn the fundamentals of trading, market structure, and risk management.', courses: 8, progress: 100, color: '#0ecb81' },
  { id: 'path-technical', name: 'Technical Analysis', description: 'Master chart patterns, indicators, and price action for high-probability setups.', courses: 12, progress: 65, color: '#00B4D8' },
  { id: 'path-psychology', name: 'Trading Psychology', description: 'Develop the mental discipline and emotional control of a professional trader.', courses: 10, progress: 30, color: '#8A2BE2' },
  { id: 'path-advanced', name: 'Advanced Strategies', description: 'Multi-timeframe analysis, institutional order flow, and algorithmic concepts.', courses: 15, progress: 0, color: '#FF8A65' },
]

export const demoCourseProgress = [
  { id: 'prog-01', user_id: DEMO_USER_ID, course_id: 'course-beginner-01', lessons_completed: ['lesson-b-01', 'lesson-b-02', 'lesson-b-03', 'lesson-b-04'], quiz_score: 88, quiz_attempts: 1, completed_at: '2026-06-01T10:00:00Z', certificate_issued: true, certificate_url: '/certificates/beginner-01' },
  { id: 'prog-02', user_id: DEMO_USER_ID, course_id: 'course-technical-01', lessons_completed: ['lesson-t-01', 'lesson-t-02'], quiz_score: 75, quiz_attempts: 2, completed_at: null, certificate_issued: false },
]

export const demoNotifications = [
  { id: 'notif-01', user_id: DEMO_USER_ID, type: 'EDGE_SCORE_UPDATE', title: 'Edge Score Up 5 Points!', body: 'Your consistency and discipline scores improved this week. You are now in the top 30% of traders.', read: false, link: '/user', created_at: '2026-07-09T16:00:00Z' },
  { id: 'notif-02', user_id: DEMO_USER_ID, type: 'ALERT_TRIGGERED', title: 'Risk Guardian Alert: Overtrading', body: 'You exceeded your daily trade threshold. Consider reducing frequency.', read: false, link: '/risk-guardian', created_at: '2026-07-09T10:14:00Z' },
  { id: 'notif-03', user_id: DEMO_USER_ID, type: 'CERT_EARNED', title: 'Certificate: Beginner Foundation', body: 'Congratulations! You completed the Beginner Foundation course.', read: true, link: '/education/certificates', created_at: '2026-06-01T10:00:00Z' },
  { id: 'notif-04', user_id: DEMO_USER_ID, type: 'MT_SYNC', title: 'MT5 Account Synced', body: 'Your IC Markets MT5 account was synced successfully. 12 new trades imported.', read: true, link: '/connections', created_at: '2026-07-09T16:00:00Z' },
  { id: 'notif-05', user_id: DEMO_USER_ID, type: 'AI_INSIGHT', title: 'AI Analysis Complete', body: 'New insights available for your last 30 trades. Review your behavioral patterns.', read: false, link: '/analysis', created_at: '2026-07-09T14:00:00Z' },
]

export const dashboardData = {
  edgeScore: { composite_score: 79.6, discipline_score: 84, risk_score: 76, emotional_stability_score: 71, consistency_score: 82, strategy_adherence_score: 85, rank: 'consistent' },
  history: demoEdgeScores,
  analytics: {
    tradeStats: { pairs: demoTrades.filter(t => t.result === 'win').length, total: demoTrades.length, winRate: (demoTrades.filter(t => t.result === 'win').length / demoTrades.length * 100).toFixed(0) },
    aiAlerts: demoAlerts.filter(a => !a.acknowledged),
    heatmap: [],
    insights: [
      { id: 'insight-01', type: 'pattern', title: 'Best Session: London Open', description: 'Your win rate during London Open is 72% with an average RR of 2.0. Focus high-conviction setups during this window.', confidence: 92, actionability: 'quick_fix', suggestedAction: 'Prioritize London session for your best setups' },
      { id: 'insight-02', type: 'behavioral', title: 'Revenge Trading Pattern Detected', description: 'After losses, you tend to increase position size and trade impulsively. Set a hard stop-loss on trade frequency after 2 consecutive losses.', confidence: 88, actionability: 'requires_attention', suggestedAction: 'Enable cold-down mode after 2 losses' },
      { id: 'insight-03', type: 'risk', title: 'Position Sizing Drift', description: 'Your lot sizes vary significantly between trades (0.2 to 0.6). Consistent position sizing reduces emotional decision-making.', confidence: 85, actionability: 'quick_fix', suggestedAction: 'Set a fixed lot size for the next 20 trades' },
    ],
  },
  leaderboard: [
    { rank: 1, name: 'Sarah K.', score: 91, type: 'disciplinarian' },
    { rank: 2, name: 'Marcus J.', score: 87, type: 'sniper' },
    { rank: 3, name: 'You', score: 79, type: 'analyst', isCurrentUser: true },
    { rank: 4, name: 'Alex C.', score: 78, type: 'warrior' },
    { rank: 5, name: 'Emma W.', score: 74, type: 'disciplinarian' },
  ],
}

export function getDemoData(resource: string) {
  const data: Record<string, any> = {
    profile: demoTraderProfile,
    trades: demoTrades,
    edgescores: demoEdgeScores,
    alerts: demoAlerts,
    guardiansettings: demoRiskGuardianSettings,
    connections: demoMTConnections,
    accountstats: demoMTAccountStats,
    openpositions: demoMTOpenPositions,
    closedtrades: demoClosedTrades,
    educationpaths: demoEducationPaths,
    courseprogress: demoCourseProgress,
    notifications: demoNotifications,
    dashboard: dashboardData,
  }
  return data[resource] ?? null
}
