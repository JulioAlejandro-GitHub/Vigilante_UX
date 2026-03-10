import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Camera,
  FileText,
  UserCircle,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/cameras', label: 'Cámaras', icon: Camera },
    { path: '/events', label: 'Eventos', icon: Users },
    { path: '/timeline', label: 'Timeline Forense', icon: History },
    { path: '/profiles', label: 'Personas', icon: UserCircle },
    { path: '/reports', label: 'Reportes', icon: FileText },
    { path: '/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col relative z-50"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Shield className="text-black w-5 h-5" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-xl tracking-tight text-white"
          >
            Vigilante
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-white/10 text-white' 
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
            }`}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        {!isCollapsed && user && (
          <div className="px-3 py-2 mb-2 bg-white/[0.02] rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <span className="text-emerald-500 text-xs font-bold">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Cerrar Sesión</span>}
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-zinc-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
}
