'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="glass-header sticky top-0 z-50 h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <i className="fa-solid fa-building-user text-white"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Portal Cliente</h1>
          <p className="text-xs text-slate-500 font-medium">Condominio Jardines del Sur</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-6">
          <Link href="/portal" className={`font-bold pb-1 transition-colors ${pathname === '/portal' ? 'text-sky-600 border-b-2 border-sky-500' : 'text-slate-500 hover:text-slate-800'}`}>
            Resumen
          </Link>
          <Link href="/portal/cotizacion" className={`font-medium pb-1 transition-colors ${isActive('/portal/cotizacion') ? 'text-sky-600 border-b-2 border-sky-500 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>
            Mis Cotizaciones
          </Link>
          <Link href="/portal/reinspeccion" className={`font-medium pb-1 transition-colors ${isActive('/portal/reinspeccion') ? 'text-sky-600 border-b-2 border-sky-500 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>
            Re-inspecciones
          </Link>
          <Link href="/portal/soporte" className={`font-medium pb-1 transition-colors ${isActive('/portal/soporte') ? 'text-sky-600 border-b-2 border-sky-500 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>
            Soporte
          </Link>
        </nav>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
            JP
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-bold text-slate-800">Juan Pérez</p>
            <p className="text-xs text-slate-500 hover:text-red-500 transition-colors">Cerrar Sesión</p>
          </div>
        </div>
      </div>
    </header>
  );
}
