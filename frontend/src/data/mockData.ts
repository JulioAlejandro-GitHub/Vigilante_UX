import { RecognitionEvent, CameraStats } from '../types';
import { PersonaTipo } from '../constants/dictionaries';

const cameras = [
  'Acceso principal',
  'Recepción',
  'Estacionamiento',
  'Bodega',
  'Pasillo norte'
];

const userTypes: (typeof PersonaTipo[keyof typeof PersonaTipo])[] = [
  PersonaTipo.SOCIO,
  PersonaTipo.EMPLEADO,
  PersonaTipo.FAMILIA,
  PersonaTipo.OTRO,
  PersonaTipo.LADRON
];

const names = {
  [PersonaTipo.SOCIO]: ['Carlos Ruiz', 'Elena Gómez', 'Marco Polo', 'Ana Silva'],
  [PersonaTipo.EMPLEADO]: ['Juan Pérez', 'Marta López', 'Roberto Díaz', 'Sofía Torres'],
  [PersonaTipo.FAMILIA]: ['Hijo 1', 'Esposa', 'Abuelo'],
  [PersonaTipo.OTRO]: ['Sujeto A', 'Sujeto B', 'Sujeto C'],
  [PersonaTipo.LADRON]: ['Sospechoso 01', 'Sospechoso 02']
};

export const mockCameras: CameraStats[] = cameras.map((name, i) => ({
  id: `cam-${i}`,
  name,
  status: i === 3 ? 'inactive' : 'active',
  lastActivity: new Date()
}));

const generateEvents = (): RecognitionEvent[] => {
  const events: RecognitionEvent[] = [];
  const now = new Date();
  
  // Generate events for the last 24 hours
  for (let i = 0; i < 150; i++) {
    const type = userTypes[Math.floor(Math.random() * userTypes.length)];
    const camera = cameras[Math.floor(Math.random() * cameras.length)];
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    const confidence = 0.7 + Math.random() * 0.29;
    
    events.push({
      id: `evt-${i}`,
      timestamp,
      camera,
      userType: type,
      name: names[type][Math.floor(Math.random() * names[type].length)],
      confidence,
      thumbnailUrl: `https://picsum.photos/seed/face-${i}/100/100`,
      previewUrl: `https://picsum.photos/seed/face-${i}/100/100`,
      cropUrl: `https://picsum.photos/seed/face-${i}/100/100`,
      frameImageUrl: `https://picsum.photos/seed/scene-${i}/800/600`,
      gallery: [
        `https://picsum.photos/seed/g1-${i}/200/200`,
        `https://picsum.photos/seed/g2-${i}/200/200`,
        `https://picsum.photos/seed/g3-${i}/200/200`
      ],
      history: [
        { timestamp: new Date(timestamp.getTime() - 3600000), camera: cameras[0] },
        { timestamp: new Date(timestamp.getTime() - 7200000), camera: cameras[1] }
      ]
    });
  }
  
  // Add some movement blocks
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    events.push({
      id: `mov-${i}`,
      timestamp,
      camera: cameras[Math.floor(Math.random() * cameras.length)],
      userType: 'movimiento',
      confidence: 1,
      thumbnailUrl: '',
      frameImageUrl: ''
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockEvents = generateEvents();
