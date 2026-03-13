import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Camera, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  X,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  Save,
  Loader2
} from 'lucide-react';
import { eventsApi, personasApi } from '../lib/api';
import { RecognitionEvent, UserType, Persona, PaginatedResponse } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PersonaTipo, PersonaTipoLabels } from '../constants/dictionaries';

// Decisión UX sobre agrupación:
// He optado por mantener un listado individual simple con paginación funcional en el backend.
// Para operaciones de seguridad, ver la secuencia de eventos individuales suele ser más útil
// que ocultarlos tras agrupaciones complejas, que requerirían clicks adicionales para desplegar detalles.
// La UI está diseñada para ser scaneada rápidamente, con imágenes claras y etiquetas de colores.

export default function EventsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<UserType | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<RecognitionEvent | null>(null);
  const [page, setPage] = useState(1);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');
  const itemsPerPage = 12;

  const { data: eventsData, isLoading } = useQuery<PaginatedResponse<RecognitionEvent>>({
    queryKey: ['events', page, itemsPerPage, searchTerm, filterType],
    queryFn: () => eventsApi.getAll({
      page,
      limit: itemsPerPage,
      search: searchTerm,
      type: filterType === 'all' ? undefined : filterType
    }),
  });

  const { data: personasData } = useQuery<Persona[]>({
    queryKey: ['personas'],
    queryFn: personasApi.getAll,
    enabled: isEditingSubject
  });

  const deleteMutation = useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      setSelectedEvent(null);
      // Adjust page if deleting last item
      if (eventsData?.data.length === 1 && page > 1) {
        setPage(p => p - 1);
      } else {
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    }
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: any }) => eventsApi.updateSubject(id, data),
    onSuccess: () => {
      setIsEditingSubject(false);
      setSelectedEvent(null);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  const handleDelete = () => {
    if (selectedEvent && window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      deleteMutation.mutate(selectedEvent.id);
    }
  };

  const handleUpdateSubject = () => {
    if (selectedEvent && selectedPersonaId) {
      updateSubjectMutation.mutate({
        id: selectedEvent.id,
        data: {
          assigned_persona_id: selectedPersonaId,
          final_label: 'identificado' // Defaulting to identified, but real logic might vary based on the persona
        }
      });
    }
  };

  const totalPages = eventsData?.pagination.totalPages || 0;
  const currentEvents = eventsData?.data || [];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto h-screen flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Eventos de Reconocimiento</h1>
          <p className="text-zinc-500 mt-1">Historial completo de detecciones faciales.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o cámara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111111] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
            />
          </div>
          <div className="flex bg-[#111111] border border-white/5 rounded-xl p-1 overflow-x-auto scrollbar-hide">
            {['all', PersonaTipo.SOCIO, PersonaTipo.EMPLEADO, PersonaTipo.FAMILIA, PersonaTipo.OTRO, PersonaTipo.LADRON].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
                  filterType === type ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {type === 'all' ? 'Todos' : PersonaTipoLabels[type as typeof PersonaTipo[keyof typeof PersonaTipo]]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentEvents.map((event, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all"
            >
              <div className="relative aspect-square">
                <img 
                  src={event.thumbnailUrl}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3">
                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md backdrop-blur-md ${
                    event.userType === PersonaTipo.LADRON ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    event.userType === PersonaTipo.SOCIO ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    event.userType === 'movimiento' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-white/10 text-white border border-white/20'
                  }`}>
                    {event.userType === 'movimiento' ? 'Movimiento' : PersonaTipoLabels[event.userType as typeof PersonaTipo[keyof typeof PersonaTipo]]}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm truncate">{event.name || 'Desconocido'}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">{(event.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] text-zinc-500 flex items-center gap-1 uppercase tracking-wider font-bold truncate">
                  <Camera className="w-3 h-3 shrink-0" />
                  <span className="truncate">{event.camera}</span>
                </span>
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : currentEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">No se encontraron eventos</p>
          </div>
        ) : null}
      </div>

      <footer className="flex items-center justify-between pt-4 border-t border-white/5 shrink-0">
        <p className="text-xs text-zinc-500">Mostrando {currentEvents.length} eventos (Total: {eventsData?.pagination.total || 0})</p>
        <div className="flex items-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 bg-[#111111] border border-white/5 rounded-xl text-zinc-500 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-white px-4">Página {page} de {Math.max(1, totalPages)}</span>
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="p-2 bg-[#111111] border border-white/5 rounded-xl text-zinc-500 hover:text-white disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-bold text-white">Detalle de Detección</h2>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                  {selectedEvent.previewUrl && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                      <img
                        src={selectedEvent.previewUrl}
                        className="max-w-full max-h-full object-contain"
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedEvent.thumbnailUrl}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30" 
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedEvent.name || 'Desconocido'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          selectedEvent.userType === PersonaTipo.LADRON ? 'bg-red-500/10 text-red-400' :
                          selectedEvent.userType === PersonaTipo.SOCIO ? 'bg-emerald-500/10 text-emerald-400' :
                          selectedEvent.userType === 'movimiento' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {selectedEvent.userType === 'movimiento' ? 'Movimiento' : PersonaTipoLabels[selectedEvent.userType as typeof PersonaTipo[keyof typeof PersonaTipo]]}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">{(selectedEvent.confidence * 100).toFixed(1)}% confianza</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Información Técnica</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Camera className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Cámara</span>
                      </div>
                      <span className="text-sm text-white font-bold">{selectedEvent.camera}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Fecha</span>
                      </div>
                      <span className="text-sm text-white font-bold">{new Date(selectedEvent.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Hora</span>
                      </div>
                      <span className="text-sm text-white font-bold">{new Date(selectedEvent.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {isEditingSubject ? (
                  <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-bold text-white mb-2">Asignar a Persona</h4>
                    <select
                      value={selectedPersonaId}
                      onChange={(e) => setSelectedPersonaId(e.target.value)}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Selecciona una persona...</option>
                      {personasData?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setIsEditingSubject(false)}
                        className="flex-1 p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleUpdateSubject}
                        disabled={!selectedPersonaId || updateSubjectMutation.isPending}
                        className="flex-1 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 disabled:opacity-50 rounded-xl transition-colors text-sm font-bold flex items-center justify-center gap-2"
                      >
                        {updateSubjectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Acciones Rápidas</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsEditingSubject(true)}
                        className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar Sujeto
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
