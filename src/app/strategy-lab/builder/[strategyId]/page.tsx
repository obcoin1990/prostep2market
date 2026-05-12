// Edit Strategy Page
import { getStrategyById, updateStrategy, StrategyFormData } from '@/lib/strategy-lab/builder';
import { StrategyBuilder } from '@/components/strategy-lab/StrategyBuilder';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EditStrategyPageProps {
  params: Promise<{ strategyId: string }>;
}

export default async function EditStrategyPage({ params }: EditStrategyPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Resolve params once at the top level so the server action can capture a
  // plain string (not a Promise), avoiding the "params should not be accessed
  // directly during rendering" error.
  const { strategyId } = await params;
  const strategy = await getStrategyById(strategyId, user.id);

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');
    try {
      // `strategyId` is the resolved string captured from the outer scope -
      // safe to use directly, no Promise involved.
      await updateStrategy(strategyId, user.id, data);
      redirect(`/strategy-lab?updated=${strategyId}`);
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
