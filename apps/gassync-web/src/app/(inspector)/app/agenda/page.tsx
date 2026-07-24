'use client';

import React, { useState } from 'react';

export default function InspectorAgenda() {
  const [selectedDay, setSelectedDay] = useState(3); // Ejemplo: 3 = Miércoles

  const days = [
    { day: 'L', date: 12 },
    { day: 'M', date: 13 },
    { day: 'X', date: 14 },
    { day: 'J', date: 15 },
    { day: 'V', date: 16 },
    { day: 'S', date: 17 },
    { day: 'D', date: 18 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Header: Date Selector */}
      <div className="bg-white pt-12 pb-4 px-4 shadow-sm z-10 shrink-0 border-b border-slate-200">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-xl font-bold text-slate-800">Julio 2026</h2>
          <div className="flex gap-4">
            <button className="text-slate-500 hover:text-slate-800"><i className="fa-solid fa-search"></i></button>
            <button className="text-slate-500 hover:text-slate-800"><i className="fa-solid fa-ellipsis-vertical"></i></button>
          </div>
        </div>

        {/* Week View */}
        <div className="flex justify-between items-center px-1">
          {days.map((d, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className={`text-[10px] font-bold ${selectedDay === idx ? 'text-blue-600' : 'text-slate-500'}`}>
                {d.day}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                selectedDay === idx 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}>
                {d.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Timeline Schedule */}
      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="py-6 pr-4 pl-2 space-y-6">

          {/* Evento 1 */}
          <div className="flex gap-4 relative">
            {/* Timeline line */}
            <div className="absolute left-[39px] top-6 bottom-[-30px] w-0.5 bg-slate-200"></div>
            
            <div className="w-16 flex flex-col items-end shrink-0 pt-1">
              <span className="text-sm font-bold text-slate-700">09:00</span>
              <span className="text-xs text-slate-400">AM</span>
            </div>
            
            <div className="flex-1 relative z-10">
              {/* Dot */}
              <div className="absolute -left-6 top-2 w-3 h-3 bg-emerald-500 rounded-full ring-4 ring-slate-50"></div>
              
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-emerald-900">Mantención Preventiva</h3>
                  <i className="fa-solid fa-check-circle text-emerald-500"></i>
                </div>
                <p className="text-xs text-emerald-700 font-medium mb-3">
                  <i className="fa-regular fa-clock mr-1"></i> 09:00 - 10:30 (Completado)
                </p>
                <div className="flex items-center gap-2 text-emerald-800 text-sm">
                  <i className="fa-solid fa-location-dot opacity-50"></i>
                  <span>Edificio Central, Piso 4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evento 2 */}
          <div className="flex gap-4 relative">
            <div className="absolute left-[39px] top-6 bottom-[-30px] w-0.5 bg-slate-200"></div>
            
            <div className="w-16 flex flex-col items-end shrink-0 pt-1">
              <span className="text-sm font-bold text-blue-600">11:15</span>
              <span className="text-xs text-blue-400">AM</span>
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="absolute -left-6 top-2 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-slate-50 ring-opacity-100 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              
              <div className="bg-white rounded-2xl p-4 border-l-4 border-l-blue-500 border-t border-r border-b border-slate-200 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">EN CURSO</div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 pr-12">Inspección Periódica</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  <i className="fa-regular fa-clock mr-1"></i> 11:15 - 13:00
                </p>
                <div className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                  <i className="fa-solid fa-location-dot opacity-50"></i>
                  <span>Condominio Las Rosas, Providencia</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    Ver Formulario
                  </button>
                  <button className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <i className="fa-solid fa-route"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="h-6"></div>

          {/* Evento 3 */}
          <div className="flex gap-4 relative">
            <div className="w-16 flex flex-col items-end shrink-0 pt-1">
              <span className="text-sm font-bold text-slate-700">15:00</span>
              <span className="text-xs text-slate-400">PM</span>
            </div>
            
            <div className="flex-1 relative z-10">
              <div className="absolute -left-6 top-2 w-3 h-3 bg-orange-400 rounded-full ring-4 ring-slate-50"></div>
              
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm opacity-80">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">Urgencia: Fuga Menor</h3>
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded">PENDIENTE</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  <i className="fa-regular fa-clock mr-1"></i> 15:00 - 16:30
                </p>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <i className="fa-solid fa-location-dot opacity-50"></i>
                  <span>Restaurant Bella Italia, Ñuñoa</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-24"></div> {/* Spacer for bottom bar + FAB */}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="absolute bottom-24 right-6 w-14 h-14 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/40 flex items-center justify-center text-2xl hover:bg-orange-600 hover:scale-105 transition-all active:scale-95 z-40">
        <i className="fa-solid fa-plus"></i>
      </button>

    </div>
  );
}
