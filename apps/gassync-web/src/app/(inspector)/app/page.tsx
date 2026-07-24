'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function InspectorAppHome() {
  const { profile, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header Profile */}
      <div className="bg-navy-950 pt-12 pb-6 px-6 rounded-b-3xl shadow-md z-10 shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-navy-950">
              {profile?.email?.charAt(0).toUpperCase() || 'I'}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">Inspector Activo</p>
              <h2 className="text-white font-bold text-lg truncate w-40">{profile?.name || profile?.email?.split('@')[0]}</h2>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
            <i className="fa-solid fa-bell"></i>
          </button>
        </div>
      </div>

      {/* Main Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        
        {/* Status Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <i className="fa-solid fa-check text-2xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Listo para operar</h3>
            <p className="text-sm text-slate-500">GPS Activo • Conexión OK</p>
          </div>
        </div>

        {/* Next Visit Card */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-slate-800">Siguiente Asignación</h3>
            <span className="text-xs font-bold text-blue-600">En 45 min</span>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 px-5 py-3 flex justify-between items-center">
              <span className="text-white font-bold text-sm">Inspección Periódica</span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-bold">URGENTE</span>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-slate-800 text-lg mb-1">Condominio Las Rosas</h4>
              <p className="text-slate-500 text-sm mb-4"><i className="fa-solid fa-location-dot mr-2 text-slate-400"></i>Av. Providencia 1234, Santiago</p>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-navy-950 text-white py-3 rounded-xl font-bold shadow hover:bg-navy-900 transition-colors">
                  Iniciar Ruta
                </button>
                <button className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <i className="fa-solid fa-map"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-bold text-slate-800 mb-3">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-orange-300 transition-colors active:scale-95">
              <i className="fa-solid fa-file-signature text-2xl text-orange-500"></i>
              <span className="text-xs font-bold text-slate-700">Nuevo Formulario</span>
            </button>
            <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-orange-300 transition-colors active:scale-95">
              <i className="fa-solid fa-camera text-2xl text-blue-500"></i>
              <span className="text-xs font-bold text-slate-700">Subir Evidencia</span>
            </button>
          </div>
        </div>

        {/* Cierre de Sesión (Temporal para demos) */}
        <div className="pt-4">
          <button 
            onClick={logout}
            className="w-full bg-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="h-24"></div> {/* Spacer for bottom bar */}
      </div>

    </div>
  );
}
