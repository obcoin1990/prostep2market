'use client';

import { useState } from 'react';
import type { PairStats } from '@/types/analysis';

interface TimeStat {
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  winRate: number;
  avgRR: number;
  totalTrades: number;
}

interface TradeStatsWidgetProps {
  pairStats: PairStats[];
  timeStats: TimeStat[];
}

type SortKey = 'winRate' | 'avgRR' | 'totalTrades' | 'totalPnl';
type SortDir = 'asc' | 'desc';

export function TradeStatsWidget({ pairStats, timeStats }: TradeStatsWidgetProps) {
  const [sortKey, setSortKey] = useState<SortKey>('winRate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sortedPairs = [...pairStats].sort((a, b) => {
    const aVal = a[sortKey] ?? 0;
    const bVal = b[sortKey] ?? 0;
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  }).slice(0, 5);

  const bestTimes  = [...timeStats].sort((a, b) => b.winRate - a.winRate);
  const worstTimes = [...timeStats].sort((a, b) => a.winRate - b.winRate);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(p => p === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey !== column ? null : (
      <svg className={`w-3 h-3 ml-1 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );

  return (
    <div className="rounded-[12px] p-6" style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <h3 className="text-base font-semibold mb-4" style={{ color: '#ffffff' }}>Trade Statistics</h3>

      <div className="mb-6">
        <h4 className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: '#9ea3ad' }}>Top Performing Pairs</h4>
        {sortedPairs.length === 0 ? (
          <div className="text-center py-6 text-sm" style={{ color: '#9ea3ad' }}>No trade data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #2b3139' }}>
                  {(['Pair', 'Win Rate', 'Avg RR', 'Trades'] as const).map((label, i) => {
                    const key = (['', 'winRate', 'avgRR', 'totalTrades'] as const)[i] as SortKey | '';
                    return (
                      <th
                        key={label}
                        className={`text-xs font-medium uppercase tracking-wider py-2 ${i === 0 ? 'text-left' : 'text-right cursor-pointer'}`}
                        style={{ color: '#9ea3ad' }}
                        onClick={() => key && toggleSort(key as SortKey)}
                      >
                        <span className={`flex items-center ${i === 0 ? '' : 'justify-end'}`}>
                          {label} {key && <SortIcon column={key as SortKey} />}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedPairs.map((pair) => (
                  <tr
                    key={pair.symbol}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #2b3139' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2b3139')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="py-2.5 text-sm font-medium" style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{pair.symbol}</td>
                    <td className="py-2.5 text-sm text-right font-medium" style={{ color: pair.winRate >= 50 ? '#0ecb81' : '#f6465d', fontFamily: 'var(--font-mono)' }}>
                      {pair.winRate.toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-sm text-right" style={{ color: '#eaecef', fontFamily: 'var(--font-mono)' }}>{pair.avgRR.toFixed(2)}</td>
                    <td className="py-2.5 text-sm text-right" style={{ color: '#eaecef', fontFamily: 'var(--font-mono)' }}>{pair.totalTrades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[8px] p-4" style={{ backgroundColor: 'rgba(14,203,129,0.08)', border: '1px solid rgba(14,203,129,0.2)' }}>
          <h4 className="text-xs font-medium mb-2" style={{ color: '#0ecb81' }}>Best Times</h4>
          {bestTimes.length === 0 ? (
            <p className="text-xs" style={{ color: '#9ea3ad' }}>No data</p>
          ) : (
            <div className="space-y-2">
              {bestTimes.slice(0, 2).map((t) => (
                <div key={t.session} className="flex justify-between text-sm">
                  <span className="capitalize" style={{ color: '#0ecb81' }}>{t.session}</span>
                  <span className="font-medium" style={{ color: '#0ecb81', fontFamily: 'var(--font-mono)' }}>{t.winRate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-[8px] p-4" style={{ backgroundColor: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)' }}>
          <h4 className="text-xs font-medium mb-2" style={{ color: '#f6465d' }}>Worst Times</h4>
          {worstTimes.length === 0 ? (
            <p className="text-xs" style={{ color: '#9ea3ad' }}>No data</p>
          ) : (
            <div className="space-y-2">
              {worstTimes.slice(0, 2).map((t) => (
                <div key={t.session} className="flex justify-between text-sm">
                  <span className="capitalize" style={{ color: '#f6465d' }}>{t.session}</span>
                  <span className="font-medium" style={{ color: '#f6465d', fontFamily: 'var(--font-mono)' }}>{t.winRate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
