/**
 * Automatically builds / updates a trader_profiles row from MT closed trade history.
 * Called after each sync or on demand via POST /api/mt/build-trader-dna.
 *
 * Scores computed (0–100):
 *  risk_personality_score   — based on SL usage, lot consistency, and max drawdown
 *  emotional_stability_score — based on revenge-pattern detection and loss streaks
 *  decision_making_score    — based on win rate and RR consistency
 *  trading_behavior_score   — based on avg trade duration and over-trading
 *  learning_style_score     — based on improvement trend over recent vs older trades
 *
 *  profile_type — sniper | analyst | warrior | disciplinarian | opportunist
 */

import { createAdminClient } from '@/lib/supabase/admin'
import type { MTClosedTrade } from '@/types/mt-connection'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DNAScores {
  risk_personality_score:    number  // 0–100
  emotional_stability_score: number
  decision_making_score:     number
  trading_behavior_score:    number
  learning_style_score:      number
  profile_type:              string
  learning_path:             string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)))
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  return Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length)
}

// ─── Score calculators ────────────────────────────────────────────────────────

/**
 * Risk Personality (0 = reckless, 100 = very disciplined risk manager)
 * Factors: SL usage rate, lot-size consistency, no large outlier losses
 */
function riskPersonalityScore(trades: MTClosedTrade[]): number {
  if (trades.length === 0) return 50

  const slRate = trades.filter((t) => t.stop_loss != null && t.stop_loss !== 0).length / trades.length
  const lots   = trades.map((t) => t.volume ?? 0).filter((v) => v > 0)
  const lotCV  = lots.length > 1 ? stdDev(lots) / (lots.reduce((a, b) => a + b, 0) / lots.length) : 0

  // SL usage contributes 50 pts, lot consistency 30 pts, outliers 20 pts
  const slScore   = slRate * 50
  const lotScore  = Math.max(0, 30 - lotCV * 30)   // penalise coefficient of variation
  const pnls      = trades.map((t) => (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0))
  const avgLoss   = pnls.filter((p) => p < 0).reduce((a, b) => a + Math.abs(b), 0) / Math.max(1, pnls.filter((p) => p < 0).length)
  const largeLoss = pnls.filter((p) => p < -(avgLoss * 3)).length
  const outlierScore = Math.max(0, 20 - largeLoss * 5)

  return clamp(slScore + lotScore + outlierScore)
}

/**
 * Emotional Stability (0 = highly emotional, 100 = very composed)
 * Factors: revenge trades (loss followed immediately by another loss within 5 min),
 *          consecutive loss streaks, loss streak recovery speed
 */
function emotionalStabilityScore(trades: MTClosedTrade[]): number {
  if (trades.length < 3) return 50

  let revengeCount = 0
  let maxLossStreak = 0, curStreak = 0

  for (let i = 1; i < trades.length; i++) {
    const prev = trades[i - 1]
    const curr = trades[i]
    const prevP = (prev.profit ?? 0) + (prev.commission ?? 0) + (prev.swap ?? 0)
    const currP = (curr.profit ?? 0) + (curr.commission ?? 0) + (curr.swap ?? 0)

    // Both losses and open within 5 min of prev close = revenge signal
    if (prevP < 0 && currP < 0) {
      const gap = prev.close_time && curr.open_time
        ? (new Date(curr.open_time).getTime() - new Date(prev.close_time).getTime()) / 1000
        : Infinity
      if (gap < 300) revengeCount++
    }

    if (currP < 0) { curStreak++ } else { curStreak = 0 }
    if (curStreak > maxLossStreak) maxLossStreak = curStreak
  }

  const revengePenalty = Math.min(40, revengeCount * 8)
  const streakPenalty  = Math.min(40, maxLossStreak * 5)
  return clamp(100 - revengePenalty - streakPenalty)
}

/**
 * Decision Making (0 = poor, 100 = excellent)
 * Factors: win rate, profit factor, RR consistency
 */
function decisionMakingScore(trades: MTClosedTrade[]): number {
  if (trades.length < 5) return 50

  const pnls    = trades.map((t) => (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0))
  const wins    = pnls.filter((p) => p > 0)
  const losses  = pnls.filter((p) => p < 0)
  const winRate = (wins.length / pnls.length) * 100

  const grossProfit = wins.reduce((a, b) => a + b, 0)
  const grossLoss   = Math.abs(losses.reduce((a, b) => a + b, 0))
  const pf          = grossLoss > 0 ? grossProfit / grossLoss : 2

  // Win rate: 0–50 pts
  const wrScore = winRate * 0.5
  // Profit factor: 0–30 pts (PF of 2 = 30 pts, 1 = 15 pts, <1 = 0)
  const pfScore = Math.min(30, pf * 15)
  // Bonus 20 pts if PF > 1.5 and win rate > 50%
  const bonus   = pf > 1.5 && winRate > 50 ? 20 : 0

  return clamp(wrScore + pfScore + bonus)
}

/**
 * Trading Behavior (0 = chaotic, 100 = systematic)
 * Factors: avg trade duration, scalping ratio, overtrading days
 */
