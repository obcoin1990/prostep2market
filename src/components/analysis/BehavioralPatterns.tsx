'use client';

import type { BehavioralPatterns } from '@/types/analysis';

interface BehavioralPatternsCardProps {
  patterns: BehavioralPatterns | null;
}

const patternStyles = {
  revengeTrading: { color: 'text-red-600', bg: 'bg-red-50', icon: '🔄' },
  impulsiveTrades: { color: 'text-amber-600', bg: 'bg-amber-50', icon: '⚡' },
  overconfidence: { color: 'text-purple-600', bg: 'bg-purple-50', icon: '😎' },
  fearExits: { color: 'text-orange-600', bg: 'bg-orange-50', icon: '😰' },
  overtrading: { color: 'text-blue-600', bg: 'bg-blue-50', icon: '📈' },
  fomo: { color: 'text-green-600', bg: 'bg-green-50', icon: '👀' },
};

const patternNames: Record<keyof typeof patternStyles, string> = {
  revengeTrading: 'Revenge Trading',
  impulsiveTrades: 'Impulsive Trades',
  overconfidence: 'Overconfidence',
  fearExits: 'Fear Exits',
  overtrading: 'Overtrading',
  fomo: 'FOMO',
};

export function BehavioralPatternsCard({ patterns }: BehavioralPatternsCardProps) {
  if (!patterns) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Behavioral Patterns
        </h3>
        <p className="text-gray-500 text-sm">No pattern data available.</p>
      </div>
    );
  }

  const detectedPatterns = Object.entries(patterns)
    .filter(([, value]) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'object' && value !== null) {
        return 'detected' in value && value.detected;
      }
      return false;
    })
    .map(([key, value]) => ({ key: key as keyof typeof patternStyles, value }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Behavioral Patterns
      </h3>

      {detectedPatterns.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 text-green-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600">No behavioral patterns detected</p>
          <p className="text-xs text-gray-400 mt-1">
            Your trading behavior looks disciplined!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {detectedPatterns.map(({ key, value }) => {
            const style = patternStyles[key];
            const patternData = value as {
              detected: boolean;
              severity?: string;
              evidence?: string[];
              count?: number;
              triggers?: string[];
            };

            return (
              <div
                key={key}
                className={`${style.bg} rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{style.icon}</span>
                  <span className={`font-medium ${style.color}`}>
                    {patternNames[key]}
                  </span>
                  {patternData.severity && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        patternData.severity === 'high'
                          ? 'bg-red-200 text-red-800'
                          : patternData.severity === 'medium'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {patternData.severity}
                    </span>
                  )}
                </div>
                {patternData.evidence && patternData.evidence.length > 0 && (
                  <ul className="text-sm text-gray-600 ml-6 list-disc">
                    {patternData.evidence.slice(0, 3).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
                {patternData.count !== undefined && (
                  <p className="text-sm text-gray-600">
                    {patternData.count} instances detected
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
