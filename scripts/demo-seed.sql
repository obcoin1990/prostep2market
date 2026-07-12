-- =============================================================================
-- ProStep2Market Demo Account Seed Script
-- Run this in Supabase SQL Editor AFTER creating the demo user via the API
-- =============================================================================

-- Insert Trader DNA Profile
INSERT INTO trader_profiles (id, profile_type, risk_personality_score, emotional_stability_score, decision_making_score, trading_behavior_score, learning_style_score, learning_path, dashboard_layout, alert_thresholds, completed_at, created_at, updated_at)
VALUES ('demo-user-0000-0000-000000000000', 'analyst', 78, 65, 82, 71, 88, 'visual', '{"primaryWidget": "performance", "widgetOrder": ["performance", "alerts", "metrics"]}'::jsonb, '{"riskSensitivity": "medium", "alertFrequency": "normal"}'::jsonb, NOW(), NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET profile_type = EXCLUDED.profile_type, risk_personality_score = EXCLUDED.risk_personality_score, emotional_stability_score = EXCLUDED.emotional_stability_score, decision_making_score = EXCLUDED.decision_making_score, trading_behavior_score = EXCLUDED.trading_behavior_score, learning_style_score = EXCLUDED.learning_style_score;

-- Insert Edge Scores
INSERT INTO edge_scores (id, user_id, date, discipline_score, risk_score, emotional_stability_score, consistency_score, strategy_adherence_score, composite_score, rank, created_at)
VALUES
  ('edge-0001', 'demo-user-0000-0000-000000000000', CURRENT_DATE - 6, 72, 68, 60, 74, 78, 70.4, 'developing', NOW()),
  ('edge-0002', 'demo-user-0000-0000-000000000000', CURRENT_DATE - 5, 75, 70, 62, 76, 80, 72.6, 'developing', NOW()),
  ('edge-0003', 'demo-user-0000-0000-000000000000', CURRENT_DATE - 4, 74, 71, 64, 75, 79, 72.6, 'developing', NOW()),
  ('edge-0004', 'demo-user-0000-0000-000000000000', CURRENT_DATE - 3, 78, 73, 65, 78, 82, 75.2, 'consistent', NOW()),
  ('edge-0005', 'demo-user-0000-0000-000000000000', CURRENT_DATE - 2, 80, 72, 67, 80, 84, 76.6, 'consistent', NOW()),
  ('edge-0006', 'demo-user-0000-0000-000000000000', CURRENT_DATE - 1, 82, 74, 68, 81, 83, 77.6, 'consistent', NOW()),
  ('edge-0007', 'demo-user-0000-0000-000000000000', CURRENT_DATE, 84, 76, 71, 82, 85, 79.6, 'consistent', NOW())
ON CONFLICT (user_id, date) DO UPDATE SET composite_score = EXCLUDED.composite_score, rank = EXCLUDED.rank;

-- Insert Leaderboard Settings
INSERT INTO leaderboard_settings (user_id, visibility, show_in_leaderboard)
VALUES ('demo-user-0000-0000-000000000000', 'public', TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- Insert Demo Trades
INSERT INTO trades (id, user_id, symbol, entry_price, exit_price, stop_loss, take_profit, lot_size, entry_time, exit_time, session, result, pnl, confidence_score, stress_score, emotional_state, triggers, pre_trade_plan_adherence, notes, created_at)
VALUES
  ('trade-d-01', 'demo-user-0000-0000-000000000000', 'EUR/USD', 1.0845, 1.0892, 1.0820, 1.0900, 0.5, NOW() - INTERVAL '1 day' - INTERVAL '8 hours', NOW() - INTERVAL '1 day' - INTERVAL '6 hours', 'london', 'win', 235, 4, 2, 'confident', ARRAY['breakout', 'support'], 5, 'Clean breakout trade on EU session open', NOW()),
  ('trade-d-02', 'demo-user-0000-0000-000000000000', 'GBP/USD', 1.2760, 1.2730, 1.2790, 1.2680, 0.3, NOW() - INTERVAL '1 day' - INTERVAL '7 hours', NOW() - INTERVAL '1 day' - INTERVAL '5 hours', 'london', 'loss', -90, 3, 4, 'frustrated', ARRAY['news_event'], 3, 'Entered before data, got stopped out', NOW()),
  ('trade-d-03', 'demo-user-0000-0000-000000000000', 'USD/JPY', 149.30, 149.85, 149.00, 150.20, 0.4, NOW() - INTERVAL '1 day' - INTERVAL '4 hours', NOW() - INTERVAL '1 day' - INTERVAL '1 hour', 'newyork', 'win', 220, 4, 2, 'confident', ARRAY['trend_following'], 4, 'Trend continuation, partial TP hit', NOW()),
  ('trade-d-04', 'demo-user-0000-0000-000000000000', 'AUD/USD', 0.6630, 0.6655, 0.6610, 0.6680, 0.3, NOW() - INTERVAL '1 day' - INTERVAL '18 hours', NOW() - INTERVAL '1 day' - INTERVAL '15 hours', 'asian', 'win', 75, 3, 3, 'neutral', ARRAY['range_trading'], 4, 'Asian session range play', NOW()),
  ('trade-d-05', 'demo-user-0000-0000-000000000000', 'XAU/USD', 2015, 1998, 2022, 1990, 0.2, NOW() - INTERVAL '1 day' - INTERVAL '2 hours', NOW() - INTERVAL '1 day' - INTERVAL '30 minutes', 'newyork', 'loss', -340, 2, 5, 'fearful', ARRAY['fomo', 'breakout_failure'], 2, 'FOMO entry after gold spike', NOW()),
  ('trade-d-06', 'demo-user-0000-0000-000000000000', 'EUR/USD', 1.0860, 1.0840, 1.0880, 1.0810, 0.5, NOW() - INTERVAL '7 hours', NOW() - INTERVAL '5 hours', 'london', 'loss', -100, 3, 4, 'frustrated', ARRAY['revenge'], 2, 'Revenge trade after previous loss', NOW()),
  ('trade-d-07', 'demo-user-0000-0000-000000000000', 'GBP/JPY', 190.20, 190.95, 189.80, 191.50, 0.3, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours', 'london', 'win', 225, 5, 1, 'confident', ARRAY['momentum'], 5, 'Perfect momentum trade, A+ setup', NOW()),
  ('trade-d-08', 'demo-user-0000-0000-000000000000', 'USD/CAD', 1.3610, 1.3580, 1.3635, 1.3540, 0.4, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 hour', 'newyork', 'win', 120, 4, 2, 'neutral', ARRAY['resistance'], 4, 'Resistance bounce to plan', NOW()),
  ('trade-d-09', 'demo-user-0000-0000-000000000000', 'EUR/GBP', 0.8500, 0.8525, 0.8480, 0.8550, 0.3, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour', 'newyork', 'win', 75, 3, 3, 'neutral', ARRAY['cross_pair'], 4, 'Cross pair mean reversion', NOW()),
  ('trade-d-10', 'demo-user-0000-0000-000000000000', 'XAU/USD', 2005, 2018, 2000, 2025, 0.2, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', 'newyork', 'win', 260, 4, 2, 'confident', ARRAY['support_bounce'], 5, 'Gold support bounce at 2000 handle', NOW()),
  ('trade-d-11', 'demo-user-0000-0000-000000000000', 'AUD/USD', 0.6640, 0.6620, 0.6660, 0.6590, 0.4, NOW() - INTERVAL '2 days' - INTERVAL '1 hour', NOW() - INTERVAL '2 days' + INTERVAL '1 hour', 'asian', 'loss', -80, 3, 3, 'neutral', ARRAY['false_breakout'], 3, 'False breakout Asian open', NOW()),
  ('trade-d-12', 'demo-user-0000-0000-000000000000', 'NZD/USD', 0.6090, 0.6120, 0.6070, 0.6150, 0.3, NOW() - INTERVAL '2 days' - INTERVAL '7 hours', NOW() - INTERVAL '2 days' - INTERVAL '5 hours', 'london', 'win', 90, 3, 2, 'confident', ARRAY['dovish_rbnz'], 4, 'RBNZ reaction trade', NOW()),
  ('trade-d-13', 'demo-user-0000-0000-000000000000', 'EUR/USD', 1.0850, 1.0865, 1.0835, 1.0880, 0.6, NOW() - INTERVAL '2 days' - INTERVAL '4 hours', NOW() - INTERVAL '2 days' - INTERVAL '2 hours', 'newyork', 'win', 90, 4, 2, 'confident', ARRAY['eu_news'], 4, 'US session continuation', NOW()),
  ('trade-d-14', 'demo-user-0000-0000-000000000000', 'GBP/USD', 1.2740, 1.2780, 1.2720, 1.2810, 0.4, NOW() - INTERVAL '2 days' - INTERVAL '2 hours', NOW() - INTERVAL '2 days' - INTERVAL '30 minutes', 'newyork', 'win', 160, 4, 2, 'confident', ARRAY['usd_weakness'], 5, 'USD weakness across board', NOW()),
  ('trade-d-15', 'demo-user-0000-0000-000000000000', 'USD/JPY', 148.80, 148.40, 149.10, 148.00, 0.3, NOW() - INTERVAL '2 days' - INTERVAL '5 hours', NOW() - INTERVAL '2 days' - INTERVAL '4 hours', 'london', 'win', 120, 4, 2, 'confident', ARRAY['boj_intervention'], 4, 'BOJ verbal intervention trade', NOW());

-- Insert Risk Guardian Alerts
INSERT INTO alerts (id, user_id, type, severity, title, message, suggested_action, trade_ids, triggered_at, acknowledged)
VALUES
  ('alert-d-01', 'demo-user-0000-0000-000000000000', 'overtrading', 'warning', 'Overtrading Warning', '9 trades today — 80% above your daily average. Quality over quantity.', 'Review trade frequency. Consider ending your session.', ARRAY['trade-d-01','trade-d-02','trade-d-03','trade-d-04','trade-d-05','trade-d-06','trade-d-07','trade-d-08','trade-d-09'], NOW() - INTERVAL '6 hours', FALSE),
  ('alert-d-02', 'demo-user-0000-0000-000000000000', 'revenge_trading', 'critical', 'Revenge Trading Detected', 'After 3 consecutive losses you increased position size by 300%. Step away for 20 minutes.', 'Take a mandatory 20-minute cooldown break.', ARRAY['trade-d-06'], NOW() - INTERVAL '5 hours', FALSE),
  ('alert-d-03', 'demo-user-0000-0000-000000000000', 'fatigue', 'warning', 'Fatigue Risk Elevated', '4.5 hours continuous trading. Decision quality drops significantly after 3 hours.', 'Take a 30-minute break.', NULL, NOW() - INTERVAL '4 hours', FALSE),
  ('alert-d-04', 'demo-user-0000-0000-000000000000', 'risk_escalation', 'info', 'Exposure Warning', 'Current exposure exceeds normal profile by 40%. Review open positions.', 'Consider reducing position sizes.', ARRAY['trade-d-03','trade-d-04'], NOW() - INTERVAL '3 hours', FALSE),
  ('alert-d-05', 'demo-user-0000-0000-000000000000', 'emotional_instability', 'warning', 'Emotional Escalation Detected', 'Post-trade emotions trending negative across 3 consecutive trades.', 'Complete a psychology check-in exercise.', ARRAY['trade-d-02','trade-d-05','trade-d-06'], NOW() - INTERVAL '7 hours', TRUE);

-- Insert Risk Guardian Settings
INSERT INTO risk_guardian_settings (user_id, max_session_duration, max_trades_per_session, max_trades_per_window, exposure_multiplier, fatigue_warning_enabled, revenge_trading_alert_enabled, emotional_instability_threshold, updated_at)
VALUES ('demo-user-0000-0000-000000000000', 120, 50, 8, 1.30, TRUE, TRUE, 5, NOW())
ON CONFLICT (user_id) DO UPDATE SET max_session_duration = EXCLUDED.max_session_duration, max_trades_per_session = EXCLUDED.max_trades_per_session;

-- Insert MT5 Connection
INSERT INTO mt_connections (id, user_id, platform, broker_server, account_number, metaapi_account_id, status, last_sync_at, created_at, updated_at)
VALUES ('mt-conn-d-01', 'demo-user-0000-0000-000000000000', 'mt5', 'ICMarkets-Demo01', '51234567', 'metaapi-d-001', 'connected', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert MT4 Connection
INSERT INTO mt_connections (id, user_id, platform, broker_server, account_number, metaapi_account_id, status, last_sync_at, created_at, updated_at)
VALUES ('mt-conn-d-02', 'demo-user-0000-0000-000000000000', 'mt4', 'Pepperstone-Demo01', '87654321', 'metaapi-d-002', 'connected', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert MT Account Stats
INSERT INTO mt_account_stats (id, connection_id, user_id, balance, equity, margin, free_margin, margin_level, profit, currency, leverage, snapshot_at)
VALUES
  ('mt-stat-d-01', 'mt-conn-d-01', 'demo-user-0000-0000-000000000000', 12450.00, 12780.50, 2340.00, 10440.50, 546.18, 330.50, 'USD', 500, NOW()),
  ('mt-stat-d-02', 'mt-conn-d-02', 'demo-user-0000-0000-000000000000', 50000.00, 50215.00, 1800.00, 48415.00, 2789.72, 215.00, 'USD', 200, NOW());

-- Insert MT Open Positions
INSERT INTO mt_open_positions (id, connection_id, user_id, position_id, symbol, platform, order_type, volume, open_price, current_price, stop_loss, take_profit, profit, swap, commission, magic_number, open_time, last_updated)
VALUES
  ('mt-pos-d-01', 'mt-conn-d-01', 'demo-user-0000-0000-000000000000', 'pos-d-1001', 'EUR/USD', 'mt5', 'buy', 0.5, 1.0860, 1.0885, 1.0835, 1.0910, 125.00, -2.50, -3.50, 1001, NOW() - INTERVAL '8 hours', NOW()),
  ('mt-pos-d-02', 'mt-conn-d-01', 'demo-user-0000-0000-000000000000', 'pos-d-1002', 'GBP/JPY', 'mt5', 'buy', 0.3, 190.50, 191.20, 190.00, 191.80, 97.50, -1.80, -2.10, 1002, NOW() - INTERVAL '7 hours', NOW()),
  ('mt-pos-d-03', 'mt-conn-d-02', 'demo-user-0000-0000-000000000000', 'pos-d-2001', 'AUD/USD', 'mt4', 'sell', 0.4, 0.6645, 0.6625, 0.6670, 0.6600, 80.00, -1.20, -2.80, 2001, NOW() - INTERVAL '6 hours', NOW());

-- Insert Trading Session
INSERT INTO trading_sessions (id, user_id, session_start, last_trade_at, trade_count, active)
VALUES ('session-d-01', 'demo-user-0000-0000-000000000000', NOW() - INTERVAL '8 hours', NOW(), 10, TRUE);

-- =============================================================================
-- Summary
-- =============================================================================
SELECT '✅ Demo seed complete!' AS result;
SELECT CONCAT(
  '  📊 Trades inserted:    ', (SELECT COUNT(*) FROM trades WHERE user_id = 'demo-user-0000-0000-000000000000')
) AS trades_count;
SELECT CONCAT(
  '  📈 Edge scores:        ', (SELECT COUNT(*) FROM edge_scores WHERE user_id = 'demo-user-0000-0000-000000000000')
) AS edge_count;
SELECT CONCAT(
  '  🚨 Alerts created:     ', (SELECT COUNT(*) FROM alerts WHERE user_id = 'demo-user-0000-0000-000000000000')
) AS alert_count;
SELECT CONCAT(
  '  🔗 MT connections:     ', (SELECT COUNT(*) FROM mt_connections WHERE user_id = 'demo-user-0000-0000-000000000000')
) AS connection_count;
SELECT CONCAT(
  '  📋 Open positions:     ', (SELECT COUNT(*) FROM mt_open_positions WHERE user_id = 'demo-user-0000-0000-000000000000')
) AS position_count;
SELECT CONCAT(
  '  👤 Profile:            ', (SELECT profile_type FROM trader_profiles WHERE id = 'demo-user-0000-0000-000000000000')
) AS profile_type;
