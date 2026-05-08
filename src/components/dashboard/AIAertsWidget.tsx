'use client';

import { useState } from 'react';

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  suggestedAction: string;
  timestamp?: Date;
}

interface AIAertsWidgetProps {
  alerts: Alert[];
}

const severityStyles = {
  critical: {
    border: 'border-l-4 border-red-600 bg-red-50',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
  },
  warning: {
    border: 'border-l-4 border-amber-500 bg-amber-50',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800',
  },
  info: {
    border: 'border-l-4 border-blue-500 bg-blue-50',
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-800',
  },
};

const SeverityIcon = ({ severity }: { severity: Alert['severity'] }) => {
  switch (severity) {
    case 'critical':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.865 1.539 1.291 3.214 1.291 4.83v.001c0 .232-.042.456-.12.657a5.988 5.988 0 01-2.216.767 5.988 5.988 0 01-2.216-.767 5.98 5.98 0 01-.12-.657v-.001c0-1.616.426-3.29 1.291-4.83l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
};

export function AIAertsWidget({ alerts }: AIAertsWidgetProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts
    .filter((a) => !dismissed.has(a.id))
    .slice(0, 5);

  const dismissAlert = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Alerts</h3>
        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          {visibleAlerts.length} active
        </span>
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No active alerts</p>
          <p className="text-xs text-gray-400 mt-1">Your trading looks healthy!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAlerts.map((alert) => {
            const style = severityStyles[alert.severity];
            const isExpanded = expanded.has(alert.id);

            return (
              <div
                key={alert.id}
                className={`rounded-lg p-4 ${style.border} transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${style.icon}`}>
                    <SeverityIcon severity={alert.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm text-gray-600 ${!isExpanded && 'line-clamp-2'}`}>
                      {alert.message}
                    </p>
                    {alert.message.length > 100 && (
                      <button
                        onClick={() => toggleExpand(alert.id)}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                    <div className="mt-3 text-sm text-gray-600 bg-white/50 rounded p-2">
                      <strong className="text-gray-700">Action:</strong>{' '}
                      <span className="text-gray-600">{alert.suggestedAction}</span>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
