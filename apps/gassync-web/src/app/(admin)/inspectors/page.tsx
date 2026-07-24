'use client';

import React, { useState } from 'react';
import Topbar from '@/components/admin/Topbar';

// ----------------------------------------------------------------------
// PÁGINA: Dispatch de Inspectores
// ----------------------------------------------------------------------

export default function InspectorsPage() {
  const [activeInspector, setActiveInspector] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState('vertical'); 

  // Datos simulados vaciados
  const inspectors: any[] = [];

  return (
    <>
      <Topbar 
        title="Control de Inspectores en Terreno" 
        subtitle="GPS, estado de rutas y reasignación de emergencias (Dispatch)." 
        actionButtonLabel="Modo Emergencia" 
        actionButtonIcon="fa-solid fa-triangle-exclamation" 
      />

      <div className="flex-1 overflow-hidden p-8 z-10 flex gap-8 h-full">
        
        {/* PANEL IZQUIERDO: Lista de Inspectores */}
        <div className="w-1/3 glass-card rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden bg-slate-800/30 backdrop-blur-md">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
            <h2 className="text-lg font-bold text-white mb-4">Equipo Activo</h2>
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input type="text" placeholder="Buscar inspector..." className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all outline-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {inspectors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-6">
                <i className="fa-solid fa-hard-hat text-4xl mb-4 opacity-50"></i>
                <p>No hay inspectores activos en ruta.</p>
                <p className="text-xs mt-2">Agrega personal desde "Mi Equipo".</p>
              </div>
            ) : (
              inspectors.map((inspector) => (
                <div key={inspector.id}>
                  {/* ... render de inspectores cuando existan ... */}
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Agenda View */}
        <div className="w-2/3 glass-card rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden bg-slate-800/30 backdrop-blur-md h-full items-center justify-center">
          <div className="text-center text-slate-500 p-8">
            <i className="fa-solid fa-map-location-dot text-6xl mb-6 opacity-30"></i>
            <h3 className="text-xl font-bold text-white mb-2">Panel de Despacho (Dispatch)</h3>
            <p className="max-w-md mx-auto">Selecciona un inspector de la lista para ver su ruta, progreso actual y ubicación GPS en tiempo real.</p>
          </div>
        </div>
      </div>
    </>
  );
}
