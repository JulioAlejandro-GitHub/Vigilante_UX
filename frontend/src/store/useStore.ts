import { create } from 'zustand';
import { mockCameras, mockEvents } from '../data/mockData';
import { RecognitionEvent, CameraStats, UserType } from '../types';

interface AppState {
  cameras: CameraStats[];
  events: RecognitionEvent[];
  addEvent: (event: RecognitionEvent) => void;
  updateEventUserType: (id: string, newType: UserType) => void;
  deleteEvent: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  cameras: mockCameras,
  events: mockEvents,
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  updateEventUserType: (id, newType) => set((state) => ({
    events: state.events.map((e) => (e.id === id ? { ...e, userType: newType } : e)),
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id),
  })),
}));
