'use client';

import { useState } from 'react';
import { Trade } from '@/types/strategy-lab';
import { formatCurrency, formatPercentage } from '@/lib/strategy-lab/metrics';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
}

type SortKey = 'entryTime' | 'pnl' | 'rr' | 'reason';

export function TradeList({ trades }: TradeListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('entryTime');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedTrades = [...trades].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ active, asc }: { active: boolean; asc: boolean }) => {
    if (!active) return null;
    return asc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium text-sm">#</th>
            <th 
              className="text-left p-3 font-medium text-sm cursor-pointer hover:bg-muted"
              onClick={() => toggleSort('entryTime')}
            >
              <div className="flex items-center gap-1">
                Entry Time
                <SortIcon active={sortKey === 'entryTime'} asc={sortAsc} />
              </div>
            </th>
            <th className="text-right p-3 font-medium text-sm">Entry</th>
            <th className="text-right p-3 font-medium text-sm">Exit</th>
            <th 
              className="text-right p-3 font-medium text-sm cursor-pointer hover:bg-muted"
              onClick={() => toggleSort('pnl')}
            >
              <div className="flex items-center justify-end gap-1">
                P&L
                <SortIcon active={sortKey === 'pnl'} asc={sortAsc} />
              </div>
            </th>
            <th 
              className="text-right p-3 font-medium text-sm cursor-pointer hover:bg-muted"
              onClick={() => toggleSort('rr')}
            >
              <div className="flex items-center justify-end gap-1">
                R:R
                <SortIcon active={sortKey === 'rr'} asc={sortAsc} />
              </div>
            </th>
            <th 
              className="text-left p-3 font-medium text-sm cursor-pointer hover:bg-muted"
              onClick={() => toggleSort('reason')}
            >
              <div className="flex items-center gap-1">
                Reason
                <SortIcon active={sortKey === 'reason'} asc={sortAsc} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTrades.map((trade, index) => (
            <tr key={index} className="border-t">
              <td className="p-3 text-sm">{index + 1}</td>
              <td className="p-3 text-sm">
                {new Date(trade.entryTime).toLocaleDateString()}
              </td>
              <td className="p-3 text-sm text-right">
                {trade.entryPrice.toFixed(5)}
              </td>
              <td className="p-3 text-sm text-right">
                {trade.exitPrice.toFixed(5)}
              </td>
              <td className={`p-3 text-sm text-right font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(trade.pnl)}
              </td>
              <td className={`p-3 text-sm text-right ${trade.rr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trade.rr.toFixed(2)}:1
              </td>
              <td className="p-3 text-sm text-muted-foreground">
                {trade.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}