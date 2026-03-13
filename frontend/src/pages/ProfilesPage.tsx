import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { personasApi } from '../lib/api';
import {
  Search,
  UserCircle,
  MoreHorizontal,
  Clock,
  Camera,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { Persona } from '../types';
import { PersonaTipo, PersonaTipoLabels } from '../constants/dictionaries';

export default function ProfilesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: personasData = [], isLoading } = useQuery<Persona[]>({
    queryKey: ['personas'],
    queryFn: personasApi.getAll
  });

  const profiles = personasData.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Perfiles y Personas</h1>
          <p className="text-zinc-500 mt-1">Directorio de identidades conocidas y recurrentes.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar persona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#111111] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {profiles.map((profile, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={profile.id}
            onClick={() => navigate(`/timeline?personaId=${profile.id}`)}
            className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors flex items-center gap-4 group cursor-pointer"
          >
            <div className="relative w-20 h-20 rounded-full bg-zinc-800 overflow-hidden border-2 border-white/10 shrink-0 flex items-center justify-center">
              {profile.thumbnailUrl ? (
                <img
                  src={profile.thumbnailUrl}
                  className="w-full h-full object-cover"
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserCircle className="w-8 h-8 text-zinc-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-white truncate">{profile.name}</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shrink-0 ${
                  profile.userType === PersonaTipo.LADRON ? 'bg-red-500/10 text-red-400' :
                  profile.userType === PersonaTipo.SOCIO ? 'bg-emerald-500/10 text-emerald-400' :
                  profile.userType === 'movimiento' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-zinc-500/10 text-zinc-400'
                }`}>
                  {profile.userType === 'movimiento' ? 'Movimiento' : PersonaTipoLabels[profile.userType as typeof PersonaTipo[keyof typeof PersonaTipo]]}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-zinc-500" />
                  Apariciones: {profile.eventCount || 0}
                </p>
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  Último: {profile.lastSeen ? new Date(profile.lastSeen).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <Camera className="w-3 h-3 text-zinc-500" />
                  {profile.lastCamera || 'N/A'}
                </p>
              </div>
            </div>

            <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
        {profiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            <UserCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            No se encontraron personas
          </div>
        )}
      </div>
    </div>
  );
}
