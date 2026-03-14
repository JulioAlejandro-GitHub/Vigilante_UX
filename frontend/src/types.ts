import { PersonaTipo } from './constants/dictionaries';

export type UserType = typeof PersonaTipo[keyof typeof PersonaTipo] | 'movimiento';

export interface RecognitionEvent {
  id: string;
  timestamp: Date;
  camera: string;
  userType: UserType;
  name?: string;
  persona_tipo?: UserType;
  oi_label?: string;
  risk_level?: string;
  times_seen?: number;
  confidence: number;
  thumbnailUrl: string;
  previewUrl?: string;
  cropUrl?: string;
  gallery?: string[];
  history?: { timestamp: Date; camera: string }[];
}

export interface GroupedEvent {
  subject_id: string;
  timestamp: Date;
  eventCount: number;
  id: string;
  camera: string;
  userType: UserType;
  confidence: number;
  thumbnailUrl: string;
  name?: string;
  persona_tipo?: UserType;
  oi_label?: string;
  persona_id?: number;
  oi_id?: number;
}

export interface CameraStats {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastActivity: Date;
}

export interface DashboardStats {
  totalCameras: number;
  activeCameras: number;
  inactiveCameras: number;
  recognitions48h: number;
  totalObserved?: number;
  unknownsActive?: number;
  thievesActive?: number;
  suspectsActive?: number;
  recurringIdentities?: number;
}

export interface Persona {
  id: number;
  name: string;
  userType: UserType;
  thumbnailUrl: string | null;
  eventCount?: number;
  lastSeen?: Date | string;
  lastCamera?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
