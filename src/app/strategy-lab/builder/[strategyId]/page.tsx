// Edit Strategy Page
import { getStrategyById, updateStrategy, StrategyFormData } from '@/lib/strategy-lab/builder';
import { StrategyBuilder } from '@/components/strategy-lab/StrategyBuilder';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock user ID - in production, this would come from auth
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

interface EditStrategyPageProps {
  params: Promise<{ strategyId: string }>;
}

export default async function EditStrategyPage({ params }: EditStrategyPageProps) {
  const resolvedParams = await params;
  const strategy = await getStrategyById(resolvedParams.strategyId, MOCK_USER_ID);

  if (!strategy) {
    notFound();
  }

  const initialData: StrategyFormData = {
    name: strategy.name,
    entryRules: strategy.entryRules,
    exitRules: strategy.exitRules,
    riskRules: strategy.riskRules,
  };

  async function handleSubmit(data: StrategyFormData) {
    'use server';
    try {
      await updateStrategy(resolvedParams.strategyId, MOCK_USER_ID, data);
      redirect(`/strategy-lab?updated=${resolvedParams.strategyId}`);
    } catch (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }
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
          
          <h1 className="text-2xl font-bold">Edit: {strategy.name}</h1>
          <p className="text-muted-foreground">
            Update your trading strategy rules
          </p>
        </div>
      </div>

      {/* Builder */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StrategyBuilder 
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}