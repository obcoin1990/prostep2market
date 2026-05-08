'use client';

import { AIAertsWidget } from '@/components/dashboard/AIAertsWidget';
import { TradeStatsWidget } from '@/components/dashboard/TradeStatsWidget';
import { SessionHeatmap } from '@/components/dashboard/SessionHeatmap';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { TradeQualityCard } from '@/components/analysis/TradeQualityCard';
import { BehavioralPatternsCard } from '@/components/analysis/BehavioralPatterns';
import { RiskMetricsCard } from '@/components/analysis/RiskMetricsCard';
import { useState } from 'react';
import { generateReport } from '@/lib/analysis/reports/generator';

interface DashboardData {
  aiAlerts: any[];
  tradeStats: {
    pairs: any[];
    times: any[];
  };
  heatmap: any[];
  insights: any[];
}

interface AnalysisData {
  tradeAnalyses: any[];
  behavioralPatterns: any;
  aggregatedRisk: any;
}

interface AnalysisPageClientProps {
  dashboardData: DashboardData | null;
  analysisData: AnalysisData | null;
  dateRange: { start: Date; end: Date };
}

export function AnalysisPageClient({
  dashboardData,
  analysisData,
  dateRange,
}: AnalysisPageClientProps) {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportPDF = async () => {
    setExportLoading(true);
    try {
      await generateReport({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Analysis</h1>
          <p className="text-gray-600">Trade quality, patterns, and insights</p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-gray-500 px-3 py-2 bg-gray-100 rounded-lg">
            {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
          </div>
          <button
            onClick={handleExportPDF}
            disabled={exportLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {exportLoading ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AIAertsWidget alerts={dashboardData?.aiAlerts || []} />
        <TradeStatsWidget
          pairStats={dashboardData?.tradeStats?.pairs || []}
          timeStats={dashboardData?.tradeStats?.times || []}
        />
      </div>

      <SessionHeatmap data={dashboardData?.heatmap || []} />
      <InsightsPanel insights={dashboardData?.insights || []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TradeQualityCard trades={analysisData?.tradeAnalyses || []} />
        <BehavioralPatternsCard patterns={analysisData?.behavioralPatterns} />
      </div>

      <RiskMetricsCard metrics={analysisData?.aggregatedRisk} />
    </div>
  );
}

export default function AnalysisPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return (
    <AnalysisPageClient
      dashboardData={null}
      analysisData={null}
      dateRange={{ start: thirtyDaysAgo, end: now }}
    />
  );
}