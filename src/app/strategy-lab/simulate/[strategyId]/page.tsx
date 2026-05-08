// Strategy Simulation Page
import { getStrategyById } from '@/lib/strategy-lab/builder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ClientSimulation } from './ClientSimulation';

// Mock user ID - in production, this would come from auth
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

interface SimulatePageProps {
  params: Promise<{ strategyId: string }>;
}

export default async function SimulatePage({ params }: SimulatePageProps) {
  const resolvedParams = await params;
  const strategy = await getStrategyById(resolvedParams.strategyId, MOCK_USER_ID);

  if (!strategy) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/strategy-lab"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Strategy Lab
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Simulate: {strategy.name}</h1>
              <p className="text-muted-foreground">
                {strategy.entryRules.length} entry, {strategy.exitRules.length} exit, {strategy.riskRules.length} risk rules
              </p>
            </div>
            <Link
              href={`/strategy-lab/builder/${resolvedParams.strategyId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent"
            >
              Edit Strategy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <div className="container mx-auto px-4 py-8">
        <ClientSimulation strategyId={resolvedParams.strategyId} />
      </div>
    </div>
  );
}