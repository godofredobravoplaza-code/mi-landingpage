'use client';

import React, { useState } from 'react';
import Topbar from '@/components/admin/Topbar';

// ----------------------------------------------------------------------
// PÁGINA: Cotizador Dinámico
// ----------------------------------------------------------------------
// Permite cotizar proyectos ajustando márgenes de utilidad en tiempo real.
// Tiene dos modos de vista: Interna (Admin) y Cliente (Preview).
// ----------------------------------------------------------------------

export default function CotizadorPage() {
  const [viewMode, setViewMode] = useState<'internal' | 'client'>('internal');
  
  // Estados para el cálculo
  const [deptos, setDeptos] = useState(45);
  const [artefactos, setArtefactos] = useState(2);
  const [hasVisita, setHasVisita] = useState(true);
  const [hasTraslado, setHasTraslado] = useState(false);
  const [marginPct, setMarginPct] = useState(35);

  // Cálculos base
  const COSTO_HH = 15000;
  const ESTIMATED_HOURS_PER_DEPTO = 0.5 * artefactos; 
  const totalHH = Math.ceil(deptos * ESTIMATED_HOURS_PER_DEPTO);
  
  const costoManoObra = totalHH * COSTO_HH;
  const costoVisita = hasVisita ? 35000 : 0;
  const costoTraslado = hasTraslado ? 120000 : 0;
  
  const costoAmortizacion = 45000;
  const costoAdmin = 50000;

  const totalOperativoBase = costoManoObra + costoVisita + costoTraslado + costoAmortizacion + costoAdmin;
  
  // Cálculo de Margen
  const gananciaProyectada = totalOperativoBase * (marginPct / 100);
  const precioFinalNeto = totalOperativoBase + gananciaProyectada;
  const iva = precioFinalNeto * 0.19;
  const precioTotalConIva = precioFinalNeto + iva;

  // Helpers de formato
  const formatMoney = (val: number) => Math.round(val).toLocaleString('es-CL');

  return (
    <>
      <Topbar 
        title="Cotizador Inteligente" 
        subtitle="Calcula márgenes, asigna recursos y genera propuestas." 
        actionButtonLabel="Enviar a Cliente" 
        actionButtonIcon="fa-solid fa-paper-plane" 
      />

      <div className="flex-1 overflow-hidden p-8 z-10 flex gap-8 h-full">
        
        {/* PANEL IZQUIERDO: Inputs */}
        <div className="w-1/2 glass-card rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden bg-slate-800/30 backdrop-blur-md">
          <div className="h-16 px-6 border-b border-slate-700/50 flex items-center bg-slate-800/30 shrink-0">
            <h2 className="text-white font-bold"><i className="fa-solid fa-sliders text-orange-500 mr-2"></i> Parámetros de Cotización</h2>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Datos del Cliente */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cliente / Institución</label>
              <input type="text" defaultValue="" placeholder="Ej: Condominio Las Rosas" className="w-full px-4 py-3 bg-navy-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors outline-none" />
            </div>

            {/* Tipo de Proyecto */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-500/10 border-2 border-orange-500 rounded-xl p-4 text-center cursor-pointer">
                <i className="fa-solid fa-building text-orange-500 text-xl mb-2"></i>
                <h3 className="font-bold text-orange-500 text-sm">Residencial</h3>
              </div>
              <div className="bg-navy-950 border border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-slate-500 transition-colors opacity-60">
                <i className="fa-solid fa-store text-slate-400 text-xl mb-2"></i>
                <h3 className="font-bold text-slate-300 text-sm">Comercial</h3>
              </div>
              <div className="bg-navy-950 border border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-slate-500 transition-colors opacity-60">
                <i className="fa-solid fa-industry text-slate-400 text-xl mb-2"></i>
                <h3 className="font-bold text-slate-300 text-sm">Industrial</h3>
              </div>
            </div>

            {/* Volumen */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nº de Departamentos</label>
                <input 
                  type="number" 
                  value={deptos} 
                  onChange={(e) => setDeptos(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-navy-950 border border-slate-700 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-orange-500 transition-colors outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Artefactos (Promedio)</label>
                <select 
                  value={artefactos} 
                  onChange={(e) => setArtefactos(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-navy-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors outline-none"
                >
                  <option value="1">1 (Solo Cocina)</option>
                  <option value="2">2 (Cocina + Calefont)</option>
                  <option value="3">3 (Cocina + Calefont + Estufa)</option>
                </select>
              </div>
            </div>

            {/* Logística y Extras */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Logística y Operación</label>
              
              <label className="flex items-center justify-between p-4 bg-navy-950 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-500 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-magnifying-glass text-blue-400"></i>
                  <div>
                    <h4 className="font-bold text-white text-sm">Visita de Diagnóstico Previa</h4>
                    <p className="text-xs text-slate-400">Facturar levantamiento inicial (+ $35.000)</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={hasVisita} 
                  onChange={(e) => setHasVisita(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 outline-none"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-navy-950 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-500 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-truck-fast text-emerald-400"></i>
                  <div>
                    <h4 className="font-bold text-white text-sm">Traslado Fuera de Región</h4>
                    <p className="text-xs text-slate-400">Aplica recargo logístico de peajes/combustible</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={hasTraslado} 
                  onChange={(e) => setHasTraslado(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 outline-none"
                />
              </label>
            </div>

          </div>
        </div>

        {/* PANEL DERECHO: Desglose y Rentabilidad */}
        <div className="w-1/2 flex flex-col bg-navy-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
          
          {/* View Toggle */}
          <div className="p-2 bg-navy-900 border-b border-slate-800 flex justify-center sticky top-0 z-20 shadow-md">
            <div className="inline-flex bg-navy-950 rounded-lg p-1 border border-slate-800">
              <button 
                onClick={() => setViewMode('internal')} 
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${viewMode === 'internal' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <i className="fa-solid fa-eye"></i> Vista Interna (Admin)
              </button>
              <button 
                onClick={() => setViewMode('client')} 
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 ${viewMode === 'client' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <i className="fa-solid fa-user-tie"></i> Vista Cliente (Preview)
              </button>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto flex flex-col relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Cotización Comercial</h2>
              <p className="text-slate-400">Ref: CTZ-2026-0892</p>
            </div>

            {viewMode === 'internal' ? (
              <div className="space-y-6 flex-1 animate-[fadeIn_0.3s_ease-out]">
                {/* Costos Directos */}
                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Costos Directos (Operación)</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Mano de Obra (Inspector) - <span>{totalHH}</span> HH estimadas</span>
                      <span className="font-mono text-slate-300">${formatMoney(costoManoObra)}</span>
                    </div>
                    {hasVisita && (
                      <div className="flex justify-between text-slate-400">
                        <span>Visita de Diagnóstico Previa</span>
                        <span className="font-mono text-slate-300">${formatMoney(costoVisita)}</span>
                      </div>
                    )}
                    {hasTraslado && (
                      <div className="flex justify-between text-slate-400">
                        <span>Recargo Logístico (Fuera Región)</span>
                        <span className="font-mono text-slate-300">${formatMoney(costoTraslado)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Costos Indirectos */}
                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Costos Fijos / Indirectos</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Amortización Equipos (Calibración)</span>
                      <span className="font-mono text-slate-300">${formatMoney(costoAmortizacion)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Gestión Administrativa SEC (TC6)</span>
                      <span className="font-mono text-slate-300">${formatMoney(costoAdmin)}</span>
                    </div>
                  </div>
                </div>

                {/* Suma de Costos */}
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <span className="font-bold text-white text-sm">Costo Total Operativo (Base)</span>
                  <span className="font-mono font-bold text-white text-lg">${formatMoney(totalOperativoBase)}</span>
                </div>

                {/* Margen de Ganancia (Slider) */}
                <div className="p-5 bg-orange-500/10 border border-orange-500/30 rounded-xl mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-orange-400">Margen de Utilidad (Profit)</h3>
                    <span className="bg-orange-500 text-white font-bold px-2 py-1 rounded text-sm">{marginPct}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="80" 
                    value={marginPct} 
                    onChange={(e) => setMarginPct(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer outline-none"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>10% (Riesgo)</span>
                    <span>Ganancia Proyectada: <span className="font-mono text-emerald-400 font-bold">${formatMoney(gananciaProyectada)}</span></span>
                    <span>80% (Premium)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-center animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center relative overflow-hidden">
                  <i className="fa-solid fa-file-invoice-dollar text-6xl text-slate-700 mb-6 block"></i>
                  <p className="text-slate-400 mb-2">Total Neto Propuesto</p>
                  <h3 className="text-5xl font-bold text-white font-mono mb-4">${formatMoney(precioFinalNeto)}</h3>
                  <p className="text-sm text-slate-500 mb-8">+ IVA (${formatMoney(iva)})</p>
                  
                  <div className="bg-orange-500 text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-orange-500/20">
                    Total a Pagar: ${formatMoney(precioTotalConIva)}
                  </div>
                </div>
              </div>
            )}

            {/* Sticky Action Button */}
            <div className="mt-6 pt-6 border-t border-slate-800 shrink-0">
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-500/20 transition-transform hover:-translate-y-1">
                Generar Propuesta PDF
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
