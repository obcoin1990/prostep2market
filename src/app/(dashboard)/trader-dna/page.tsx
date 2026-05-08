'use client';

import { AssessmentWizard } from '@/components/trader-dna/assessment-wizard';

export default function TraderDNAPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0B0B0B]">Trader DNA Assessment</h1>
        <p className="mt-2 text-[#616161]">
          Discover your trading personality and get personalized recommendations
        </p>
      </div>

      {/* Assessment wizard */}
      <AssessmentWizard />
    </div>
  );
}