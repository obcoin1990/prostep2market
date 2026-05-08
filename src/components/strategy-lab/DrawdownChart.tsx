'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { Trade } from '@/types/strategy-lab';
import { formatPercentage } from '@/lib/strategy-lab/metrics';

interface DrawdownChartProps {
  trades: Trade[];
  initialBalance: number;
}

export function DrawdownChart({ trades, initialBalance }: DrawdownChartProps) {
  // Build drawdown data
  const data: { index: number; drawdown: number; balance: number }[] = [];
  let maxBalance = initialBalance;
  let currentBalance = initialBalance;

  // Initial point
  data.push({ index: 0, drawdown: 0, balance: initialBalance });

  trades.forEach((trade, index) => {
    currentBalance += trade.pnl;
    if (currentBalance > maxBalance) {
      maxBalance = currentBalance;
    }
    const drawdown = ((maxBalance - currentBalance) / maxBalance) * 100;
    data.push({
      index: index + 1,
      drawdown: -drawdown,
      balance: currentBalance,
    });
  });

  const maxDrawdown = Math.min(...data.map(d => d.drawdown));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="index" 
            stroke="var(--muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            domain={['dataMin - 5', 0]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
            formatter={(value: unknown) => [formatPercentage(value as number), 'Drawdown']}
            labelFormatter={(index) => `Trade #${index}`}
          />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDrawdown)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-muted-foreground mt-2">
        Max Drawdown: {formatPercentage(maxDrawdown)}
      </div>
    </div>
  );
}