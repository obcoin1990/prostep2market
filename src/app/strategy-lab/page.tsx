// Strategy Lab Home Page
import { getStrategiesByUser } from '@/lib/strategy-lab/builder';
import Link from 'next/link';
import { Plus, Settings, Play, Trash2, Clock } from 'lucide-react';

// Mock user ID - in production, this would come from auth
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export const metadata = {
  title: 'Strategy Lab - Prostep2market',
  description: 'Build, test, and optimize your trading strategies.',
};

export default async function StrategyLabPage() {
  const strategies = await getStrategiesByUser(MOCK_USER_ID);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Strategy Lab
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Build custom trading strategies with entry rules, exit rules, and risk management. 
              Test them against historical data and optimize for performance.
            </p>
            
            <Link
              href="/strategy-lab/builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Create New Strategy
            </Link>
          </div>
        </div>
      </section>

      {/* Strategies Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Your Strategies</h2>
        
        {strategies.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No strategies yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first strategy to start building and testing.
            </p>
            <Link
              href="/strategy-lab/builder"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Strategy
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {strategies.map((strategy) => (
              <div 
                key={strategy.id} 
                className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{strategy.name}</h3>
                
                {/* Rule Counts */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{strategy.entryRules.length} entry</span>
                  <span>{strategy.exitRules.length} exit</span>
                  <span>{strategy.riskRules.length} risk</span>
                </div>

                {/* Last Tested */}
                {strategy.lastTestedAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>
                      Last tested: {strategy.lastTestedAt.toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/strategy-lab/builder/${strategy.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent text-sm"
                  >
                    <Settings className="h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/strategy-lab/simulate/${strategy.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                  >
                    <Play className="h-4 w-4" />
                    Simulate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">How Strategy Testing Works</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                <span className="font-medium">Build Rules</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Define entry conditions, exit rules, and position sizing.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                <span className="font-medium">Run Simulation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Test against historical data with session filtering.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">3</span>
                <span className="font-medium">Optimize</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Compare RR ratios and behavioral rule impacts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}