import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  User, 
  Trash2, 
  Edit3, 
  RefreshCcw,
  Search,
  Camera,
  AlertCircle
} from 'lucide-react';
import { UserType } from '../types';

export default function SettingsPage() {
  const { events, deleteEvent, updateEventUserType } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Use only editable events for this view
  const editableEvents = events.filter(e => e.userType !== 'movimiento').slice(0, 50);

  const filteredEvents = editableEvents.filter(e =>
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Administración de Eventos</h1>
        <p className="text-zinc-500 mt-1">Gestión de base de datos de reconocimiento y corrección de etiquetas.</p>
      </header>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar evento por ID o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors">
              Exportar Datos
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#111111] z-10 shadow-md">
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="px-6 py-4">Evento / ID</th>
                <th className="px-6 py-4">Sujeto Actual</th>
                <th className="px-6 py-4">Tipo Asignado</th>
                <th className="px-6 py-4">Cámara</th>
                <th className="px-6 py-4">Confianza</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={event.thumbnail} 
                        className="w-10 h-10 rounded-xl object-cover border border-white/10" 
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-mono text-zinc-500">{event.id}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span className="text-sm font-medium text-white">{event.name || 'Sin identificar'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={event.userType}
                      onChange={(e) => updateEventUserType(event.id, e.target.value as UserType)}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="socio">Socio</option>
                      <option value="empleado">Empleado</option>
                      <option value="familia">Familia</option>
                      <option value="desconocido">Desconocido</option>
                      <option value="ladron">Ladrón</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                      <Camera className="w-3 h-3" />
                      {event.camera}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${event.confidence > 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-mono text-zinc-400">{(event.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        title="Reasignar imagen"
                        className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-emerald-400 transition-all"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                      <button 
                        title="Editar detalles"
                        className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        title="Eliminar registro"
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>Los cambios en el tipo de usuario afectarán el historial forense de forma global.</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-zinc-500 text-xs font-bold hover:text-white transition-colors">Anterior</button>
            <button className="px-4 py-2 text-zinc-500 text-xs font-bold hover:text-white transition-colors">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
