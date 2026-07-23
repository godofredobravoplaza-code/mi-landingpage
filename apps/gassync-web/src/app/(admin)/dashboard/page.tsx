'use client'; // Necesario para interactividad (selects, modals)

import React, { useState } from 'react';
import Topbar from '@/components/admin/Topbar';
import KpiCard from '@/components/admin/KpiCard';

// ----------------------------------------------------------------------
// PÁGINA: Dashboard (Admin)
// ----------------------------------------------------------------------
// Reúne los KPIs principales y la Carta Gantt de proyectos.
// ----------------------------------------------------------------------

export default function DashboardPage() {
  const [filter, setFilter] = useState('industrial');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Datos simulados (igual que el prototipo original)
  const projectsData = {
    industrial: {
      scaleLabel: "Semana",
      items: [
        { name: "Hospital San José (TC5)", desc: "12 Salas de calderas", colStart: 1, colSpan: 5, color: "bg-teal-600", progress: 60, status: "En Terreno" },
        { name: "Cerámicas BioBío S.A.", desc: "Red industrial 4 bar", colStart: 3, colSpan: 6, color: "bg-purple-600", progress: 30, status: "Diseño SEC" },
        { name: "Planta Nestlé Macul", desc: "Renovación 5 años", colStart: 5, colSpan: 4, color: "bg-orange-600", progress: 10, status: "Agendado" }
      ]
    },
    residencial: {
      scaleLabel: "Día",
      items: [
        { name: "Condominio Las Rosas", desc: "145 Deptos", colStart: 1, colSpan: 2, color: "bg-blue-600", progress: 100, status: "Sello Verde" },
        { name: "Edificio Los Alerces", desc: "Regularización", colStart: 2, colSpan: 3, color: "bg-red-600", progress: 80, status: "Reparando Fuga" },
        { name: "Restaurante La Parrilla", desc: "Cocina comercial", colStart: 4, colSpan: 2, color: "bg-indigo-600", progress: 50, status: "En Terreno" },
        { name: "Edificio Vista Hermosa", desc: "Cert. Periódica", colStart: 6, colSpan: 2, color: "bg-blue-500", progress: 0, status: "Agendado" }
      ]
    }
  };

  const activeData = projectsData[filter as keyof typeof projectsData];

  return (
    <>
      <Topbar 
        title="Dashboard Analítico" 
        subtitle="KPIs de Inspección Técnica y Gestión de Proyectos SEC." 
        actionButtonLabel="Exportar Reporte" 
        actionButtonIcon="fa-solid fa-download" 
      />

      <div className="flex-1 overflow-y-auto p-8 z-10 space-y-8">
        
        {/* Fila 1: KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiCard 
            title="First-Time Yield"
            value="87%"
            icon="fa-solid fa-check-double"
            bgGlowClass="bg-emerald-500/10 group-hover:bg-emerald-500/20"
            iconBgClass="bg-emerald-500/20 text-emerald-400"
            trendColorClass="text-emerald-400"
            trendIcon="fa-solid fa-arrow-trend-up"
            trendText="+4%"
            trendSubtext="Sello Verde en 1ra visita"
          />
          <KpiCard 
            title="Efec. de Visitas"
            value="94%"
            icon="fa-solid fa-location-dot"
            bgGlowClass="bg-blue-500/10 group-hover:bg-blue-500/20"
            iconBgClass="bg-blue-500/20 text-blue-400"
            trendColorClass="text-blue-400"
            trendIcon="fa-solid fa-calendar-check"
            trendText="142/150"
            trendSubtext="Agendadas vs Ejecutadas"
          />
          <KpiCard 
            title="Lead Time Prom."
            value={<span>4.2 <span className="text-lg text-slate-400">días</span></span>}
            icon="fa-solid fa-stopwatch"
            bgGlowClass="bg-purple-500/10 group-hover:bg-purple-500/20"
            iconBgClass="bg-purple-500/20 text-purple-400"
            trendColorClass="text-purple-400"
            trendIcon="fa-solid fa-arrow-trend-down"
            trendText="-1.5d"
            trendSubtext="Desde inspección a Sello"
          />
          <KpiCard 
            title="Proyectos Activos"
            value="12"
            icon="fa-solid fa-folder-tree"
            bgGlowClass="bg-orange-500/10 group-hover:bg-orange-500/20"
            iconBgClass="bg-orange-500/20 text-orange-400"
            trendColorClass="text-orange-400"
            trendIcon="fa-solid fa-industry"
            trendText="3 Ind"
            trendSubtext="| 4 Com | 5 Res"
          />
        </div>

        {/* Fila 2: Carta Gantt */}
        <div className="glass-card rounded-2xl border border-slate-700/50 p-6 flex flex-col min-h-[400px] bg-slate-800/30 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Carta Gantt de Proyectos SEC</h2>
              <p className="text-xs text-slate-400 mt-1">Control visual del pipeline de inspección y certificación.</p>
            </div>
            
            <div className="flex gap-4 items-center bg-navy-950 p-2 rounded-xl border border-slate-800">
              <label className="text-sm text-slate-400 ml-2"><i className="fa-solid fa-filter text-slate-500 mr-1"></i> Rubro:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="bg-slate-800 border-none rounded-lg text-sm text-white font-medium focus:ring-0 p-1.5 px-3 outline-none"
              >
                <option value="industrial">Industrial / Público (Largo Plazo)</option>
                <option value="residencial">Residencial / Comercial (Corto Plazo)</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 bg-navy-950/50 rounded-xl border border-slate-800 p-4 overflow-x-auto relative">
            
            {/* Cabecera Gantt */}
            <div className="grid grid-cols-8 gap-2 mb-4 border-b border-slate-800 pb-2 min-w-[700px]">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {activeData.scaleLabel} {i}
                </div>
              ))}
            </div>
            
            {/* Grid Lineas de fondo */}
            <div className="absolute inset-0 top-[3.5rem] bottom-4 left-4 right-4 grid grid-cols-8 gap-2 pointer-events-none min-w-[700px]">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="border-l border-slate-800/50"></div>
              ))}
            </div>

            {/* Barras de Proyectos */}
            <div className="space-y-4 min-w-[700px] relative z-10">
              {activeData.items.map((proj, idx) => (
                <div key={idx} className="grid grid-cols-8 gap-2 group">
                  <div 
                    className={`relative h-14 rounded-lg shadow-md flex flex-col justify-center px-4 overflow-hidden ${proj.color} hover:brightness-110 transition-all cursor-pointer border border-white/10`} 
                    style={{ gridColumn: `${proj.colStart} / span ${proj.colSpan}` }}
                    onClick={() => setSelectedProject(proj)}
                  >
                    
                    {/* Barra de progreso visual (se omite bg-animado por simplicidad en primer paso) */}
                    <div className="absolute left-0 top-0 bottom-0 bg-black/20" style={{ width: `${proj.progress}%` }}></div>
                    
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-bold text-sm truncate drop-shadow-md">{proj.name}</h4>
                        <p className="text-white/70 text-xs truncate drop-shadow-md">{proj.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/90 bg-black/20 px-2 py-0.5 rounded shadow-sm">{proj.progress}%</span>
                        {/* Icono simplificado */}
                        <i className="fa-solid fa-circle-info text-white/70"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      {/* Modal de Proyecto */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-navy-950 rounded-2xl shadow-2xl border border-slate-700 animate-[fadeIn_0.2s_ease-out] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className={`p-6 border-b border-slate-700/50 flex items-center justify-between ${selectedProject.color.split(' ')[0].replace('bg-', 'bg-').replace('-600', '-900/30')}`}>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedProject.name}</h2>
                <p className="text-sm text-slate-400">{selectedProject.desc}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-2xl text-slate-400">
                  <i className="fa-solid fa-building-circle-arrow-right"></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-300">Progreso General</span>
                    <span className="text-lg font-black text-white">{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${selectedProject.color.split(' ')[0]}`} style={{ width: `${selectedProject.progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Duración Asignada</p>
                  <p className="text-lg font-bold text-white">{selectedProject.colSpan} Semanas</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Estado</p>
                  <p className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Activo
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2">Hitos de Inspección</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy-900 border border-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-circle-check text-emerald-500"></i>
                      <span className="text-sm text-slate-300">Revisión Documental</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500">100%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-blue-500"></div></div>
                      <span className="text-sm text-white font-bold">Visita a Terreno (Red)</span>
                    </div>
                    <span className="text-xs font-bold text-blue-400">En Curso</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-navy-900 border border-slate-800 rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div></div>
                      <span className="text-sm text-slate-400">Pruebas de Hermeticidad</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">Pendiente</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
