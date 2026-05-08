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

  // Sort pairs by selected key
  const sortedPairs = [...pairStats].sort((a, b) => {
    const aVal = a[sortKey] ?? 0;
    const bVal = b[sortKey] ?? 0;
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  }).slice(0, 5);

  // Sort sessions by win rate
  const bestTimes = [...timeStats].sort((a, b) => b.winRate - a.winRate);
  const worstTimes = [...timeStats].sort((a, b) => a.winRate - b.winRate);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return (
      <svg
        className={`w-3 h-3 ml-1 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Statistics</h3>

      {/* Top pairs table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Top Performing Pairs</h4>
        </div>
        {sortedPairs.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            No trade data available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                    Pair
                  </th>
                  <th
                    className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 cursor-pointer hover:text-gray-700"
                    onClick={() => toggleSort('winRate')}
                  >
                    <span className="flex items-center justify-end">
                      Win Rate <SortIcon column="winRate" />
                    </span>
                  </th>
                  <th
                    className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 cursor-pointer hover:text-gray-700"
                    onClick={() => toggleSort('avgRR')}
                  >
                    <span className="flex items-center justify-end">
                      Avg RR <SortIcon column="avgRR" />
                    </span>
                  </th>
                  <th
                    className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2 cursor-pointer hover:text-gray-700"
                    onClick={() => toggleSort('totalTrades')}
                  >
                    <span className="flex items-center justify-end">
                      Trades <SortIcon column="totalTrades" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPairs.map((pair) => (
                  <tr
                    key={pair.symbol}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 font-medium text-gray-900">{pair.symbol}</td>
                    <td className="py-2 text-right">
                      <span className={pair.winRate >= 50 ? 'text-green-600' : 'text-red-600'}>
                        {pair.winRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 text-right text-gray-600">{pair.avgRR.toFixed(2)}</td>
                    <td className="py-2 text-right text-gray-600">{pair.totalTrades}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Best/worst times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Best Times</h4>
          {bestTimes.length === 0 ? (
            <p className="text-xs text-gray-500">No data</p>
          ) : (
            <div className="space-y-2">
              {bestTimes.slice(0, 2).map((t) => (
                <div key={t.session} className="flex justify-between text-sm">
                  <span className="capitalize text-green-700">{t.session}</span>
                  <span className="font-medium text-green-800">{t.winRate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Worst Times</h4>
          {worstTimes.length === 0 ? (
            <p className="text-xs text-gray-500">No data</p>
          ) : (
            <div className="space-y-2">
              {worstTimes.slice(0, 2).map((t) => (
                <div key={t.session} className="flex justify-between text-sm">
                  <span className="capitalize text-red-700">{t.session}</span>
                  <span className="font-medium text-red-800">{t.winRate.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
