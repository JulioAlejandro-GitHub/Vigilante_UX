import React from 'react';
import { 
  Camera, 
  Activity, 
  AlertTriangle, 
  UserX, 
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../lib/api';
import { RecognitionFaceFinalLabel, RecognitionFaceFinalLabelLabels } from '../constants/dictionaries';

export default function DashboardPage() {
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 5000, // Poll every 5s
  });

  const { data: recentEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: () => dashboardApi.getRecentEvents(8),
    refetchInterval: 5000,
  });

  const { data: criticalAlerts = [], isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: dashboardApi.getCriticalAlerts,
    refetchInterval: 5000,
  });

  const stats = [
    { label: 'Cámaras Totales', value: statsData?.totalCameras || 0, icon: Camera, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Activas', value: statsData?.activeCameras || 0, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Inactivas', value: statsData?.inactiveCameras || 0, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Reconocimientos (48h)', value: statsData?.recognitions48h || 0, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Desconocidos (48h)', value: statsData?.unknowns48h || 0, icon: UserX, color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
    { label: 'Ladrones (48h)', value: statsData?.thieves48h || 0, icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
        <p className="text-zinc-500 mt-1">Resumen operativo de seguridad en tiempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={stat.label}
            className="bg-[#111111] border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Live</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{stat.label}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
            <button className="text-emerald-400 text-sm font-medium hover:underline">Ver todo</button>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                    <th className="px-6 py-4">Sujeto</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Cámara</th>
                    <th className="px-6 py-4">Hora</th>
                    <th className="px-6 py-4">Confianza</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoadingEvents ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Cargando actividad...
                      </td>
                    </tr>
                  ) : recentEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                        No hay actividad reciente
                      </td>
                    </tr>
                  ) : recentEvents.map((event: any) => (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {event.thumbnailUrl ? (
                            <img
                              src={event.thumbnailUrl}
                              className="w-8 h-8 rounded-lg object-cover border border-white/10"
                              alt=""
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/5 flex items-center justify-center">
                              <Activity className="w-4 h-4 text-zinc-500" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-white">{event.name || 'Desconocido'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                          event.userType === RecognitionFaceFinalLabel.LADRON ? 'bg-red-500/10 text-red-400' :
                          event.userType === RecognitionFaceFinalLabel.IDENTIFICADO ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {RecognitionFaceFinalLabelLabels[event.userType as typeof RecognitionFaceFinalLabel[keyof typeof RecognitionFaceFinalLabel]] || 'Otro'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{event.camera}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden w-16">
                            <div 
                              className="h-full bg-emerald-500" 
                              style={{ width: `${(event.confidence || 0) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-zinc-500">{((event.confidence || 0) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Alertas Críticas</h2>
          <div className="space-y-3">
            {isLoadingAlerts ? (
              <div className="text-center py-8 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Cargando alertas...
              </div>
            ) : criticalAlerts.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No hay alertas críticas
              </div>
            ) : criticalAlerts.map((alert: any) => (
              <div key={alert.id} className="bg-[#111111] border border-white/5 p-4 rounded-2xl flex gap-4 items-start">
                <div className={`p-2 rounded-lg shrink-0 ${
                  alert.type === 'critical' ? 'bg-red-500/10 text-red-400' :
                  alert.type === 'error' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {alert.type === 'critical' ? <ShieldAlert className="w-5 h-5" /> :
                   alert.type === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                   <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
