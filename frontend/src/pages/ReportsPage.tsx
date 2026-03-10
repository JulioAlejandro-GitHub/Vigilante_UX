import React from 'react';
import { useStore } from '../store/useStore';
import {
  FileText,
  Download,
  Filter,
  Users,
  AlertTriangle,
  Camera,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ReportsPage() {
  const { events, cameras } = useStore();

  const stats = [
    { label: 'Total Reconocimientos', value: events.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Alertas Críticas', value: events.filter(e => e.userType === 'ladron').length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Cámaras Analizadas', value: cameras.length, icon: Camera, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Eventos de Movimiento', value: events.filter(e => e.userType === 'movimiento').length, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-400/10' },
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

      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Área de Gráficos (Placeholder)</h3>
          <p className="text-zinc-500">Aquí se integrarán gráficos con librerías como Recharts o Chart.js</p>
        </div>
      </div>
    </div>
  );
}
