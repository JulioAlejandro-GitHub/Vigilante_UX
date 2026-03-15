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
import { RecognitionEvent, GroupedEvent, UserType, Persona, PaginatedResponse } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PersonaTipo, PersonaTipoLabels } from '../constants/dictionaries';

// Decisión UX sobre agrupación:
// Se ha refactorizado la vista para priorizar la agrupación por sujetos, reduciendo
// repeticiones visuales y saturación de datos, permitiendo una rápida identificación de las
// personas que transitan y proporcionando un panel lateral para el detalle individual y
// la trazabilidad cuando sea necesario. Se mantiene también una pestaña secundaria
// de eventos individuales para una vista estrictamente cronológica.

export default function EventsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<UserType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  const [selectedEvent, setSelectedEvent] = useState<RecognitionEvent | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<GroupedEvent | null>(null);
  const [page, setPage] = useState(1);
  const [subjectPage, setSubjectPage] = useState(1);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');
  const itemsPerPage = 12;

  const { data: eventsData, isLoading: isLoadingEvents } = useQuery<PaginatedResponse<RecognitionEvent>>({
    queryKey: ['events', page, itemsPerPage, searchTerm, filterType],
    queryFn: () => eventsApi.getAll({
      page,
      limit: itemsPerPage,
      search: searchTerm,
      type: filterType === 'all' ? undefined : filterType,
    }),
    enabled: viewMode === 'list',
  });

  const { data: subjectEventsData, isLoading: isLoadingSubjectEvents } = useQuery<PaginatedResponse<RecognitionEvent>>({
    queryKey: ['events-subject', subjectPage, itemsPerPage, selectedSubject?.persona_id, selectedSubject?.oi_id],
    queryFn: () => eventsApi.getAll({
      page: subjectPage,
      limit: itemsPerPage,
      personaId: selectedSubject?.persona_id,
      oiId: selectedSubject?.oi_id,
    }),
    enabled: selectedSubject !== null,
  });

  const { data: groupedData, isLoading: isLoadingGrouped } = useQuery<PaginatedResponse<GroupedEvent>>({
    queryKey: ['grouped-events', page, itemsPerPage, searchTerm, filterType],
    queryFn: () => eventsApi.getGrouped({
      page,
      limit: itemsPerPage,
      search: searchTerm,
      type: filterType === 'all' ? undefined : filterType
    }),
    enabled: viewMode === 'grouped' && selectedSubject === null,
  });

  const { data: personasData } = useQuery<Persona[]>({
    queryKey: ['personas'],
    queryFn: personasApi.getAll,
    enabled: isEditingSubject
  });

  const subjectEvents = subjectEventsData?.data || [];

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
    if (selectedEvent && window.confirm('¿Estás seguro de que quieres eliminar este evento individual? Esta acción no se puede deshacer.')) {
      deleteMutation.mutate(selectedEvent.id);
    }
  };

  const handleUpdateSubject = () => {
    // If selectedEvent is set, we are editing a single event
    if (selectedEvent && selectedPersonaId) {
      updateSubjectMutation.mutate({
        id: selectedEvent.id,
        data: {
          assigned_persona_id: selectedPersonaId,
          final_label: 'identificado' // Defaulting to identified, but real logic might vary based on the persona
        }
      });
    } else if (selectedSubject && selectedPersonaId) {
      // If selectedSubject is set, we are editing the most recent event of a grouped subject to apply to the latest face
      updateSubjectMutation.mutate({
        id: selectedSubject.id,
        data: {
          assigned_persona_id: selectedPersonaId,
          final_label: 'identificado',
          subject_id: selectedSubject.subject_id
        }
      });
    }
  };

  const isLoading = viewMode === 'grouped' ? isLoadingGrouped : isLoadingEvents;
  const currentEvents = (viewMode === 'grouped' ? groupedData?.data : eventsData?.data) || [];
  const totalPages = (viewMode === 'grouped' ? groupedData?.pagination.totalPages : eventsData?.pagination.totalPages) || 0;
  const totalItems = (viewMode === 'grouped' ? groupedData?.pagination.total : eventsData?.pagination.total) || 0;

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto h-screen flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Eventos de Reconocimiento</h1>
          <p className="text-zinc-500 mt-1">Historial completo de detecciones faciales.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#111111] border border-white/5 rounded-xl p-1">
            <button
              onClick={() => { setViewMode('grouped'); setPage(1); setSubjectPage(1); setSelectedSubject(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'grouped' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Sujetos
            </button>
            <button
              onClick={() => { setViewMode('list'); setPage(1); setSubjectPage(1); setSelectedSubject(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Eventos
            </button>
          </div>
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
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${filterType === type ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
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
          {currentEvents.map((item, i) => {
            const isGrouped = viewMode === 'grouped';
            const event = item as any; // Cast for shared properties

            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                key={isGrouped ? event.subject_id : event.id}
                onClick={() => isGrouped ? setSelectedSubject(event) : setSelectedEvent(event)}
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
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md backdrop-blur-md ${event.userType === PersonaTipo.LADRON ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        event.userType === PersonaTipo.SOCIO ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          event.userType === 'movimiento' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            'bg-black/50 text-white border border-white/10'
                      }`}>
                      {event.userType === 'movimiento' ? 'Movimiento' : (PersonaTipoLabels[event.userType as typeof PersonaTipo[keyof typeof PersonaTipo]] || 'Desconocido')}
                    </span>
                    {event.risk_level && (
                      <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md backdrop-blur-md self-start ${event.risk_level === 'alto' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : event.risk_level === 'medio' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                         Riesgo {event.risk_level}
                      </span>
                    )}
                    {isGrouped && event.eventCount > 1 && (
                      <span className="text-[10px] font-bold text-white bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 rounded-md backdrop-blur-md self-start">
                        {event.eventCount} detecciones
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-sm truncate">{event.name || event.oi_label || 'Desconocido'}</p>
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
            );
          })}
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
        <p className="text-xs text-zinc-500">Mostrando {currentEvents.length} {viewMode === 'grouped' ? 'sujetos' : 'eventos'} (Total: {totalItems})</p>
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

      {/* Detail Drawer for Event */}
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
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${selectedEvent.userType === PersonaTipo.LADRON ? 'bg-red-500/10 text-red-400' :
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

      {/* Detail Drawer for Subject */}
      <AnimatePresence>
        {selectedSubject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#0A0A0A] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-bold text-white">Detalle de Sujeto</h2>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSubject.thumbnailUrl}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/30"
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedSubject.name || selectedSubject.oi_label || 'Desconocido'}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${selectedSubject.userType === PersonaTipo.LADRON ? 'bg-red-500/10 text-red-400' :
                          selectedSubject.userType === PersonaTipo.SOCIO ? 'bg-emerald-500/10 text-emerald-400' :
                            selectedSubject.userType === 'movimiento' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-zinc-500/10 text-zinc-400'
                        }`}>
                        {selectedSubject.userType === 'movimiento' ? 'Movimiento' : PersonaTipoLabels[selectedSubject.userType as typeof PersonaTipo[keyof typeof PersonaTipo]]}
                      </span>
                      <span className="text-xs text-zinc-400">{selectedSubject.eventCount} detecciones</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resumen</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Camera className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Última Cámara</span>
                      </div>
                      <span className="text-sm text-white font-bold">{selectedSubject.camera}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm text-zinc-400">Última Vez</span>
                      </div>
                      <span className="text-sm text-white font-bold">{new Date(selectedSubject.timestamp).toLocaleDateString()} {new Date(selectedSubject.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Acciones de Sujeto</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => setIsEditingSubject(true)}
                        className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar Sujeto
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Historial de Detecciones</h4>
                  </div>

                  {isLoadingSubjectEvents ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subjectEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-4 p-3 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                          <img
                            src={event.thumbnailUrl}
                            className="w-12 h-12 rounded-xl object-cover"
                            alt=""
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white truncate">{event.camera}</span>
                              <span className="text-[10px] font-mono text-emerald-400">{(event.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-zinc-500">
                                {new Date(event.timestamp).toLocaleDateString()} {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSelectedEvent(event);
                              }}
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                              title="Ver detalle"
                            >
                              <Search className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('¿Estás seguro de que quieres eliminar este evento individual? Esta acción no se puede deshacer.')) {
                                  deleteMutation.mutate(event.id);
                                }
                              }}
                              className="flex items-center gap-1 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                              title="Eliminar evento individual"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span className="text-[10px] font-bold">Eliminar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      {subjectEvents.length === 0 && (
                        <p className="text-center text-sm text-zinc-500 py-4">No hay eventos para mostrar.</p>
                      )}

                      {subjectEventsData && subjectEventsData.pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <button
                            disabled={subjectPage === 1}
                            onClick={() => setSubjectPage(p => p - 1)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-zinc-400">Pág {subjectPage} de {subjectEventsData.pagination.totalPages}</span>
                          <button
                            disabled={subjectPage === subjectEventsData.pagination.totalPages}
                            onClick={() => setSubjectPage(p => p + 1)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white disabled:opacity-50 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
