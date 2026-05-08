'use client';

import type { TradeQualityAnalysis } from '@/types/analysis';

interface TradeQualityCardProps {
  trades: Array<{
    tradeId: string;
    quality: TradeQualityAnalysis;
  }>;
}

const gradeStyles = {
  A: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  B: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  C: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  D: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
};

export function TradeQualityCard({ trades }: TradeQualityCardProps) {
  if (!trades || trades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Quality</h3>
        <p className="text-gray-500 text-sm">No trade quality data available.</p>
      </div>
    );
  }

  // Calculate aggregate stats
  const avgEntryTiming =
    trades.reduce((sum, t) => sum + t.quality.entryTimingScore, 0) / trades.length;
  const avgExitQuality =
    trades.reduce((sum, t) => sum + t.quality.exitQualityScore, 0) / trades.length;
  const avgRREfficiency =
    trades.reduce((sum, t) => sum + t.quality.rrEfficiency, 0) / trades.length;

  // Count grades
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0 };
  trades.forEach((t) => {
    const grade = t.quality.qualityGrade;
    if (grade in gradeCounts) {
      gradeCounts[grade]++;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Quality</h3>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {avgEntryTiming.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Entry Timing</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {avgExitQuality.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Exit Quality</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {avgRREfficiency.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">RR Efficiency</div>
        </div>
      </div>

      {/* Grade distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quality Grades</h4>
        <div className="flex gap-2">
          {(Object.entries(gradeCounts) as [keyof typeof gradeStyles, number][]).map(
            ([grade, count]) => {
              const style = gradeStyles[grade];
              const percentage = trades.length > 0 ? (count / trades.length) * 100 : 0;
              return (
                <div key={grade} className="flex-1">
                  <div
                    className={`${style.bg} ${style.text} rounded-lg p-2 text-center`}
                  >
                    <div className="text-xl font-bold">{count}</div>
                    <div className="text-xs">Grade {grade}</div>
                    <div className="text-xs opacity-75">{percentage.toFixed(0)}%</div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
