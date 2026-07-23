'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ----------------------------------------------------------------------
// PÁGINA: Re-inspección Cliente
// ----------------------------------------------------------------------
// Flujo donde el cliente selecciona los departamentos que ya corrigieron
// sus defectos (Sello Rojo/Amarillo) para solicitar una nueva visita.
// ----------------------------------------------------------------------

export default function PortalReinspeccion() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const deptos = [
    { id: '204', status: 'rojo', label: 'Sello Rojo', date: '12 Ago', issue: 'Fuga detectada en prueba de hermeticidad de calefón.' },
    { id: '510', status: 'rojo', label: 'Sello Rojo', date: '14 Ago', issue: 'Conducto de evacuación obstruido y monóxido elevado.' },
    { id: '802', status: 'rojo', label: 'Sello Rojo', date: '14 Ago', issue: 'Fuga en flexible de cocina. Válvula vencida.' },
    { id: '305', status: 'amarillo', label: 'Sello Amarillo', date: '12 Ago', issue: 'Rejilla de ventilación superior parcialmente tapada.' },
    { id: '1104', status: 'amarillo', label: 'Sello Amarillo', date: '15 Ago', issue: 'Llave de paso de cocina dura, se recomienda cambio.' },
  ];

  const handleToggle = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === deptos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(deptos.map(d => d.id));
    }
  };

  // Precios Fijos
  const precioUnitario = 15000;
  const count = selectedIds.length;
  const subtotal = count * precioUnitario;
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const formatMoney = (val: number) => Math.round(val).toLocaleString('es-CL');

  return (
    <>
      {/* Top Navigation / Header Actions */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 hidden sm:flex">
              <i className="fa-solid fa-screwdriver-wrench text-emerald-500 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Levantamiento de Defectos</h1>
              <p className="text-xs text-slate-500 font-medium">Condominio Jardines del Sur - 5 Pendientes</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 hidden sm:flex">
          <i className="fa-solid fa-circle-info"></i> Paso 1 de 1
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 pt-4">
        
        {/* Columna Izquierda: Selección */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Selecciona las unidades listas</h2>
            <p className="text-slate-500">Marca los departamentos que ya han reparado sus observaciones y están listos para recibir una nueva inspección.</p>
          </div>

          {/* Lista de Deptos */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Unidades con Observaciones</h3>
              <button 
                onClick={selectAll}
                className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors outline-none"
              >
                {selectedIds.length === deptos.length ? 'Desmarcar Todos' : 'Marcar Todos'}
              </button>
            </div>
            
            <div className="divide-y divide-slate-100">
              
              {deptos.map((depto) => {
                const isSelected = selectedIds.includes(depto.id);
                
                // Mapeo seguro JIT
                const isRed = depto.status === 'rojo';
                const bgBox = isRed ? 'bg-red-50 border-red-100 text-red-600' : 'bg-yellow-50 border-yellow-100 text-yellow-700';
                const bgBadge = isRed ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
                const rowClass = isSelected ? 'bg-emerald-50 border-l-4 border-emerald-300' : 'hover:bg-slate-50 border-l-4 border-transparent';

                return (
                  <label key={depto.id} className={`p-5 flex items-center gap-4 cursor-pointer transition-colors ${rowClass}`}>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleToggle(depto.id)}
                        className={`appearance-none w-6 h-6 border-2 rounded-md transition-all cursor-pointer ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}
                      />
                      {isSelected && <i className="fa-solid fa-check absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs pointer-events-none"></i>}
                    </div>

                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border shrink-0 ${bgBox}`}>
                      <span className="font-bold text-lg">{depto.id}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${bgBadge}`}>
                          {depto.label}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          <i className="fa-solid fa-calendar text-slate-300 mr-1"></i> Insp: {depto.date}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900">{depto.issue}</p>
                    </div>
                  </label>
                );
              })}

            </div>
          </div>

          {/* Agendamiento */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mt-2">
            <h3 className="font-bold text-slate-900 mb-4">
              <i className="fa-solid fa-calendar-day text-sky-500 mr-2"></i> Preferencia de Agendamiento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Fecha Sugerida</label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-sky-500 transition-colors outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">Jornada Preferida</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-sky-500 transition-colors outline-none">
                  <option>Cualquier horario</option>
                  <option>Mañana (09:00 - 13:00)</option>
                  <option>Tarde (14:00 - 18:00)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Cotizador */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-28">
            <div className="p-6 bg-slate-900 text-white">
              <h3 className="font-bold text-lg mb-1">Resumen de Cotización</h3>
              <p className="text-slate-400 text-sm">Visita de re-inspección</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Deptos Seleccionados:</span>
                <span className="font-bold text-slate-900"><span>{count}</span> de 5</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Costo Unitario Base:</span>
                <span className="font-medium text-slate-700">${formatMoney(precioUnitario)}</span>
              </div>

              <div className="h-px w-full bg-slate-100 my-4"></div>

              <div className="flex justify-between text-slate-500 text-sm">
                <span>Subtotal Neto:</span>
                <span className="font-mono text-slate-700">${formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm">
                <span>IVA (19%):</span>
                <span className="font-mono text-slate-700">${formatMoney(iva)}</span>
              </div>

              <div className="flex justify-between items-end pt-4">
                <span className="text-slate-700 font-bold">Total a Pagar:</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">${formatMoney(total)}</span>
              </div>

              <button 
                disabled={count === 0}
                className={`w-full py-3.5 mt-6 rounded-xl font-bold text-white shadow-lg transition-transform ${count > 0 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed opacity-50 shadow-none'}`}
              >
                Solicitar y Pagar
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
