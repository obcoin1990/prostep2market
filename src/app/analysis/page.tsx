'use client';

import { AIAertsWidget } from '@/components/dashboard/AIAertsWidget';
import { TradeStatsWidget } from '@/components/dashboard/TradeStatsWidget';
import { SessionHeatmap } from '@/components/dashboard/SessionHeatmap';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { TradeQualityCard } from '@/components/analysis/TradeQualityCard';
import { BehavioralPatternsCard } from '@/components/analysis/BehavioralPatterns';
import { RiskMetricsCard } from '@/components/analysis/RiskMetricsCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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

  const handleExportReport = async () => {
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
            onClick={handleExportReport}
            disabled={exportLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {exportLoading ? 'Generating...' : 'Export Report'}
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
  const router = useRouter();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Auth guard - redirect unauthenticated visitors to login
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login');
          return;
        }

        // Fetch dashboard analytics (alerts, trade stats, heatmap, insights)
        const dashRes = await fetch('/api/analytics/dashboard?days=30');
        if (dashRes.ok) {
          const data = await dashRes.json();
          setDashboardData(data);
        }

        // Fetch AI analysis (trade quality, behavioral patterns, risk metrics)
        const analysisRes = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startDate: thirtyDaysAgo.toISOString(),
            endDate: now.toISOString(),
          }),
        });
        if (analysisRes.ok) {
          const data = await analysisRes.json();
          // Map the response shape to what AnalysisPageClient expects
          setAnalysisData({
            tradeAnalyses: data.analysis?.tradeAnalyses || data.analysis?.trades || [],
            behavioralPatterns: data.analysis?.behavioralPatterns || data.analysis?.patterns || null,
            aggregatedRisk: data.analysis?.aggregatedRisk || data.analysis?.risk || null,
          });
        }
      } catch (err) {
        console.error('Failed to load analysis data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded-lg" />
          <div className="h-48 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-64 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <AnalysisPageClient
      dashboardData={dashboardData}
      analysisData={analysisData}
      dateRange={{ start: thirtyDaysAgo, end: now }}
    />
  );
}
