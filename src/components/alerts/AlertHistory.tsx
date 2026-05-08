'use client';

import { useState, useMemo } from 'react';
import { Alert, AlertType, Severity } from '@/types/guardian';
import { useAlerts } from '@/hooks/useAlerts';
import { Bell, Check, Filter } from 'lucide-react';

interface AlertHistoryProps {
  userId: string;
  initialAlerts?: Alert[];
}

type FilterType = 'all' | 'unacknowledged' | AlertType;
type FilterSeverity = 'all' | Severity;

export function AlertHistory({ userId, initialAlerts }: AlertHistoryProps) {
  const { alerts: fetchedAlerts, loading, acknowledgeAlert, refetch } = useAlerts(userId);
  const alerts = initialAlerts || fetchedAlerts;

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Type filter
      if (filterType === 'all') return true;
      if (filterType === 'unacknowledged') return !alert.acknowledged;
      return alert.type === filterType;
    }).filter(alert => {
      // Severity filter
      if (filterSeverity === 'all') return true;
      return alert.severity === filterSeverity;
    });
  }, [alerts, filterType, filterSeverity]);

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatAlertType = (type: AlertType) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center pb-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filters:</span>
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="px-3 py-1.5 text-sm border rounded-md bg-white"
        >
          <option value="all">All Types</option>
          <option value="unacknowledged">Unacknowledged</option>
          <option value="revenge_trading">Revenge Trading</option>
          <option value="fatigue">Fatigue</option>
          <option value="risk_escalation">Risk Escalation</option>
          <option value="emotional_instability">Emotional Instability</option>
          <option value="exposure_warning">Exposure Warning</option>
          <option value="overtrading">Overtrading</option>
        </select>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value as FilterSeverity)}
          className="px-3 py-1.5 text-sm border rounded-md bg-white"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>

      {/* Alert List */}
      {filteredAlerts.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No alerts yet. Keep up the disciplined trading!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${
                alert.acknowledged 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Severity indicator */}
                <div className={`w-3 h-3 rounded-full mt-1.5 ${getSeverityColor(alert.severity)}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      alert.severity === 'critical' 
                        ? 'bg-red-100 text-red-800' 
                        : alert.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatAlertType(alert.type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(alert.triggeredAt)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  
                  {alert.suggestedAction && (
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                      Suggested: {alert.suggestedAction}
                    </p>
                  )}
                </div>

                {/* Acknowledge button */}
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}