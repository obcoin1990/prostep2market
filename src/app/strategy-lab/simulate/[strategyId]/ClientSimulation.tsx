'use client';

import { useState } from 'react';
import { SimulationControls, SimulationParams } from '@/components/strategy-lab/SimulationControls';
import { SimulationResults } from '@/components/strategy-lab/SimulationResults';

interface ClientSimulationProps {
  strategyId: string;
}

export function ClientSimulation({ strategyId }: ClientSimulationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    metrics: any;
    trades: any[];
    initialBalance: number;
    rrOptimization?: any[];
    behavioralComparison?: any;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunSimulation = async (params: SimulationParams) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Simulation failed');
      }

      const data = await response.json();
      
      setResults({
        metrics: data.metrics,
        trades: data.trades || [],
        initialBalance: params.initialBalance,
        rrOptimization: data.rrOptimization,
        behavioralComparison: data.behavioralComparison,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run simulation');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="rounded-lg border bg-card p-6 sticky top-6">
          <h2 className="font-semibold mb-4">Simulation Settings</h2>
          <SimulationControls 
            onRun={(params) => handleRunSimulation({ ...params, strategyId })}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="lg:col-span-2">
        {results ? (
          <SimulationResults
            metrics={results.metrics}
            trades={results.trades}
            initialBalance={results.initialBalance}
            rrOptimization={results.rrOptimization}
            behavioralComparison={results.behavioralComparison}
          />
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Simulate</h3>
            <p className="text-muted-foreground">
              Configure your simulation settings and click "Run Simulation" to see results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}