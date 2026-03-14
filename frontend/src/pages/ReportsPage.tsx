import React from 'react';
import { useStore } from '../store/useStore';
import {
  FileText,
  Download,
  Filter,
  Users,
  AlertTriangle,
  Camera,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { PersonaTipo } from '../constants/dictionaries';

export default function ReportsPage() {
  const { events, cameras } = useStore();

  const stats = [
    { label: 'Total Reconocimientos', value: events.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Alertas Críticas', value: events.filter(e => e.userType === PersonaTipo.LADRON || e.oi_label === 'ladron').length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Identidades Recurrentes', value: events.filter(e => (e.times_seen || 0) > 1).length, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Cámaras Analizadas', value: cameras.length, icon: Camera, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reportes</h1>
          <p className="text-zinc-500 mt-1">Análisis estadístico y generación de informes.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-all">
            <Filter className="w-4 h-4" />
            Últimos 7 días
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-xl transition-all">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label}
            className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <h3 className="text-zinc-500 text-sm font-medium">{stat.label}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
           <ShieldAlert className="w-6 h-6 text-emerald-500" />
           <h2 className="text-xl font-bold text-white">Reporte Táctico de Seguridad</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-red-400" />
                 Identidades de Alto Riesgo Recientes
               </h3>
               <div className="space-y-3">
                 {events.filter(e => e.userType === PersonaTipo.LADRON || e.oi_label === 'ladron' || e.risk_level === 'critical' || e.risk_level === 'high').slice(0, 5).map(ev => (
                   <div key={`risk-${ev.id}`} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                         {ev.thumbnailUrl && <img src={ev.thumbnailUrl} className="w-8 h-8 rounded-lg object-cover" />}
                         <div>
                            <p className="text-sm font-medium text-white">{ev.name || ev.oi_label || 'Desconocido'}</p>
                            <p className="text-xs text-zinc-500">{new Date(ev.timestamp).toLocaleString()}</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-red-500/10 text-red-400">
                         {ev.userType === PersonaTipo.LADRON || ev.oi_label === 'ladron' ? 'Ladrón' : 'Alto Riesgo'}
                      </span>
                   </div>
                 ))}
                 {events.filter(e => e.userType === PersonaTipo.LADRON || e.oi_label === 'ladron' || e.risk_level === 'critical' || e.risk_level === 'high').length === 0 && (
                   <p className="text-sm text-zinc-500 italic">No hay detecciones de alto riesgo recientes.</p>
                 )}
               </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-amber-400" />
                 Desconocidos Recurrentes
               </h3>
               <div className="space-y-3">
                 {events.filter(e => (!e.name && e.userType !== PersonaTipo.LADRON && e.oi_label !== 'ladron') && (e.times_seen || 0) > 1).slice(0, 5).map(ev => (
                   <div key={`rec-${ev.id}`} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center gap-3">
                         {ev.thumbnailUrl && <img src={ev.thumbnailUrl} className="w-8 h-8 rounded-lg object-cover" />}
                         <div>
                            <p className="text-sm font-medium text-white">Identidad Observada</p>
                            <p className="text-xs text-zinc-500">{ev.camera}</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-400">
                         Visto {ev.times_seen} veces
                      </span>
                   </div>
                 ))}
                 {events.filter(e => (!e.name && e.userType !== PersonaTipo.LADRON && e.oi_label !== 'ladron') && (e.times_seen || 0) > 1).length === 0 && (
                   <p className="text-sm text-zinc-500 italic">No hay desconocidos recurrentes recientes.</p>
                 )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
