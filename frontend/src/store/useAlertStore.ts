import { create } from 'zustand';

export interface AlertData {
  eventId: number;
  cameraName: string;
  time: string;
  identityLabel: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timesSeen: number;
  thumbnailUrl: string;
}

interface AlertState {
  activeAlerts: AlertData[];
  dismissedAlertIds: Set<number>;
  addAlerts: (alerts: AlertData[]) => void;
  dismissAlert: (eventId: number) => void;
  clearAll: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  activeAlerts: [],
  dismissedAlertIds: new Set(),

  addAlerts: (alerts) => set((state) => {
    const newAlerts = alerts.filter(a => !state.dismissedAlertIds.has(a.eventId));

    // Check if there are actually new alerts to add based on eventId
    const existingIds = new Set(state.activeAlerts.map(a => a.eventId));
    const trulyNew = newAlerts.filter(a => !existingIds.has(a.eventId));

    if (trulyNew.length === 0) return state; // No state change needed

    return {
      activeAlerts: [...trulyNew, ...state.activeAlerts]
    };
  }),

  dismissAlert: (eventId) => set((state) => {
    const newDismissed = new Set(state.dismissedAlertIds);
    newDismissed.add(eventId);

    return {
      activeAlerts: state.activeAlerts.filter(a => a.eventId !== eventId),
      dismissedAlertIds: newDismissed
    };
  }),

  clearAll: () => set({
    activeAlerts: [],
    dismissedAlertIds: new Set()
  })
}));
