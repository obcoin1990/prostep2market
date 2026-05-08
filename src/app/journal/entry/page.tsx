'use client';

import { TradeForm } from '@/components/journal/TradeForm'

export default function TradeEntryPage() {
  const handleSuccess = (trade: any) => {
    window.location.href = `/journal`
  }

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Log Trade</h1>
      <TradeForm onSubmitSuccess={handleSuccess} />
    </main>
  )
}