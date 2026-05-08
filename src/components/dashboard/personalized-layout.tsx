import { 
  TraderProfile, 
  ProfileType, 
  DashboardLayout, 
  AlertThresholds 
} from '@/types/trader-dna';

// Widget order configuration per profile type
const WIDGET_ORDERS: Record<ProfileType, string[]> = {
  sniper: ['analysis', 'performance', 'alerts', 'risk'],
  analyst: ['metrics', 'charts', 'performance', 'alerts'],
  warrior: ['quickActions', 'alerts', 'journal', 'performance'],
  disciplinarian: ['checklists', 'adherence', 'performance', 'metrics'],
  opportunist: ['tools', 'alerts', 'journal', 'performance'],
};

// Default layouts for users without a profile
const DEFAULT_LAYOUT: DashboardLayout = {
  primaryWidget: 'performance',
  widgetOrder: ['performance', 'alerts', 'metrics'],
};

const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  riskSensitivity: 'medium',
  alertFrequency: 'normal',
};

/**
 * Get widget order based on trader profile
 */
export function getWidgetOrder(profile: TraderProfile | null): string[] {
  if (!profile) {
    return DEFAULT_LAYOUT.widgetOrder;
  }
  return WIDGET_ORDERS[profile.type];
}

/**
 * Get primary widget based on trader profile
 */
export function getPrimaryWidget(profile: TraderProfile | null): string {
  if (!profile) {
    return DEFAULT_LAYOUT.primaryWidget;
  }
  return profile.dashboardLayout.primaryWidget;
}

/**
 * Get alert thresholds based on trader profile
 */
export function getAlertThresholds(profile: TraderProfile | null): AlertThresholds {
  if (!profile) {
    return DEFAULT_ALERT_THRESHOLDS;
  }
  return profile.alertThresholds;
}

/**
 * Get complete dashboard layout configuration
 */
export function getDashboardLayout(profile: TraderProfile | null): DashboardLayout {
  if (!profile) {
    return DEFAULT_LAYOUT;
  }
  return profile.dashboardLayout;
}

/**
 * Check if a specific widget should be highlighted for a profile type
 */
export function isHighlightedWidget(widgetId: string, profile: TraderProfile | null): boolean {
  if (!profile) {
    return widgetId === DEFAULT_LAYOUT.primaryWidget;
  }
  return widgetId === profile.dashboardLayout.primaryWidget;
}

/**
 * Get profile-specific dashboard tips
 */
export function getDashboardTips(profile: TraderProfile | null): string[] {
  if (!profile) {
    return [
      'Complete your Trader DNA assessment to get personalized dashboard recommendations',
      'Your dashboard will adapt based on your trading personality',
    ];
  }

  const tips: Record<ProfileType, string[]> = {
    sniper: [
      'Focus on detailed analysis before making decisions',
      'Patient setups with high conviction are your strength',
    ],
    analyst: [
      'Track your metrics and performance data consistently',
      'Systematic approach to trading will serve you well',
    ],
    warrior: [
      'Use quick action shortcuts to execute faster',
      'Monitor your risk exposure carefully',
    ],
    disciplinarian: [
      'Follow your checklists consistently',
      'Track your rule adherence metrics',
    ],
    opportunist: [
      'Use multiple tools to adapt to different market conditions',
      'Keep your tool palette organized and efficient',
    ],
  };

  return tips[profile.type];
}