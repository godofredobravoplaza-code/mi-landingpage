'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full relative bg-slate-50">
      
      {/* Contenido Principal (Pestañas) */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center absolute bottom-0 inset-x-0 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
        
        <Link href="/app" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/app' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <i className="fa-solid fa-house text-xl"></i>
          <span className="text-[10px] font-bold">Inicio</span>
        </Link>
        
        <Link href="/app/agenda" className={`flex flex-col items-center gap-1 transition-colors ${pathname === '/app/agenda' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <i className="fa-solid fa-calendar-check text-xl"></i>
          <span className="text-[10px] font-bold">Agenda</span>
        </Link>
        
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fa-solid fa-file-lines text-xl"></i>
          <span className="text-[10px] font-bold">Formularios</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fa-solid fa-gear text-xl"></i>
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
        
      </div>
    </div>
  );
}
