'use client';

import { TrendingUp, TrendingDown, Target, Percent, DollarSign, Activity } from 'lucide-react';
import { SimulationMetrics } from '@/types/strategy-lab';
import { formatCurrency, formatPercentage } from '@/lib/strategy-lab/metrics';

interface MetricsSummaryProps {
  metrics: SimulationMetrics;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  const metricCards = [
    {
      label: 'Total Trades',
      value: metrics.totalTrades,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Win Rate',
      value: `${metrics.winRate}%`,
      icon: Percent,
      color: metrics.winRate >= 50 ? 'text-green-500' : 'text-red-500',
      bgColor: metrics.winRate >= 50 ? 'bg-green-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Avg R:R',
      value: `${metrics.avgRR}:1`,
      icon: TrendingUp,
      color: metrics.avgRR >= 2 ? 'text-green-500' : 'text-amber-500',
      bgColor: metrics.avgRR >= 2 ? 'bg-green-500/10' : 'bg-amber-500/10',
    },
    {
      label: 'Total P&L',
      value: formatCurrency(metrics.totalPnl),
      icon: DollarSign,
      color: metrics.totalPnl >= 0 ? 'text-green-500' : 'text-red-500',
      bgColor: metrics.totalPnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Max Drawdown',
      value: formatPercentage(-metrics.maxDrawdown),
      icon: TrendingDown,
      color: metrics.maxDrawdown <= 10 ? 'text-green-500' : metrics.maxDrawdown <= 20 ? 'text-amber-500' : 'text-red-500',
      bgColor: metrics.maxDrawdown <= 10 ? 'bg-green-500/10' : metrics.maxDrawdown <= 20 ? 'bg-amber-500/10' : 'bg-red-500/10',
    },
    {
      label: 'Consistency',
      value: `${metrics.consistencyScore}/100`,
      icon: Activity,
      color: metrics.consistencyScore >= 70 ? 'text-green-500' : metrics.consistencyScore >= 40 ? 'text-amber-500' : 'text-red-500',
      bgColor: metrics.consistencyScore >= 70 ? 'bg-green-500/10' : metrics.consistencyScore >= 40 ? 'bg-amber-500/10' : 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metricCards.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border bg-card p-4"
        >
          <div className={`inline-flex p-2 rounded-lg ${metric.bgColor} ${metric.color} mb-3`}>
            <metric.icon className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">{metric.value}</div>
          <div className="text-sm text-muted-foreground">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}