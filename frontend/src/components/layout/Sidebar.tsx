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
  UserCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Sidebar() {
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

      <div className="p-4 border-t border-white/5">
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
