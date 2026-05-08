'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Trade } from '@/types/strategy-lab';
import { formatCurrency } from '@/lib/strategy-lab/metrics';

interface EquityCurveChartProps {
  trades: Trade[];
  initialBalance: number;
}

export function EquityCurveChart({ trades, initialBalance }: EquityCurveChartProps) {
  // Build equity curve data
  const data: { index: number; balance: number; date: string }[] = [];
  let balance = initialBalance;

  data.push({
    index: 0,
    balance,
    date: new Date(trades[0]?.entryTime || Date.now()).toLocaleDateString(),
  });

  trades.forEach((trade, index) => {
    balance += trade.pnl;
    data.push({
      index: index + 1,
      balance,
      date: new Date(trade.exitTime).toLocaleDateString(),
    });
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
            formatter={(value: unknown) => [formatCurrency(value as number), 'Balance']}
            labelFormatter={(index) => `Trade #${index}`}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}