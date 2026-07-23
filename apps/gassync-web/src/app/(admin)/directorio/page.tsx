'use client'; // Necesario para interactividad de búsqueda y filtros

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/admin/Topbar';

// ----------------------------------------------------------------------
// PÁGINA: Directorio de Clientes (Admin)
// ----------------------------------------------------------------------
// Muestra la lista de clientes institucionales y residenciales.
// Incluye barra de búsqueda y filtros básicos.
// ----------------------------------------------------------------------

export default function DirectorioPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [rubroFilter, setRubroFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // Datos simulados (mock)
  const clients = [
    { id: 1, name: 'La Parrilla de Juan', address: 'Providencia 1234', rubro: 'comercial', type: 'Restaurante', units: '8', unitDesc: 'Artefactos', date: '15 Oct 2026', dateDesc: 'En 12 días', status: 'rojo', statusText: 'Alerta Crítica', icon: 'fa-solid fa-utensils', colorBase: 'indigo' },
    { id: 2, name: 'Cerámicas BioBío S.A.', address: 'Parque Industrial, Lote 4', rubro: 'industrial', type: 'Planta Prod.', units: '3', unitDesc: 'Calderas Ind.', date: '22 Mar 2028', dateDesc: 'Vigente', status: 'verde', statusText: 'Sello Verde', icon: 'fa-solid fa-industry', colorBase: 'purple' },
    { id: 3, name: 'Hospital San José', address: 'Independencia 1100', rubro: 'publico', type: 'Salud', units: '12', unitDesc: 'Salas', date: '10 Ene 2027', dateDesc: 'Programado', status: 'amarillo', statusText: 'En Trámite', icon: 'fa-solid fa-hospital', colorBase: 'teal' },
  ];

  // Filtrado básico en cliente
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRubro = rubroFilter ? client.rubro === rubroFilter : true;
    const matchesEstado = estadoFilter ? client.status === estadoFilter : true;
    return matchesSearch && matchesRubro && matchesEstado;
  });

  return (
    <>
      <Topbar 
        title="Directorio de Clientes" 
        subtitle="Gestiona certificaciones SEC residenciales, comerciales e industriales." 
        actionButtonLabel="Nuevo Cliente" 
        actionButtonIcon="fa-solid fa-plus" 
      />

      <div className="flex-1 overflow-y-auto p-8 z-10">
        <div className="glass-card rounded-2xl border border-slate-700/50 overflow-hidden bg-slate-800/30 backdrop-blur-md">
          
          {/* Barra de Herramientas de la Tabla */}
          <div className="px-6 py-4 border-b border-slate-700/50 flex flex-wrap justify-between items-center bg-slate-800/30 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-white">Directorio de Clientes</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-medium border border-slate-700">
                {filteredClients.length} Registros
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative mr-4">
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="text" 
                  placeholder="Buscar empresa..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-navy-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                />
              </div>

              <select 
                value={rubroFilter}
                onChange={(e) => setRubroFilter(e.target.value)}
                className="bg-navy-800 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2 outline-none"
              >
                <option value="">Todos los Rubros</option>
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
                <option value="publico">Público</option>
              </select>
              
              <select 
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="bg-navy-800 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2 outline-none"
              >
                <option value="">Estado Sello</option>
                <option value="verde">Verde</option>
                <option value="amarillo">Amarillo</option>
                <option value="rojo">Rojo</option>
              </select>
              
              <button className="px-3 py-2 rounded-lg border border-slate-700 text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-download text-slate-500"></i>
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy-900/50 border-b border-slate-700/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente / Institución</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rubro</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Puntos / Unid.</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vencimiento</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado SEC</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredClients.map((client) => {
                  
                  // Mapeo seguro para Tailwind JIT
                  const statusStyles = {
                    verde: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
                    rojo: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
                    amarillo: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-500' },
                  };
                  const colorStyles = {
                    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
                    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
                    teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' }
                  };

                  const safeStatus = statusStyles[client.status as keyof typeof statusStyles] || statusStyles.verde;
                  const safeColor = colorStyles[client.colorBase as keyof typeof colorStyles] || colorStyles.indigo;

                  const badgeClass = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${safeStatus.bg} ${safeStatus.text} border ${safeStatus.border}`;
                  const dotClass = `w-1.5 h-1.5 rounded-full ${safeStatus.dot} ${client.status === 'rojo' ? 'animate-pulse' : ''}`;

                  return (
                    <tr key={client.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => setSelectedClient(client)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${safeColor.bg} ${safeColor.text} ${safeColor.border}`}>
                            <i className={client.icon}></i>
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{client.name}</p>
                            <p className="text-xs text-slate-500">{client.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize border ${safeColor.bg} ${safeColor.text} ${safeColor.border}`}>
                          {client.rubro}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{client.type}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-300 font-medium">{client.units}</span>
                        <p className="text-xs text-slate-500">{client.unitDesc}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm font-bold ${client.status === 'rojo' ? 'text-red-400' : 'text-slate-300'}`}>{client.date}</p>
                        <p className="text-xs text-slate-500">{client.dateDesc}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={badgeClass}>
                          <span className={dotClass}></span> {client.statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {client.status === 'rojo' ? (
                          <button className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs font-bold rounded-lg transition-colors border border-orange-500/20" onClick={(e) => { e.stopPropagation(); router.push('/cotizador'); }}>
                            Cotizar
                          </button>
                        ) : (
                          <button className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors ml-auto">
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over: Perfil del Cliente */}
      {selectedClient && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedClient(null)}></div>
          
          <div className="relative w-full max-w-md bg-navy-950 h-full shadow-2xl border-l border-slate-800 flex flex-col animate-[slideInRight_0.3s_ease-out]">
            {/* Header Slide-over */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Perfil CRM</h2>
              <button onClick={() => setSelectedClient(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            {/* Contenido Slide-over */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-3xl text-slate-300 mb-4 border border-slate-700">
                  <i className={selectedClient.icon}></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedClient.name}</h3>
                <span className="inline-block px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300 capitalize">{selectedClient.rubro} - {selectedClient.type}</span>
              </div>
              
              <div className="bg-navy-900 rounded-xl p-4 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Detalles Generales</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dirección</span>
                    <span className="text-white font-medium">{selectedClient.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Volumen</span>
                    <span className="text-white font-medium">{selectedClient.units} {selectedClient.unitDesc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vencimiento SEC</span>
                    <span className="text-white font-medium">{selectedClient.date}</span>
                  </div>
                </div>
              </div>

              <div className="bg-navy-900 rounded-xl p-4 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Últimas Actividades</h4>
                <div className="relative border-l border-slate-700 ml-3 space-y-4">
                  <div className="pl-4 relative">
                    <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[4.5px] top-1.5"></div>
                    <p className="text-sm text-white font-medium">Cotización Enviada</p>
                    <p className="text-xs text-slate-500">Hace 2 días por Carlos M.</p>
                  </div>
                  <div className="pl-4 relative">
                    <div className="absolute w-2 h-2 bg-emerald-500 rounded-full -left-[4.5px] top-1.5"></div>
                    <p className="text-sm text-white font-medium">Llamada de Prospección</p>
                    <p className="text-xs text-slate-500">Hace 1 semana</p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Footer Slide-over */}
            <div className="p-6 border-t border-slate-800">
              <button 
                onClick={() => {
                  setSelectedClient(null);
                  router.push('/cotizador');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-file-invoice-dollar"></i> Generar Cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
