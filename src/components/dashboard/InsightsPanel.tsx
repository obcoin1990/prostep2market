'use client';

import Link from 'next/link';
import type { AIInsight } from '@/types/analysis';

interface InsightsPanelProps {
  insights: AIInsight[];
  onActionClick?: (insightId: string) => void;
}

const typeIcons: Record<AIInsight['type'], string> = {
  behavioral: '🧠',
  risk: '⚠️',
  pattern: '📊',
  action: '🎯',
};

const actionabilityStyles = {
  quick_fix: {
    badge: 'bg-green-100 text-green-800',
    label: 'Quick Fix',
  },
  requires_attention: {
    badge: 'bg-amber-100 text-amber-800',
    label: 'Needs Attention',
  },
  strategic: {
    badge: 'bg-gray-100 text-gray-800',
    label: 'Strategic',
  },
};

export function InsightsPanel({ insights, onActionClick }: InsightsPanelProps) {
  // Sort by actionability: quick_fix first, then requires_attention, then strategic
  const sortedInsights = [...insights].sort((a, b) => {
    const priority = { quick_fix: 0, requires_attention: 1, strategic: 2 };
    return priority[a.actionability] - priority[b.actionability];
  }).slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Actionable Insights</h3>
        <Link
          href="/analysis"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {sortedInsights.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm">No insights available yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Start logging trades to receive personalized recommendations.
            </p>
          </div>
        ) : (
          sortedInsights.map((insight) => {
            const badgeStyle = actionabilityStyles[insight.actionability];
            const icon = typeIcons[insight.type];

            return (
              <div
                key={insight.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-medium text-gray-900">{insight.title}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${badgeStyle.badge}`}
                  >
                    {badgeStyle.label}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </div>
                  <button
                    onClick={() => onActionClick?.(insight.id)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {insight.suggestedAction}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
