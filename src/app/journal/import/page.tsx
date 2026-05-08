'use client';

import { CsvImporter } from '@/components/journal/CsvImporter'

export default function CsvImportPage() {
  const handleComplete = (imported: number) => {
    console.log(`Imported ${imported} trades`)
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Import Trades</h1>
      <p className="text-gray-600 mb-8">
        Upload a CSV file with your trade history
      </p>
      
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <CsvImporter onImportComplete={handleComplete} />
      </div>
    </main>
  )
}