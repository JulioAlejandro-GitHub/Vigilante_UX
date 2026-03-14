import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { X, ShieldAlert, AlertTriangle, Activity, Camera, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlertStore, AlertData } from '../../store/useAlertStore';
import { dashboardApi } from '../../lib/api';

export default function GlobalAlertDialog() {
  const navigate = useNavigate();
  const { activeAlerts, addAlerts, dismissAlert } = useAlertStore();

  // Poll for active alerts
  const { data: newAlerts } = useQuery({
    queryKey: ['global-active-alerts'],
    queryFn: dashboardApi.getActiveAlerts,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (newAlerts && newAlerts.length > 0) {
      addAlerts(newAlerts);
    }
  }, [newAlerts, addAlerts]);


  const handleOpenTimeline = (alert: AlertData) => {
    dismissAlert(alert.eventId);
    navigate(`/timeline?eventId=${alert.eventId}&timestamp=${new Date(alert.time).getTime()}`);
  };

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-4 w-[400px] pointer-events-none">
      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <motion.div
            key={`global-alert-${alert.eventId}`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="pointer-events-auto bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b border-white/5 ${
              alert.priority === 'critical' ? 'bg-red-500/10 text-red-400' :
              alert.priority === 'high' ? 'bg-amber-500/10 text-amber-400' :
              'bg-emerald-500/10 text-emerald-400'
            }`}>
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                {alert.priority === 'critical' ? <ShieldAlert className="w-4 h-4" /> :
                 alert.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> :
                 <Activity className="w-4 h-4" />}
                ALERTA {alert.priority}
              </div>
              <button
                onClick={() => dismissAlert(alert.eventId)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex gap-4 items-start">
              {alert.thumbnailUrl ? (
                <img
                  src={alert.thumbnailUrl}
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-zinc-500" />
                </div>
              )}

              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-white text-base leading-tight">
                  {alert.identityLabel.toUpperCase()} DETECTADO
                </h3>
                <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{alert.cameraName}</span>
                </div>
                <div className="text-zinc-500 text-xs mt-1 space-y-0.5">
                  <p>{new Date(alert.time).toLocaleTimeString()}</p>
                  {alert.timesSeen > 1 && (
                    <p className="font-medium text-amber-500/80">Visto {alert.timesSeen} veces</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
              <button
                onClick={() => handleOpenTimeline(alert)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Ver en Timeline
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
