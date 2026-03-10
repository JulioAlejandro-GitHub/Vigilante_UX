import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  X,
  History,
  ExternalLink,
  Trash2,
  Edit3,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { RecognitionEvent, UserType } from '../types';
import { PersonaTipo, PersonaTipoLabels } from '../constants/dictionaries';

type ZoomLevel = '24h' | '12h' | '6h' | '1h' | '30min';

const ZOOM_CONFIG: Record<ZoomLevel, { hours: number; pixelsPerHour: number }> = {
  '24h': { hours: 24, pixelsPerHour: 100 },
  '12h': { hours: 12, pixelsPerHour: 200 },
  '6h': { hours: 6, pixelsPerHour: 400 },
  '1h': { hours: 1, pixelsPerHour: 2400 },
  '30min': { hours: 0.5, pixelsPerHour: 4800 },
};

export default function TimelinePage() {
  const { events } = useStore();
  const [zoom, setZoom] = useState<ZoomLevel>('6h');
  const [selectedEvent, setSelectedEvent] = useState<RecognitionEvent | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: UserType[] = [PersonaTipo.SOCIO, PersonaTipo.EMPLEADO, PersonaTipo.FAMILIA, PersonaTipo.OTRO, PersonaTipo.LADRON, 'movimiento'];

  const config = ZOOM_CONFIG[zoom];
  const totalWidth = 24 * config.pixelsPerHour;

  const todayEvents = useMemo(() => {
    return events.filter(e => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      return new Date(e.timestamp) >= startOfDay;
    });
  }, [events]);

  const getPosition = (date: Date) => {
    const d = new Date(date);
    const hours = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    return hours * config.pixelsPerHour;
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const pos = getPosition(new Date());
      scrollContainerRef.current.scrollLeft = pos - scrollContainerRef.current.clientWidth / 2;
    }
  }, [zoom]);

  return (
    <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* Header / Filters */}
      <header className="h-16 border-b border-white/5 bg-[#0A0A0A] flex items-center px-6 gap-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <History className="text-emerald-500 w-5 h-5" />
          <h1 className="font-bold text-white tracking-tight">Timeline Forense</h1>
        </div>

        <div className="h-8 w-px bg-white/5" />

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-lg p-1">
            {(['24h', '12h', '6h', '1h', '30min'] as ZoomLevel[]).map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                  zoom === z ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-white">{new Date().toLocaleDateString()}</span>
          </div>
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              const pos = getPosition(new Date());
              scrollContainerRef.current?.scrollTo({ left: pos - scrollContainerRef.current.clientWidth / 2, behavior: 'smooth' });
            }}
            className="ml-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            AHORA
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Timeline Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative scrollbar-hide select-none"
        >
          {/* Time Grid Labels (Sticky Top) */}
          <div className="sticky top-0 h-10 border-b border-white/5 bg-[#0A0A0A] z-30" style={{ width: totalWidth }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute top-0 flex flex-col items-center"
                style={{ left: i * config.pixelsPerHour }}
              >
                <div className="h-2 w-px bg-white/20 mt-8" />
                <span className="text-[10px] font-mono text-zinc-600 absolute top-2 whitespace-nowrap">
                  {i.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Categories Rows */}
          <div className="relative" style={{ width: totalWidth }}>
            {categories.map((cat, idx) => (
              <div 
                key={cat} 
                className={`h-24 border-b border-white/5 relative group ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
              >
                {/* Vertical Grid Lines */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute top-0 bottom-0 w-px bg-white/[0.03]"
                    style={{ left: i * config.pixelsPerHour }}
                  />
                ))}

                {/* Events in this category */}
                {todayEvents
                  .filter(e => e.userType === cat)
                  .map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1, zIndex: 40 }}
                      onClick={() => setSelectedEvent(event)}
                      className={`absolute top-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                        selectedEvent?.id === event.id ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-black z-40' : ''
                      }`}
                      style={{ left: getPosition(event.timestamp) }}
                    >
                      {cat === 'movimiento' ? (
                        <div className="w-1.5 h-12 bg-amber-500/40 rounded-full blur-[1px]" />
                      ) : (
                        <div className="relative group/item">
                          <img 
                            src={event.thumbnail} 
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white/10 shadow-xl" 
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap z-50 border border-white/10">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            ))}

            {/* Playhead (Current Time) */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-emerald-500 z-10 pointer-events-none shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ left: getPosition(new Date()) }}
            >
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Sticky Left Labels */}
        <div className="absolute left-0 top-10 bottom-0 w-32 bg-[#0A0A0A]/90 backdrop-blur-md border-r border-white/5 z-20">
          {categories.map((cat, idx) => (
            <div 
              key={cat} 
              className={`h-24 flex flex-col justify-center px-4 border-b border-white/5 ${idx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{cat === 'movimiento' ? 'Movimiento' : PersonaTipoLabels[cat as typeof PersonaTipo[keyof typeof PersonaTipo]]}</span>
              <span className="text-[9px] text-zinc-700 mt-1">
                {todayEvents.filter(e => e.userType === cat).length} eventos
              </span>
            </div>
          ))}
        </div>

        {/* Right Detail Panel */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[400px] bg-[#0A0A0A] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-bold text-white">Detalle del Evento</h2>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                    <img 
                      src={selectedEvent.fullImage} 
                      className="w-full h-full object-cover" 
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all">
                        <ExternalLink className="w-3 h-3" />
                        Ver original
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedEvent.name || 'Desconocido'}</h3>
                      <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
                        <Camera className="w-3 h-3" />
                        {selectedEvent.camera}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                        selectedEvent.userType === PersonaTipo.LADRON ? 'bg-red-500/10 text-red-400' :
                        selectedEvent.userType === PersonaTipo.SOCIO ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {selectedEvent.userType === 'movimiento' ? 'Movimiento' : PersonaTipoLabels[selectedEvent.userType as typeof PersonaTipo[keyof typeof PersonaTipo]]}
                      </span>
                      <p className="text-xs font-mono text-zinc-500 mt-2">
                        {(selectedEvent.confidence * 100).toFixed(1)}% confianza
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Fecha</span>
                    <span className="text-sm text-white font-medium">{new Date(selectedEvent.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Hora</span>
                    <span className="text-sm text-white font-medium">
                      {new Date(selectedEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                {selectedEvent.history && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Historial de Avistamientos</h4>
                    <div className="space-y-3">
                      {selectedEvent.history.map((h, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">{h.camera}</p>
                            <p className="text-xs text-zinc-500">{new Date(h.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.gallery && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Galería de Capturas</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedEvent.gallery.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="aspect-square rounded-lg object-cover border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all"
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all">
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
