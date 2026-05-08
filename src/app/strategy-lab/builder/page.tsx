// New Strategy Builder Page
import { StrategyBuilder } from '@/components/strategy-lab/StrategyBuilder';
import { createStrategy, StrategyFormData } from '@/lib/strategy-lab/builder';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock user ID - in production, this would come from auth
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export const metadata = {
  title: 'New Strategy - Strategy Lab',
  description: 'Create a new trading strategy.',
};

export default async function NewStrategyPage() {
  async function handleSubmit(data: StrategyFormData) {
    'use server';
    try {
      const strategy = await createStrategy(MOCK_USER_ID, data);
      redirect(`/strategy-lab?created=${strategy.id}`);
    } catch (error) {
      console.error('Error creating strategy:', error);
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
          
          <h1 className="text-2xl font-bold">New Strategy</h1>
          <p className="text-muted-foreground">
            Define your trading strategy rules
          </p>
        </div>
      </div>

      {/* Builder */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StrategyBuilder onSubmit={handleSubmit} />
      </div>
    </div>
  );
}