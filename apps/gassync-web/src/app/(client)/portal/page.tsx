'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ----------------------------------------------------------------------
// PÁGINA: Portal Dashboard (Client)
// ----------------------------------------------------------------------
// Vista de resumen del cliente, muestra el estado general y permite 
// solicitar una inspección general o re-inspección de defectos.
// ----------------------------------------------------------------------

export default function PortalDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);

  return (
    <>
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hola, Juan</h2>
          <p className="text-slate-500 mt-1">Aquí tienes el estado de las certificaciones de tus recintos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-calendar-plus"></i> Solicitar Inspección
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Estado Sello Verde */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-amber-50 border-amber-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full filter blur-[80px] -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-amber-100 text-amber-700 border border-amber-200">
                <i className="fa-solid fa-triangle-exclamation"></i> Requiere Atención
              </div>
              <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-1">Estado Sello Verde SEC</h3>
              <p className="text-4xl font-black text-slate-900 tracking-tight mb-2">Por Vencer</p>
              <p className="text-slate-600">El sello verde de tu instalación expira en <span className="font-bold text-amber-600">45 días</span> (15 Octubre 2026).</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-amber-200/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Última Certificación</p>
                <p className="font-bold text-slate-800">15 Octubre 2024</p>
              </div>
              <button onClick={() => setIsBuildingModalOpen(true)} className="text-sky-600 hover:text-sky-700 font-bold text-sm flex items-center gap-1 group">
                Ver Detalle del Edificio <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Próxima Visita */}
        <div className="bg-sky-900 border border-transparent rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-sky-800 flex items-center justify-center mb-4 border border-sky-700">
                <i className="fa-solid fa-calendar-check text-sky-300 text-xl"></i>
              </div>
              <h3 className="text-sky-300 font-bold uppercase tracking-wider text-sm mb-2">Próxima Visita Programada</h3>
              <p className="text-2xl font-bold mb-1">Martes, 12 Sep</p>
              <p className="text-sky-200 text-sm">Entre 09:00 - 13:00 hrs</p>
            </div>

            <div className="mt-8 bg-sky-800/50 rounded-xl p-4 border border-sky-700">
              <p className="text-xs text-sky-300 mb-1">Inspector Asignado</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300">
                  <img src="https://ui-avatars.com/api/?name=Carlos+Rojas&background=random" className="w-full h-full rounded-full" alt="Inspector" />
                </div>
                <p className="font-medium text-sm">Carlos Rojas (TC7)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bóveda de Documentos */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Cotizaciones y Documentos</h3>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-bold">Documento</th>
                <th className="p-4 font-bold">Fecha</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold">Monto</th>
                <th className="p-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <i className="fa-solid fa-file-invoice-dollar text-lg"></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Cotización COT-2026-089</p>
                      <p className="text-xs text-slate-500">Inspección Residencial 120 Deptos</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-medium">10 Ago 2026</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Por Aprobar</span>
                </td>
                <td className="p-4 font-bold text-slate-800">$2.450.000</td>
                <td className="p-4 text-right">
                  <button className="bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 px-4 py-2 rounded-lg font-bold text-xs transition-colors">
                    Revisar
                  </button>
                </td>
              </tr>
              
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <i className="fa-solid fa-file-pdf text-lg"></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Certificado TC6 - 2024</p>
                      <p className="text-xs text-slate-500">Sello Verde Anterior</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-medium">15 Oct 2024</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Aprobado</span>
                </td>
                <td className="p-4 font-bold text-slate-800">-</td>
                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-sky-600 px-2 py-2 transition-colors" title="Descargar">
                    <i className="fa-solid fa-download"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tipo de Inspección */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 animate-[fadeIn_0.2s_ease-out]">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Solicitar Nueva Inspección</h2>
            <p className="text-slate-500 mb-8">¿Qué tipo de servicio necesitas agendar para el Condominio Jardines del Sur?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Opción A */}
              <Link href="/portal/cotizacion" className="text-left p-6 rounded-xl border-2 border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all group relative overflow-hidden block">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-sky-500">
                  <i className="fa-solid fa-check-circle text-xl"></i>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-sky-100 flex items-center justify-center text-slate-600 group-hover:text-sky-600 mb-4 transition-colors">
                  <i className="fa-solid fa-building-circle-check text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-sky-700 transition-colors">Renovación General</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Inspección de las 120 unidades y áreas comunes. Ideal para el vencimiento bianual.</p>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors">Cotizar Edificio Completo</span>
              </Link>

              {/* Opción B */}
              <Link href="/portal/reinspeccion" className="text-left p-6 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group relative overflow-hidden block">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
                  <i className="fa-solid fa-check-circle text-xl"></i>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 mb-4 transition-colors">
                  <i className="fa-solid fa-screwdriver-wrench text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">Re-inspección (Defectos)</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Inspección exclusiva para los departamentos con Sello Rojo, Amarillo o Ausentes.</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">3</span>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 text-xs font-bold">2</span>
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors ml-2">Seleccionar Deptos</span>
                </div>
              </Link>

            </div>
          </div>
        </div>
      )}
      {/* Modal: Detalle del Edificio */}
      {isBuildingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBuildingModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-[fadeIn_0.2s_ease-out]">
            <button 
              onClick={() => setIsBuildingModalOpen(false)} 
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Ficha del Edificio</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nombre</span>
                <span className="text-slate-900 font-bold">Condominio Jardines del Sur</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Dirección</span>
                <span className="text-slate-900 font-bold text-right">Av. Grecia 1000<br/><span className="text-sm font-normal">Ñuñoa, Santiago</span></span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Total de Unidades</span>
                <span className="text-slate-900 font-bold">120 Departamentos</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Instalación Central</span>
                <span className="text-slate-900 font-bold">Red de Gas Natural (Metrogas)</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Administrador</span>
                <span className="text-slate-900 font-bold">Juan Pérez (Comité)</span>
              </div>
            </div>
            
            <button onClick={() => setIsBuildingModalOpen(false)} className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