function tradingBehaviorScore(trades: MTClosedTrade[]): number {
  if (trades.length === 0) return 50

  const durations  = trades.map((t) => t.duration_seconds ?? 0).filter((d) => d > 0)
  const avgDur     = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  const scalpRatio = trades.filter((t) => (t.duration_seconds ?? 9999) < 60).length / trades.length

  // Duration score: prefer 5 min–4 hours; penalise very short or very long
  let durScore = 50
  if (avgDur >= 300 && avgDur <= 14400) durScore = 50   // fine
  else if (avgDur < 300) durScore = avgDur / 6          // 0–50 pts scaled to 0–5 min
  else durScore = Math.max(0, 50 - (avgDur - 14400) / 3600 * 5)

  const scalpPenalty = scalpRatio * 40

  // Daily trade count penalty (>15/day considered overtrading)
  const byDay = new Map<string, number>()
  for (const t of trades) {
    const d = t.close_time?.slice(0, 10) ?? ''
    byDay.set(d, (byDay.get(d) ?? 0) + 1)
  }
  const overtradingDays = [...byDay.values()].filter((v) => v > 15).length
  const overtradingPenalty = Math.min(30, overtradingDays * 5)

  return clamp(durScore + 50 - scalpPenalty - overtradingPenalty)
}

/**
 * Learning Style (0 = stagnating, 100 = improving)
 * Compares win rate and profit factor of most recent 30% of trades vs first 30%.
 */
function learningStyleScore(trades: MTClosedTrade[]): number {
  if (trades.length < 10) return 50

  const slice = Math.max(5, Math.floor(trades.length * 0.3))
  const early = trades.slice(0, slice)
  const recent = trades.slice(trades.length - slice)

  const wr = (t: MTClosedTrade[]) => {
    const pnls = t.map((x) => (x.profit ?? 0) + (x.commission ?? 0) + (x.swap ?? 0))
    return (pnls.filter((p) => p > 0).length / Math.max(1, pnls.length)) * 100
  }

  const earlyWR  = wr(early)
  const recentWR = wr(recent)
  const delta    = recentWR - earlyWR  // positive = improving

  // Base 50 + up to ±50 based on improvement
  return clamp(50 + delta * 1.5)
}

/**
 * Map scores to a profile type.
 */
function inferProfileType(scores: Omit<DNAScores, 'profile_type' | 'learning_path'>): string {
  const { risk_personality_score: rp, decision_making_score: dm, trading_behavior_score: tb } = scores

  // Sniper: high DM, high RP, systematic behavior
  if (dm >= 70 && rp >= 70 && tb >= 60) return 'sniper'
  // Analyst: balanced, moderate risk, high learning
  if (scores.learning_style_score >= 65 && dm >= 60) return 'analyst'
  // Disciplinarian: very high RP, moderate everything else
  if (rp >= 75 && tb >= 60) return 'disciplinarian'
  // Warrior: aggressive, lower RP, high DM
  if (dm >= 65 && rp < 55) return 'warrior'
  // Opportunist: everything else
  return 'opportunist'
}

function inferLearningPath(type: string): string {
  const map: Record<string, string> = {
    sniper:          'precision-trading',
    analyst:         'data-driven-trading',
    warrior:         'risk-management',
    disciplinarian:  'advanced-strategies',
    opportunist:     'foundations',
  }
  return map[type] ?? 'foundations'
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function buildTraderDNA(opts: {
  userId: string
  connectionId?: string
}): Promise<DNAScores> {
  const db = createAdminClient()

  let q = db
    .from('mt_closed_trades')
    .select('*')
    .eq('user_id', opts.userId)
    .order('close_time', { ascending: true })
    .limit(1000)

  if (opts.connectionId) q = q.eq('connection_id', opts.connectionId) as typeof q

  const { data } = await q
  const trades: MTClosedTrade[] = data ?? []

  const rp  = riskPersonalityScore(trades)
  const es  = emotionalStabilityScore(trades)
  const dm  = decisionMakingScore(trades)
  const tb  = tradingBehaviorScore(trades)
  const ls  = learningStyleScore(trades)
  const pt  = inferProfileType({ risk_personality_score: rp, emotional_stability_score: es, decision_making_score: dm, trading_behavior_score: tb, learning_style_score: ls })
  const lp  = inferLearningPath(pt)

  const scores: DNAScores = {
    risk_personality_score:    rp,
    emotional_stability_score: es,
    decision_making_score:     dm,
    trading_behavior_score:    tb,
    learning_style_score:      ls,
    profile_type:              pt,
    learning_path:             lp,
  }

  // Upsert into trader_profiles (Supabase table, no Prisma)
  await db
    .from('trader_profiles')
    .upsert(
      {
        user_id:                   opts.userId,
        profile_type:              pt,
        learning_path:             lp,
        risk_personality_score:    rp,
        emotional_stability_score: es,
        decision_making_score:     dm,
        trading_behavior_score:    tb,
        learning_style_score:      ls,
        updated_at:                new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  return scores
}
