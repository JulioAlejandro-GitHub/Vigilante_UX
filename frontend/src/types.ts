export type UserType = 'socio' | 'empleado' | 'familia' | 'desconocido' | 'ladron' | 'movimiento';

export interface RecognitionEvent {
  id: string;
  timestamp: Date;
  camera: string;
  userType: UserType;
  name?: string;
  confidence: number;
  thumbnail: string;
  fullImage: string;
  gallery?: string[];
  history?: { timestamp: Date; camera: string }[];
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
  unknowns48h: number;
  thieves48h: number;
}
