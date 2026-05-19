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
    border: 'rgba(246,70,93,0.12)',
    borderLeft: '#f6465d',
    iconColor: '#f6465d',
    badgeBg: 'rgba(246,70,93,0.15)',
    badgeText: '#f6465d',
  },
  warning: {
    border: 'rgba(252,213,53,0.12)',
    borderLeft: '#fcd535',
    iconColor: '#fcd535',
    badgeBg: 'rgba(252,213,53,0.15)',
    badgeText: '#fcd535',
  },
  info: {
    border: 'rgba(59,130,246,0.12)',
    borderLeft: '#3b82f6',
    iconColor: '#3b82f6',
    badgeBg: 'rgba(59,130,246,0.15)',
    badgeText: '#3b82f6',
  },
};

const SeverityIcon = ({ severity }: { severity: Alert['severity'] }) => {
  switch (severity) {
    case 'critical':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
    case 'warning':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.765 1.36.765 3.096 0 4.456L11.743 17.9C10.978 19.26 9.022 19.26 8.257 17.9l-5.58-9.92c-.765-1.36-.765-3.096 0-4.456L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
    case 'info':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
  }
};

export function AIAertsWidget({ alerts }: AIAertsWidgetProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id)).slice(0, 5);
  const dismissAlert = (id: string) => setDismissed((prev) => new Set(prev).add(id));
  const toggleExpand = (id: string) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="rounded-[12px] p-6" style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>AI Alerts</h3>
        <span
          className="px-2.5 py-0.5 text-xs font-medium rounded-[4px]"
          style={{ backgroundColor: '#2b3139', color: '#eaecef' }}
        >
          {visibleAlerts.length} active
        </span>
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#2b3139' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm" style={{ color: '#707a8a' }}>No active alerts</p>
          <p className="text-xs mt-1" style={{ color: '#707a8a' }}>Your trading looks healthy!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAlerts.map((alert) => {
            const style = severityStyles[alert.severity];
            const isExpanded = expanded.has(alert.id);
            return (
              <div
                key={alert.id}
                className="rounded-[8px] p-4 border-l-4 transition-all duration-200"
                style={{ backgroundColor: style.border, borderLeftColor: style.borderLeft, borderLeftWidth: '4px', border: `1px solid ${style.border}`, borderLeft: `4px solid ${style.borderLeft}` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0" style={{ color: style.iconColor }}>
                    <SeverityIcon severity={alert.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium" style={{ color: '#ffffff' }}>{alert.title}</h4>
                      <span
                        className="text-xs px-2 py-0.5 rounded-[4px] flex-shrink-0 font-medium"
                        style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${!isExpanded ? 'line-clamp-2' : ''}`} style={{ color: '#eaecef' }}>
                      {alert.message}
                    </p>
                    {alert.message.length > 100 && (
                      <button onClick={() => toggleExpand(alert.id)} className="mt-1 text-xs" style={{ color: '#fcd535' }}>
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                    <div className="mt-3 text-sm rounded-[6px] p-2" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#eaecef' }}>
                      <strong style={{ color: '#ffffff' }}>Action:</strong>{' '}
                      {alert.suggestedAction}
                    </div>
                    <button onClick={() => dismissAlert(alert.id)} className="mt-2 text-xs transition-colors" style={{ color: '#707a8a' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#eaecef')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#707a8a')}
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
