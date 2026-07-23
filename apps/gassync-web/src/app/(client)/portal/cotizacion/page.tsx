'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ----------------------------------------------------------------------
// PÁGINA: Cotización Cliente
// ----------------------------------------------------------------------
// Vista donde el cliente revisa y aprueba la cotización.
// ----------------------------------------------------------------------

export default function PortalCotizacion() {
  const [isApproved, setIsApproved] = useState(false);

  return (
    <>
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link href="/portal" className="text-sky-600 hover:text-sky-700 font-bold text-sm flex items-center gap-2 mb-2 transition-colors">
            <i className="fa-solid fa-arrow-left"></i> Volver al Resumen
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Cotización COT-2026-089</h1>
          <p className="text-slate-500 text-sm">Emitida el 10 Ago 2026 • Válida por 30 días</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 transition-colors flex items-center gap-2">
            <i className="fa-solid fa-download"></i> PDF
          </button>
          
          {!isApproved ? (
            <button 
              onClick={() => setIsApproved(true)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-check"></i> Aprobar Propuesta
            </button>
          ) : (
            <span className="bg-emerald-100 text-emerald-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
              <i className="fa-solid fa-check-double"></i> Propuesta Aprobada
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pt-4">
        
        {/* Welcome Message */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Propuesta Técnica y Económica</h2>
          <p className="text-slate-500">A continuación, presentamos los detalles y costos asociados a la certificación del Sello Verde (Resolución SEC) para las instalaciones de su comunidad.</p>
        </div>

        {/* Bloque 1: Propuesta Económica */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <i className="fa-solid fa-money-bill-wave text-sky-500"></i>
            <h3 className="text-lg font-bold text-slate-900">Resumen Económico</h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-slate-500 uppercase tracking-wider bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-bold border-b border-slate-200">Descripción del Servicio</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-200 text-right">Valor Neto</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800 text-base">Campaña de Certificación Sello Verde (120 Dptos)</p>
                    <p className="text-slate-500 mt-1">Incluye inspección técnica de 120 departamentos, pruebas de hermeticidad a la red general y tramitación de informe TC6 ante la SEC.</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-md border border-sky-100">
                        <i className="fa-solid fa-house"></i> 120 Unidades
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                        <i className="fa-solid fa-fire-burner"></i> 2 Artefactos prom.
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-slate-900 font-bold text-base">$1.764.000</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800 text-base">Visita de Diagnóstico y Levantamiento</p>
                    <p className="text-slate-500 mt-1">Visita técnica inicial para evaluación de áreas comunes y matriz central.</p>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-slate-900 font-bold text-base">$35.000</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-6 flex flex-col items-end border-t border-slate-100">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Subtotal Neto:</span>
                <span className="font-mono">$1.799.000</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm border-b border-slate-200 pb-2">
                <span>IVA (19%):</span>
                <span className="font-mono">$341.810</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-slate-700 font-bold">Total a Pagar:</span>
                <span className="text-2xl font-black text-sky-600 font-mono">$2.140.810</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque 2: Cronograma Logístico (Timeline) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-calendar-days text-sky-500"></i>
              <h3 className="text-lg font-bold text-slate-900">Cronograma de Ejecución Propuesto</h3>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Sujeto a Confirmación</span>
          </div>
          
          <div className="p-8">
            <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 pb-4">
              
              {/* Hito 1 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50 flex items-center justify-center">
                  <i className="fa-solid fa-check text-[8px] text-white"></i>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Aprobación y Visita Inicial</h4>
                    <p className="text-slate-500 text-sm mt-1 max-w-lg">El inspector revisa la matriz general del condominio para descartar fugas masivas antes de entrar a los departamentos.</p>
                  </div>
                  <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 whitespace-nowrap">
                    Día 1 (Confirmación)
                  </div>
                </div>
              </div>

              {/* Hito 2 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-50"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Inspección Masiva de Departamentos</h4>
                    <p className="text-slate-500 text-sm mt-1 max-w-lg">Se dividirá la comunidad en 3 jornadas de trabajo (40 dptos por día). Se requiere apoyo de conserjería para citaciones.</p>
                    <div className="mt-3 flex gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        <i className="fa-solid fa-users"></i> Coordinación requerida
                      </span>
                    </div>
                  </div>
                  <div className="bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-sky-200 whitespace-nowrap">
                    Día 3 al Día 5
                  </div>
                </div>
              </div>

              {/* Hito 3 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Entrega de Informes y Mapa de Estado</h4>
                    <p className="text-slate-500 text-sm mt-1 max-w-lg">Habilitación del 'Mapa Virtual' en este portal. Verá exactamente qué departamentos aprobaron y cuáles requieren arreglos.</p>
                  </div>
                  <div className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 whitespace-nowrap">
                    Día 8
                  </div>
                </div>
              </div>

              {/* Hito 4 */}
              <div className="relative pl-8 md:pl-10">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white"></div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Emisión de Certificados SEC (TC6)</h4>
                    <p className="text-slate-500 text-sm mt-1 max-w-lg">Ingreso del expediente a la Superintendencia para los departamentos que obtuvieron Sello Verde.</p>
                  </div>
                  <div className="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-200 whitespace-nowrap">
                    Día 20
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
