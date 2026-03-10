import React, { useState } from 'react';
import { Camera, Search, Filter, Activity, AlertTriangle, PlayCircle, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';

export default function CamerasPage() {
  const { cameras } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || camera.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cámaras</h1>
          <p className="text-zinc-500 mt-1">Gestión y visualización de la red de cámaras.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar cámara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111111] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
            />
          </div>
          <div className="flex bg-[#111111] border border-white/5 rounded-xl p-1">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'active', label: 'Activas' },
              { id: 'inactive', label: 'Inactivas' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                  filter === f.id ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCameras.map((camera, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={camera.id}
            className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col"
          >
            <div className="relative aspect-video bg-black/50 border-b border-white/5">
              {/* Mock Video Feed Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                {camera.status === 'active' ? (
                  <Activity className="w-8 h-8 text-emerald-500/50" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-500/50" />
                )}
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-md backdrop-blur-md ${
                  camera.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${camera.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {camera.status === 'active' ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-white font-bold">{camera.name}</h3>
                </div>
                <p className="text-xs text-zinc-500">
                  Última actividad: {new Date(camera.lastActivity).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors">
                  <PlayCircle className="w-4 h-4" />
                  Ver En Vivo
                </button>
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
