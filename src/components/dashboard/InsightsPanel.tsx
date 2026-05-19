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
  quick_fix:           { badge: 'rgba(14,203,129,0.15)',  badgeText: '#0ecb81',  label: 'Quick Fix' },
  requires_attention:  { badge: 'rgba(252,213,53,0.15)', badgeText: '#fcd535',  label: 'Needs Attention' },
  strategic:           { badge: 'rgba(43,49,57,1)',       badgeText: '#707a8a',  label: 'Strategic' },
};

export function InsightsPanel({ insights, onActionClick }: InsightsPanelProps) {
  const sortedInsights = [...insights].sort((a, b) => {
    const priority = { quick_fix: 0, requires_attention: 1, strategic: 2 };
    return priority[a.actionability] - priority[b.actionability];
  }).slice(0, 3);

  return (
    <div className="rounded-[12px] p-6" style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>Actionable Insights</h3>
        <Link href="/analysis" className="text-sm font-medium transition-colors" style={{ color: '#fcd535' }}>
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {sortedInsights.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3" style={{ color: '#2b3139' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: '#707a8a' }}>No insights available yet.</p>
            <p className="text-xs mt-1" style={{ color: '#707a8a' }}>Start logging trades to receive personalized recommendations.</p>
          </div>
        ) : (
          sortedInsights.map((insight) => {
            const badgeStyle = actionabilityStyles[insight.actionability];
            const icon = typeIcons[insight.type];
            return (
              <div
                key={insight.id}
                className="rounded-[8px] p-4 transition-colors"
                style={{ border: '1px solid #2b3139', backgroundColor: '#1e2329' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#707a8a')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#2b3139')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{insight.title}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-[4px] font-medium flex-shrink-0"
                    style={{ backgroundColor: badgeStyle.badge, color: badgeStyle.badgeText }}
                  >
                    {badgeStyle.label}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: '#eaecef' }}>{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#707a8a' }}>
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </span>
                  <button
                    onClick={() => onActionClick?.(insight.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors"
                    style={{ backgroundColor: '#fcd535', color: '#181a20' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0b90b')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fcd535')}
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
