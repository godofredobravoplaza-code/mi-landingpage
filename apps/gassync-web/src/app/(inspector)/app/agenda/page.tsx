'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

export default function InspectorAgenda() {
  const { profile } = useAuth();
  const [selectedDay, setSelectedDay] = useState(3); // Ejemplo: 3 = Miércoles
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Escuchar tareas en tiempo real
  useEffect(() => {
    if (!profile?.id) return;

    // TODO: En producción agregar índice en Firestore para ordenar por createdAt
    const q = query(
      collection(db, 'tasks'),
      where('inspectorId', '==', profile.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar localmente por mientras (si createdAt existe)
      tasksData.sort((a: any, b: any) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.toMillis() - b.createdAt.toMillis();
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks in real time:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const days = [
    { day: 'L', date: 12 },
    { day: 'M', date: 13 },
    { day: 'X', date: 14 },
    { day: 'J', date: 15 },
    { day: 'V', date: 16 },
    { day: 'S', date: 17 },
    { day: 'D', date: 18 },
  ];

  // Helper para colores según tipo y estado
  const getTaskStyle = (type: string, status: string) => {
    if (status === 'COMPLETADO') return { dot: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', subText: 'text-emerald-700' };
    if (type === 'Urgencia') return { dot: 'bg-orange-400', bg: 'bg-white', border: 'border-orange-200', text: 'text-slate-800', subText: 'text-slate-500' };
    return { dot: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]', bg: 'bg-white', border: 'border-l-4 border-l-blue-500 border-t border-r border-b border-slate-200', text: 'text-slate-800', subText: 'text-slate-500' };
  };

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

          {loading ? (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-slate-400 p-8 mt-10">
              <i className="fa-solid fa-mug-hot text-5xl mb-4 opacity-50"></i>
              <p className="font-medium text-slate-500">No tienes tareas asignadas</p>
              <p className="text-sm mt-1">Tu agenda está despejada por ahora.</p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const style = getTaskStyle(task.type, task.status);
              const timeParts = task.time.split(' - ')[0] || task.time;
              const hour = timeParts.split(':')[0] || '12';
              const isAM = parseInt(hour) < 12;

              return (
                <div key={task.id} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {index !== tasks.length - 1 && (
                    <div className="absolute left-[39px] top-6 bottom-[-30px] w-0.5 bg-slate-200"></div>
                  )}
                  
                  <div className="w-16 flex flex-col items-end shrink-0 pt-1">
                    <span className="text-sm font-bold text-slate-700">{timeParts}</span>
                    <span className="text-xs text-slate-400">{isAM ? 'AM' : 'PM'}</span>
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    {/* Dot */}
                    <div className={`absolute -left-6 top-2 w-3 h-3 rounded-full ring-4 ring-slate-50 ${style.dot}`}></div>
                    
                    <div className={`rounded-2xl p-4 shadow-sm relative overflow-hidden ${style.bg} ${style.border}`}>
                      
                      {task.status === 'PENDIENTE' && (
                        <div className="absolute top-0 right-0 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">PENDIENTE</div>
                      )}
                      
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold text-lg pr-12 ${style.text}`}>{task.title}</h3>
                        {task.status === 'COMPLETADO' && <i className="fa-solid fa-check-circle text-emerald-500"></i>}
                      </div>
                      
                      <p className={`text-xs font-medium mb-3 ${style.subText}`}>
                        <i className="fa-regular fa-clock mr-1"></i> {task.time}
                        <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] uppercase">{task.type}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                        <i className="fa-solid fa-location-dot opacity-50"></i>
                        <span>{task.location}</span>
                      </div>
                      
                      {task.status !== 'COMPLETADO' && (
                        <div className="flex gap-2">
                          <button className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                            Iniciar Tarea
                          </button>
                          <button className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <i className="fa-solid fa-route"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
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
