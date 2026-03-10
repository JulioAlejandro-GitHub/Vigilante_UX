# Vigilante

Vigilante es un frontend profesional y usable para sistemas de videovigilancia, diseñado con foco en monitoreo, eventos de reconocimiento, investigación forense, timeline visual y operación diaria.

## Stack
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- Lucide React
- Framer Motion

## Requisitos Previos
- Node.js (v18+)
- npm

## Instalación y Ejecución Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre tu navegador en la URL que indique la consola (por defecto `http://localhost:3000`).

## Características
- **Dashboard:** Tarjetas y bloques visuales para cámaras activas/offline, reconocimientos recientes, alertas y actividad.
- **Cámaras:** Grilla de cámaras con estado online/offline e información.
- **Eventos:** Listado visual de eventos con imagen de rostro, fecha, hora, cámara, tipo de usuario y nivel de confianza.
- **Timeline Forense:** Vista crítica para la investigación forense con lectura clara del tiempo, zoom por rango temporal, scroll fluido y capacidades de filtrado.
- **Perfiles:** Directorio de identidades conocidas y recurrentes.
- **Reportes:** Tarjetas de resumen para análisis estadístico.
- **Configuración:** Administración de eventos y corrección de etiquetas de usuario, conectados globalmente a la aplicación.
