import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

/**
 * Server-side session tracking to avoid stale client data
 * Stores sessions in trading_sessions table
 */

export interface SessionInfo {
  sessionStart: Date;
  tradeCount: number;
}

/**
 * Get the active session for a user
 * Returns null if no active session (last trade > 30 min ago)
 */
export async function getActiveSession(userId: string): Promise<SessionInfo | null> {
  try {
    // Get recent trades for the user (last 50)
    const { data: trades, error } = await supabase
      .from('trades')
      .select('id, entry_time, exit_time')
      .eq('user_id', userId)
      .order('entry_time', { ascending: false })
      .limit(50);

    if (error || !trades || trades.length === 0) {
      return null;
    }

    // Find session start by looking for gaps > 30 minutes
    let sessionStart: Date | null = null;
    let tradeCount = 0;
    
    // Sort by time ascending to find session start
    const sortedTrades = [...trades].sort(
      (a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
    );

    for (let i = 0; i < sortedTrades.length; i++) {
      const currentTrade = sortedTrades[i];
      const currentTime = new Date(currentTrade.entry_time);

      if (sessionStart === null) {
        // First trade in the window starts the session
        sessionStart = currentTime;
        tradeCount = 1;
        continue;
      }

      // Check if there's a gap > 30 minutes from previous trade
      const timeDiff = currentTime.getTime() - sessionStart.getTime();
      
      if (timeDiff > THIRTY_MINUTES_MS) {
        // Gap found - start a new session
        sessionStart = currentTime;
        tradeCount = 1;
      } else {
        tradeCount++;
      }
    }

    if (!sessionStart) {
      return null;
    }

    // Check if session is still active (last trade within 30 min)
    const lastTrade = sortedTrades[sortedTrades.length - 1];
    const lastTradeTime = new Date(lastTrade.entry_time);
    const now = new Date();
    
    if (now.getTime() - lastTradeTime.getTime() > THIRTY_MINUTES_MS) {
      return null; // Session has ended
    }

    return {
      sessionStart,
      tradeCount
    };
  } catch (error) {
    console.error('Error getting active session:', error);
    return null;
  }
}

/**
 * Update session when a new trade is added
 * Creates or updates trading_sessions table record
 */
export async function updateSession(userId: string, tradeId: string): Promise<void> {
  try {
    const { data: existingSession } = await supabase
      .from('trading_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    const now = new Date().toISOString();

    if (existingSession) {
      // Update existing session
      await supabase
        .from('trading_sessions')
        .update({
          last_trade_at: now,
          trade_count: existingSession.trade_count + 1
        })
        .eq('id', existingSession.id);
    } else {
      // Create new session
      await supabase
        .from('trading_sessions')
        .insert({
          user_id: userId,
          session_start: now,
          last_trade_at: now,
          trade_count: 1,
          active: true
        });
    }
  } catch (error) {
    console.error('Error updating session:', error);
  }
}

/**
 * Check if a session is still active
 * Returns true if last trade was within 30 minutes
 */
export function isSessionActive(sessionStart: Date): boolean {
  const now = new Date();
  return now.getTime() - sessionStart.getTime() <= THIRTY_MINUTES_MS;
}