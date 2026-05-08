'use client';

import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { FOREX_PAIRS } from '@/lib/strategy-lab/session-filters';

interface SimulationControlsProps {
  onRun: (params: SimulationParams) => Promise<void>;
  isLoading?: boolean;
}

export interface SimulationParams {
  strategyId: string;
  pair: string;
  startDate: string;
  endDate: string;
  sessionFilter: string[];
  behaviorRules: { type: string; value: number }[];
  initialBalance: number;
}

export function SimulationControls({ onRun, isLoading = false }: SimulationControlsProps) {
  const [pair, setPair] = useState('EURUSD');
  const [sessionFilter, setSessionFilter] = useState<string[]>([]);
  const [behaviorRules, setBehaviorRules] = useState<{ type: string; value: number }[]>([]);
  const [initialBalance, setInitialBalance] = useState(10000);
  const [initialBalanceError, setInitialBalanceError] = useState('');

  // Default date range: last 30 days
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const sessions = [
    { id: 'sydney', label: 'Sydney' },
    { id: 'tokyo', label: 'Tokyo' },
    { id: 'london', label: 'London' },
    { id: 'newyork', label: 'New York' },
  ];

  const behaviorRuleTypes = [
    { id: 'stop_after_losses', label: 'Stop after X losses', defaultValue: 3 },
    { id: 'stop_after_wins', label: 'Stop after X wins', defaultValue: 4 },
    { id: 'cooldown_after_trades', label: 'Cooldown (hours)', defaultValue: 1 },
    { id: 'max_daily_trades', label: 'Max daily trades', defaultValue: 5 },
  ];

  const toggleSession = (sessionId: string) => {
    setSessionFilter(prev => 
      prev.includes(sessionId)
        ? prev.filter(s => s !== sessionId)
        : [...prev, sessionId]
    );
  };

  const addBehaviorRule = (type: string) => {
    const ruleType = behaviorRuleTypes.find(r => r.id === type);
    if (ruleType) {
      setBehaviorRules(prev => [...prev, { type, value: ruleType.defaultValue }]);
    }
  };

  const removeBehaviorRule = (index: number) => {
    setBehaviorRules(prev => prev.filter((_, i) => i !== index));
  };

  const updateBehaviorRuleValue = (index: number, value: number) => {
    setBehaviorRules(prev => prev.map((r, i) => 
      i === index ? { ...r, value } : r
    ));
  };

  const handleBalanceChange = (value: string) => {
    const num = parseInt(value);
    if (num < 100) {
      setInitialBalanceError('Minimum balance is $100');
    } else if (num > 10000000) {
      setInitialBalanceError('Maximum balance is $10,000,000');
    } else {
      setInitialBalanceError('');
    }
    setInitialBalance(num || 0);
  };

  const handleSubmit = async () => {
    if (initialBalanceError) return;
    
    await onRun({
      strategyId: '', // Will be set by parent
      pair,
      startDate,
      endDate,
      sessionFilter,
      behaviorRules,
      initialBalance,
    });
  };

  return (
    <div className="space-y-6">
      {/* Trading Pair */}
      <div>
        <label className="block text-sm font-medium mb-2">Trading Pair</label>
        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background"
        >
          {FOREX_PAIRS.map((p) => (
            <option key={p.symbol} value={p.symbol}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Initial Balance */}
      <div>
        <label className="block text-sm font-medium mb-2">Initial Balance ($)</label>
        <input
          type="number"
          value={initialBalance}
          onChange={(e) => handleBalanceChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background"
          min="100"
          max="10000000"
        />
        {initialBalanceError && (
          <p className="text-sm text-destructive mt-1">{initialBalanceError}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            disabled
            className="w-full px-3 py-2 rounded-lg border bg-muted"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            disabled
            className="w-full px-3 py-2 rounded-lg border bg-muted"
          />
        </div>
      </div>

      {/* Session Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Trading Sessions (optional)</label>
        <div className="flex flex-wrap gap-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => toggleSession(session.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                sessionFilter.includes(session.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              }`}
            >
              {session.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Leave empty to use all sessions
        </p>
      </div>

      {/* Behavioral Rules */}
      <div>
        <label className="block text-sm font-medium mb-2">Behavioral Rules (optional)</label>
        
        {/* Add rule dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              addBehaviorRule(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-3 py-2 rounded-lg border bg-background mb-3"
          value=""
        >
          <option value="">Add a behavioral rule...</option>
          {behaviorRuleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Added rules */}
        {behaviorRules.map((rule, index) => {
          const ruleType = behaviorRuleTypes.find(r => r.id === rule.type);
          return (
            <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-2">
              <span className="flex-1 text-sm">{ruleType?.label}</span>
              <input
                type="number"
                value={rule.value}
                onChange={(e) => updateBehaviorRuleValue(index, parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 rounded border bg-background text-sm"
                min="1"
              />
              <button
                type="button"
                onClick={() => removeBehaviorRule(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Run Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !!initialBalanceError}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running Simulation...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run Simulation
          </>
        )}
      </button>
    </div>
  );
}