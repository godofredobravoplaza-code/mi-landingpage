'use client';

import React from 'react';

export default function InspectorForms() {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Header */}
      <div className="bg-navy-950 pt-12 pb-6 px-6 shadow-md z-10 shrink-0">
        <h2 className="text-white font-bold text-2xl tracking-tight">Formularios</h2>
        <p className="text-slate-400 text-sm mt-1">Registros de terreno y certificaciones</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
        
        {/* Catálogo de Formularios */}
        <div>
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Nuevo Formulario</h3>
          
          <div className="space-y-4">
            
            {/* Form TC5 */}
            <button className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-orange-500 transition-all active:scale-95 group text-left">
              <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <i className="fa-solid fa-fire text-2xl"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg">Declaración TC5</h4>
                <p className="text-sm text-slate-500">Instalaciones interiores de gas</p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300"></i>
            </button>

            {/* Form TC6 */}
            <button className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-blue-500 transition-all active:scale-95 group text-left">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-clipboard-check text-2xl"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg">Declaración TC6</h4>
                <p className="text-sm text-slate-500">Centrales térmicas y de GLP</p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300"></i>
            </button>

            {/* Sello Verde */}
            <button className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-emerald-500 transition-all active:scale-95 group text-left">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <i className="fa-solid fa-certificate text-2xl"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg">Sello Verde</h4>
                <p className="text-sm text-slate-500">Certificación periódica</p>
              </div>
              <i className="fa-solid fa-chevron-right text-slate-300"></i>
            </button>

          </div>
        </div>

        {/* Historial Reciente */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Borradores Recientes</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800">Ver todos</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Draft Item */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <i className="fa-regular fa-file-lines text-slate-400 text-xl"></i>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Condominio Las Rosas</h4>
                  <p className="text-xs text-slate-500">TC5 • Modificado 10:45 AM</p>
                </div>
              </div>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">BORRADOR</span>
            </div>

            {/* Syncing Item */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-cloud-arrow-up text-blue-400 text-xl"></i>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Restaurant Bella Italia</h4>
                  <p className="text-xs text-slate-500">Sello Verde • Hoy</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded animate-pulse">SINC...</span>
            </div>

          </div>
        </div>

        <div className="h-24"></div> {/* Spacer for bottom bar */}
      </div>
      
    </div>
  );
}
