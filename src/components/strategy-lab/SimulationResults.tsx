'use client';

import { useState } from 'react';
import { SimulationMetrics, BehavioralImpact } from '@/types/strategy-lab';
import { Trade } from '@/types/strategy-lab';
import { MetricsSummary } from './MetricsSummary';
import { EquityCurveChart } from './EquityCurveChart';
import { DrawdownChart } from './DrawdownChart';
import { TradeList } from './TradeList';
import { formatCurrency, formatPercentage } from '@/lib/strategy-lab/metrics';
import { RefreshCw, Save, Download } from 'lucide-react';

interface RROptimizationResult {
  rr: number;
  totalTrades: number;
  winRate: number;
  totalPnl: number;
}

interface SimulationResultsProps {
  metrics: SimulationMetrics;
  trades: Trade[];
  initialBalance: number;
  rrOptimization?: RROptimizationResult[];
  behavioralComparison?: {
    original: SimulationMetrics;
    withRules: SimulationMetrics;
    impact: BehavioralImpact[];
  };
  onRunNew?: () => void;
}

export function SimulationResults({
  metrics,
  trades,
  initialBalance,
  rrOptimization,
  behavioralComparison,
  onRunNew,
}: SimulationResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'equity' | 'drawdown' | 'trades'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'equity', label: 'Equity Curve' },
    { id: 'drawdown', label: 'Drawdown' },
    { id: 'trades', label: 'Trades' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Summary */}
          <MetricsSummary metrics={metrics} />

          {/* RR Optimization */}
          {rrOptimization && rrOptimization.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">RR Optimization Results</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 text-sm font-medium">R:R</th>
                      <th className="text-right p-2 text-sm font-medium">Trades</th>
                      <th className="text-right p-2 text-sm font-medium">Win Rate</th>
                      <th className="text-right p-2 text-sm font-medium">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rrOptimization.map((result, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 text-sm font-medium">{result.rr}:1</td>
                        <td className="p-2 text-sm text-right">{result.totalTrades}</td>
                        <td className="p-2 text-sm text-right">{result.winRate}%</td>
                        <td className={`p-2 text-sm text-right font-medium ${result.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(result.totalPnl)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Behavioral Comparison */}
          {behavioralComparison && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Behavioral Rules Impact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Original P&L</div>
                  <div className={`text-xl font-bold ${behavioralComparison.original.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(behavioralComparison.original.totalPnl)}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">With Rules P&L</div>
                  <div className={`text-xl font-bold ${behavioralComparison.withRules.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(behavioralComparison.withRules.totalPnl)}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Impact</div>
                  <div className={`text-xl font-bold ${behavioralComparison.impact[0]?.impact >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(behavioralComparison.impact[0]?.impact || 0)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'equity' && (
        <EquityCurveChart trades={trades} initialBalance={initialBalance} />
      )}

      {activeTab === 'drawdown' && (
        <DrawdownChart trades={trades} initialBalance={initialBalance} />
      )}

      {activeTab === 'trades' && (
        <TradeList trades={trades} />
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {onRunNew && (
          <button
            onClick={onRunNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Run New Simulation
          </button>
        )}
      </div>
    </div>
  );
}