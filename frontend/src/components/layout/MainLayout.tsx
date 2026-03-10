import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
