'use client';

import type { RiskMetrics } from '@/types/analysis';

interface RiskMetricsCardProps {
  metrics: RiskMetrics | null;
}

const recoveryStyles = {
  slow: { text: 'text-red-600', bg: 'bg-red-100' },
  normal: { text: 'text-amber-600', bg: 'bg-amber-100' },
  fast: { text: 'text-green-600', bg: 'bg-green-100' },
};

export function RiskMetricsCard({ metrics }: RiskMetricsCardProps) {
  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
        <p className="text-gray-500 text-sm">No risk metrics available.</p>
      </div>
    );
  }

  const recoveryStyle = recoveryStyles[metrics.drawdownBehavior.recoveryPattern];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Max Drawdown */}
        <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Max Drawdown</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">
              {metrics.drawdownBehavior.maxDrawdown.toFixed(1)}%
            </span>
            {metrics.drawdownBehavior.maxDrawdownDuration > 0 && (
              <span className="text-sm text-gray-500">
                ({metrics.drawdownBehavior.maxDrawdownDuration} days)
              </span>
            )}
          </div>
        </div>

        {/* Lot Size Variance */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Lot Size Variance</div>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.lotSizeVariance.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {metrics.lotSizeVariance > 30
              ? 'High variance - inconsistent sizing'
              : metrics.lotSizeVariance > 15
              ? 'Moderate variance'
              : 'Consistent position sizing'}
          </div>
        </div>

        {/* Recovery Pattern */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Recovery Pattern</div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full ${recoveryStyle.bg} ${recoveryStyle.text} font-medium text-sm capitalize`}>
            {metrics.drawdownBehavior.recoveryPattern}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Avg recovery: {metrics.drawdownBehavior.avgRecoveryDays} days
          </div>
        </div>

        {/* Margin Pressure Events */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Margin Pressure Events</div>
          <div className="text-2xl font-bold text-amber-600">
            {metrics.marginPressureEvents}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {metrics.marginPressureEvents === 0
              ? 'No excessive position sizing'
              : 'Consider reducing lot sizes'}
          </div>
        </div>

        {/* Max Concurrent Positions */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Max Concurrent Positions</div>
          <div className="text-2xl font-bold text-purple-600">
            {metrics.exposureProfile.maxConcurrentPositions}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Avg hold: {metrics.exposureProfile.avgHoldingPeriod.toFixed(1)}h
          </div>
        </div>
      </div>

      {/* Session Exposure */}
      {metrics.exposureProfile.sessionExposure &&
        Object.keys(metrics.exposureProfile.sessionExposure).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Session Exposure</h4>
            <div className="flex gap-2">
              {Object.entries(metrics.exposureProfile.sessionExposure).map(
                ([session, count]) => (
                  <div
                    key={session}
                    className="flex-1 text-center p-2 bg-blue-50 rounded-lg"
                  >
                    <div className="text-lg font-bold text-blue-700">{count}</div>
                    <div className="text-xs text-blue-600 capitalize">{session}</div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}
