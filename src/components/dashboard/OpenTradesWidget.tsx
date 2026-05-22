'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Trade } from '@/hooks/useOpenTrades';

interface OpenTradesWidgetProps {
  trades: Trade[];
  openTrades: Trade[];
  isLoading: boolean;
}

function formatPrice(n: number) {
  return n.toFixed(5);
}

function formatPnl(pnl: number | null) {
  if (pnl === null) return '—';
  const sign = pnl >= 0 ? '+' : '';
  return `${sign}$${pnl.toFixed(2)}`;
}

const RESULT_CONFIG = {
  win:       { color: '#0ecb81', Icon: TrendingUp   },
  loss:      { color: '#f6465d', Icon: TrendingDown  },
  breakeven: { color: '#707a8a', Icon: Minus         },
} as const;

export function OpenTradesWidget({ trades, openTrades, isLoading }: OpenTradesWidgetProps) {
  // Show open trades first; fall back to recent closed trades
  const displayTrades = openTrades.length > 0 ? openTrades.slice(0, 5) : trades.slice(0, 5);
  const isOpen = openTrades.length > 0;

  return (
    <Card style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: '#fcd535' }} />
          <CardTitle className="text-sm font-semibold" style={{ color: '#eaecef' }}>
            {isOpen ? 'Open Trades' : 'Recent Trades'}
          </CardTitle>
          {isOpen && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(246,70,93,0.15)', color: '#f6465d' }}
            >
              {openTrades.length} live
            </span>
          )}
        </div>
        <Link
          href="/journal"
          className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
          style={{ color: '#fcd535' }}
        >
          Journal <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>

      <CardContent className="pt-1">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-10 w-full rounded" style={{ backgroundColor: '#2b3139' }} />
            ))}
          </div>
        ) : displayTrades.length === 0 ? (
          <div className="py-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: '#2b3139' }} />
            <p className="text-xs" style={{ color: '#707a8a' }}>No trades recorded yet.</p>
            <Link
              href="/journal"
              className="text-xs font-medium mt-1 inline-block transition-opacity hover:opacity-70"
              style={{ color: '#fcd535' }}
            >
              Log your first trade
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid #2b3139' }}>
                  <th className="text-left py-1.5 font-medium" style={{ color: '#707a8a' }}>Symbol</th>
                  <th className="text-right py-1.5 font-medium" style={{ color: '#707a8a' }}>Entry</th>
                  <th className="text-right py-1.5 font-medium" style={{ color: '#707a8a' }}>P&L</th>
                  <th className="text-right py-1.5 font-medium" style={{ color: '#707a8a' }}>Result</th>
                </tr>
              </thead>
              <tbody>
                {displayTrades.map((trade) => {
                  const cfg = trade.result ? RESULT_CONFIG[trade.result] : null;
                  const ResultIcon = cfg?.Icon;
                  const pnlColor =
                    trade.pnl === null
                      ? '#707a8a'
                      : trade.pnl > 0
                      ? '#0ecb81'
                      : trade.pnl < 0
                      ? '#f6465d'
                      : '#707a8a';

                  return (
                    <tr
                      key={trade.id}
                      style={{ borderBottom: '1px solid rgba(43,49,57,0.5)' }}
                    >
                      <td className="py-2 font-semibold" style={{ color: '#eaecef', fontFamily: 'var(--font-mono)' }}>
                        {trade.symbol}
                      </td>
                      <td className="py-2 text-right" style={{ color: '#b7bdc6', fontFamily: 'var(--font-mono)' }}>
                        {formatPrice(trade.entry_price)}
                      </td>
                      <td className="py-2 text-right font-semibold" style={{ color: pnlColor, fontFamily: 'var(--font-mono)' }}>
                        {trade.exit_time === null ? (
                          <span style={{ color: '#fcd535' }}>Live</span>
                        ) : (
                          formatPnl(trade.pnl)
                        )}
                      </td>
                      <td className="py-2 text-right">
                        {ResultIcon && cfg ? (
                          <ResultIcon className="w-3.5 h-3.5 ml-auto" style={{ color: cfg.color }} />
                        ) : (
                          <span style={{ color: '#707a8a' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
