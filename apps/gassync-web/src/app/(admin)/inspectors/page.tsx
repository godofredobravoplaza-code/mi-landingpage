'use client';

import React, { useState } from 'react';
import Topbar from '@/components/admin/Topbar';

// ----------------------------------------------------------------------
// PÁGINA: Dispatch de Inspectores
// ----------------------------------------------------------------------
// Vista dual: panel izquierdo con inspectores en terreno, panel 
// derecho con la línea de tiempo (agenda/ruta) del inspector seleccionado.
// ----------------------------------------------------------------------

export default function InspectorsPage() {
  const [activeInspector, setActiveInspector] = useState(1);
  const [viewMode, setViewMode] = useState('vertical'); // 'vertical' o 'calendar'

  // Datos simulados (Mock)
  const inspectors = [
    { id: 1, name: 'Roberto Sánchez', role: 'Licencia SEC - Clase 2', img: '11', status: 'en ruta', location: 'Hosp. San José', stops: '3/5', online: true },
    { id: 2, name: 'Carlos Medina', role: 'Licencia SEC - Clase 1', img: '33', status: 'offline', location: 'Hace 45 min en subterráneo', stops: '1/2', online: false },
    { id: 3, name: 'Andrea López', role: 'Licencia SEC - Clase 3', img: '47', status: 'terminado', location: 'Turno Fin.', stops: '', online: true },
  ];

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
            
            {inspectors.map((inspector) => {
              const isActive = activeInspector === inspector.id;
              
              // Mapeo seguro Tailwind JIT
              let containerClass = "bg-navy-950 border border-slate-800";
              let badgeClass = "bg-slate-800 text-slate-400 border-slate-700";
              let dotClass = "";
              
              if (isActive && inspector.status === 'en ruta') {
                containerClass = "bg-blue-500/10 border-blue-500/30";
                badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                dotClass = "w-1.5 h-1.5 rounded-full bg-emerald-500";
              } else if (inspector.status === 'offline') {
                badgeClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
              }

              return (
                <div 
                  key={inspector.id} 
                  onClick={() => setActiveInspector(inspector.id)}
                  className={`${containerClass} rounded-xl p-4 cursor-pointer relative overflow-hidden group hover:border-slate-600 transition-colors ${inspector.status === 'terminado' ? 'opacity-60' : ''}`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?img=${inspector.img}`} alt={inspector.name} className={`w-full h-full object-cover ${!inspector.online ? 'grayscale' : ''}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300'}`}>{inspector.name}</h3>
                        <p className={`text-xs font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{inspector.role}</p>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                      {inspector.status === 'offline' && <i className="fa-solid fa-wifi-slash"></i>}
                      {dotClass && <span className={dotClass}></span>}
                      {inspector.status}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex justify-between text-xs text-slate-400">
                    <span>
                      <i className={`mr-1 text-slate-500 ${inspector.status === 'offline' ? 'fa-solid fa-stopwatch' : 'fa-solid fa-location-arrow'}`}></i> 
                      {inspector.location}
                    </span>
                    {inspector.stops && <span>{inspector.stops} Paradas</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL DERECHO: Agenda View */}
        <div className="w-2/3 glass-card rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden bg-slate-800/30 backdrop-blur-md h-full">
          
          {/* Toolbar Agenda */}
          <div className="h-16 px-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-bold">Ruta Actual: {inspectors.find(i => i.id === activeInspector)?.name}</h2>
              <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">Martes, 12 Octubre</span>
            </div>
            
            <div className="flex bg-navy-900 rounded-lg p-1 border border-slate-700">
              <button 
                onClick={() => setViewMode('vertical')} 
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'vertical' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Ruta Vertical
              </button>
              <button 
                onClick={() => setViewMode('calendar')} 
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === 'calendar' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Calendario
              </button>
            </div>
          </div>

          {/* Contenido Agenda (Timeline Vertical) */}
          {viewMode === 'vertical' && (
            <div className="flex-1 overflow-y-auto p-8 bg-navy-950/30 relative">
              <div className="relative max-w-2xl mx-auto">
                
                {/* Línea central */}
                <div className="absolute left-[39px] top-4 bottom-10 w-0.5 bg-slate-800"></div>

                {/* Parada 1 (Completada) */}
                <div className="relative flex gap-6 mb-8 opacity-75">
                  <div className="flex flex-col items-center">
                    <div className="w-20 text-right shrink-0">
                      <p className="text-sm font-bold text-slate-400">09:00</p>
                      <p className="text-xs text-slate-500">Check-in</p>
                    </div>
                  </div>
                  <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                  <div className="flex-1 bg-navy-900 border border-slate-800 rounded-xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Inspección Residencial</span>
                    <h4 className="text-white font-bold">Condominio Las Rosas</h4>
                    <p className="text-xs text-slate-400 mt-1"><i className="fa-solid fa-location-dot mr-1"></i> Av. Grecia 1000, Ñuñoa</p>
                    <div className="mt-3 flex gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs">
                        <i className="fa-solid fa-file-signature text-emerald-500 mr-1"></i> Firma digital OK
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parada 2 (En Progreso) */}
                <div className="relative flex gap-6 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-20 text-right shrink-0">
                      <p className="text-sm font-bold text-blue-400">11:30</p>
                      <p className="text-xs text-blue-500/70 font-medium animate-pulse">En curso...</p>
                    </div>
                  </div>
                  <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-blue-900 border-2 border-blue-500 flex items-center justify-center text-blue-400">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping absolute"></div>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full relative"></div>
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-blue-900/40 to-transparent border border-blue-500/30 rounded-xl p-4 shadow-lg shadow-blue-500/5 cursor-pointer hover:border-blue-500/50 transition-colors">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 block">Inspección Público</span>
                    <h4 className="text-white font-bold text-lg">Hospital San José</h4>
                    <p className="text-xs text-slate-400 mt-1"><i className="fa-solid fa-location-dot mr-1"></i> Independencia 1100</p>
                    
                    {/* Detalles Activos */}
                    <div className="mt-4 p-3 bg-navy-950 rounded-lg border border-slate-800 text-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400"><i className="fa-solid fa-list-check mr-1 text-slate-500"></i> Progreso de Artefactos</span>
                        <span className="text-blue-400 font-bold">50%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500">Última sincro hace 5 mins (Fotos subidas: 12)</p>
                    </div>
                  </div>
                </div>

                {/* Parada 3 (Pendiente) */}
                <div className="relative flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 text-right shrink-0">
                      <p className="text-sm font-bold text-slate-500">15:00</p>
                      <p className="text-xs text-slate-500">Programado</p>
                    </div>
                  </div>
                  <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-navy-900 border-2 border-slate-600 flex items-center justify-center text-slate-600">
                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-navy-900/50 border border-slate-800/50 rounded-xl p-4 opacity-70">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Inspección Industrial</span>
                    <h4 className="text-white font-bold">Cerámicas BioBío S.A.</h4>
                    <p className="text-xs text-slate-500 mt-1"><i className="fa-solid fa-location-dot mr-1"></i> Parque Industrial, Lote 4</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Contenido Agenda (Calendario Diario Multi-Inspector React-Friendly) */}
          {viewMode === 'calendar' && (
            <div className="flex-1 overflow-y-auto overflow-x-auto bg-navy-950/30 p-6">
              <div className="min-w-[800px]">
                {/* Grilla CSS: 1 Columna para Tiempo + 3 Columnas para Inspectores. 11 Filas (1 Cabecera + 10 Horas) */}
                <div className="grid grid-cols-[60px_1fr_1fr_1fr] grid-rows-[40px_repeat(10,_80px)] gap-2 relative">
                  
                  {/* 1. Cabeceras (Fila 1) */}
                  <div className="col-start-1 row-start-1"></div> {/* Vacio arriba a la izq */}
                  
                  {/* Inspector 1 Header */}
                  <div className="col-start-2 row-start-1 flex items-center justify-center gap-2 bg-slate-800/50 rounded-t-lg border-b border-blue-500">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Roberto" className="w-6 h-6 rounded-full" />
                    <span className="font-bold text-sm text-white">Roberto (En Ruta)</span>
                  </div>
                  {/* Inspector 2 Header */}
                  <div className="col-start-3 row-start-1 flex items-center justify-center gap-2 bg-slate-800/50 rounded-t-lg border-b border-yellow-500">
                    <img src="https://i.pravatar.cc/150?img=33" alt="Carlos" className="w-6 h-6 rounded-full grayscale" />
                    <span className="font-bold text-sm text-slate-300">Carlos (Offline)</span>
                  </div>
                  {/* Inspector 3 Header */}
                  <div className="col-start-4 row-start-1 flex items-center justify-center gap-2 bg-slate-800/50 rounded-t-lg border-b border-slate-600">
                    <img src="https://i.pravatar.cc/150?img=47" alt="Andrea" className="w-6 h-6 rounded-full" />
                    <span className="font-bold text-sm text-slate-300">Andrea (Terminado)</span>
                  </div>

                  {/* 2. Eje de Tiempo y Líneas Divisorias (Filas 2 a 11) */}
                  {[...Array(10)].map((_, i) => {
                    const hour = 8 + i; // 08:00 a 17:00
                    const rowClass = `row-start-${2 + i}`;
                    return (
                      <React.Fragment key={`hour-${hour}`}>
                        <div className={`col-start-1 ${rowClass} text-xs text-slate-500 text-right pr-2 pt-2`}>
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                        <div className={`col-start-2 col-span-3 ${rowClass} border-t border-slate-800/50 pointer-events-none`}></div>
                      </React.Fragment>
                    );
                  })}

                  {/* 3. Contenedores de Arrastre (Dropzones bg) */}
                  <div className="col-start-2 row-start-2 row-end-[12] border-l border-r border-slate-800/30"></div>
                  <div className="col-start-3 row-start-2 row-end-[12] border-r border-slate-800/30"></div>
                  <div className="col-start-4 row-start-2 row-end-[12] border-r border-slate-800/30"></div>

                  {/* 4. Tarjetas de Inspección (Eventos) */}
                  
                  {/* Evento 1: Roberto (Col 2), 09:00 a 11:00 (Row 3 a 5) */}
                  <div className="col-start-2 row-start-3 row-end-5 m-1 bg-emerald-900/30 border-l-4 border-emerald-500 rounded-lg p-3 shadow-sm hover:bg-emerald-900/50 transition-colors cursor-grab flex flex-col justify-between z-10 hover:z-20">
                    <div>
                      <div className="flex items-center justify-between mb-1 pointer-events-none">
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">09:00 - 11:00</span>
                        <i className="fa-solid fa-check text-emerald-500 text-xs"></i>
                      </div>
                      <h4 className="text-white font-bold text-sm pointer-events-none">Condominio Las Rosas</h4>
                    </div>
                  </div>

                  {/* Evento 2: Roberto (Col 2), 11:30 a 14:00 (Row 5.5 a 8) */}
                  <div className="col-start-2 row-start-5 row-end-8 m-1 mt-10 bg-blue-900/30 border-l-4 border-blue-500 rounded-lg p-3 shadow-lg hover:bg-blue-900/50 transition-colors cursor-grab flex flex-col justify-between z-10 overflow-hidden relative hover:z-20">
                    <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-blue-500/10 -z-10 border-r border-blue-500/30 pointer-events-none"></div>
                    <div className="pointer-events-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> 11:30 - 14:00</span>
                      </div>
                      <h4 className="text-white font-bold text-sm">Hospital San José</h4>
                    </div>
                    <div className="text-xs text-blue-300 bg-navy-950/80 p-1.5 rounded text-center backdrop-blur-sm pointer-events-none mt-2">
                      En Curso (50%)
                    </div>
                  </div>

                  {/* Evento 3: Carlos (Col 3), 15:00 a 17:00 (Row 9 a 11) */}
                  <div className="col-start-3 row-start-9 row-end-11 m-1 bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg p-3 hover:bg-yellow-900/50 transition-colors cursor-grab flex flex-col justify-between z-10 hover:z-20">
                    <div className="pointer-events-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded">15:00 - 17:00</span>
                        <i className="fa-solid fa-clock text-yellow-600 text-xs"></i>
                      </div>
                      <h4 className="text-slate-200 font-bold text-sm">La Parrilla de Juan</h4>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
