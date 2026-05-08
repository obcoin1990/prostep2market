'use client';

import { Alert, Severity } from '@/types/guardian';
import { toast } from 'sonner';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';

/**
 * Alert toast banner using Sonner
 * Shows alert notifications with severity-based styling
 */
export function showAlertNotification(alert: Alert) {
  const severityStyles: Record<Severity, { className: string; duration: number }> = {
    critical: { className: 'border-l-4 border-red-500 bg-red-50', duration: 0 },
    warning: { className: 'border-l-4 border-amber-500 bg-amber-50', duration: 8000 },
    info: { className: 'border-l-4 border-blue-500 bg-blue-50', duration: 5000 }
  };

  const style = severityStyles[alert.severity];

  switch (alert.severity) {
    case 'critical':
      toast.error(
        <div className={`p-2 ${style.className}`}>
          <div className="flex items-start gap-2">
            <Bell className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">{alert.title}</p>
              <p className="text-sm text-red-800">{alert.message}</p>
              {alert.suggestedAction && (
                <p className="text-xs text-red-700 mt-1 font-medium">{alert.suggestedAction}</p>
              )}
            </div>
          </div>
        </div>,
        {
          id: alert.id,
          duration: style.duration,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts'
          },
          cancel: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(alert.id)
          }
        }
      );
      break;
    case 'warning':
      toast.warning(
        <div className={`p-2 ${style.className}`}>
          <div className="flex items-start gap-2">
            <Bell className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">{alert.title}</p>
              <p className="text-sm text-amber-800">{alert.message}</p>
              {alert.suggestedAction && (
                <p className="text-xs text-amber-700 mt-1 font-medium">{alert.suggestedAction}</p>
              )}
            </div>
          </div>
        </div>,
        {
          id: alert.id,
          duration: style.duration,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts'
          }
        }
      );
      break;
    case 'info':
      toast.info(
        <div className={`p-2 ${style.className}`}>
          <div className="flex items-start gap-2">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">{alert.title}</p>
              <p className="text-sm text-blue-800">{alert.message}</p>
            </div>
          </div>
        </div>,
        {
          id: alert.id,
          duration: style.duration,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts'
          }
        }
      );
      break;
  }
}

/**
 * AlertBanner component - displays alerts in a list format (for non-toast use)
 */
interface AlertBannerProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  onAcknowledge?: (id: string) => void;
}

export function AlertBanner({ alert, onDismiss, onAcknowledge }: AlertBannerProps) {
  const severityColors = {
    critical: 'bg-red-50 border-red-500',
    warning: 'bg-amber-50 border-amber-500',
    info: 'bg-blue-50 border-blue-500'
  };

  const severityTextColors = {
    critical: 'text-red-900',
    warning: 'text-amber-900',
    info: 'text-blue-900'
  };

  const severityIconColors = {
    critical: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`p-4 border-l-4 rounded-r-md ${severityColors[alert.severity]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <Bell className={`w-5 h-5 mt-0.5 ${severityIconColors[alert.severity]}`} />
          <div>
            <p className={`font-semibold ${severityTextColors[alert.severity]}`}>{alert.title}</p>
            <p className="text-sm text-gray-700">{alert.message}</p>
            {alert.suggestedAction && (
              <p className="text-xs text-gray-600 mt-1 font-medium">{alert.suggestedAction}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {!alert.acknowledged && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
            >
              Acknowledge
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => onDismiss(alert.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}