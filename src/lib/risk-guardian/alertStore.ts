import { create } from 'zustand';
import { Alert } from '@/types/guardian';

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  reconnecting: boolean;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  setReconnecting: (value: boolean) => void;
  clearAlerts: () => void;
  setAlerts: (alerts: Alert[]) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,
  reconnecting: false,

  addAlert: (alert: Alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadCount: state.unreadCount + 1
    })),

  acknowledgeAlert: (id: string) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, acknowledged: true } : a
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    })),

  dismissAlert: (id: string) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
      unreadCount: Math.max(0, state.unreadCount - 1)
    })),

  setReconnecting: (value: boolean) =>
    set({ reconnecting: value }),

  clearAlerts: () =>
    set({ alerts: [], unreadCount: 0 }),

  setAlerts: (alerts: Alert[]) =>
    set({ 
      alerts, 
      unreadCount: alerts.filter(a => !a.acknowledged).length 
    })
}));