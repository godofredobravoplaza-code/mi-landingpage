'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/admin/Topbar';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------
// PÁGINA: Dispatch de Inspectores
// ----------------------------------------------------------------------

export default function InspectorsPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [activeInspector, setActiveInspector] = useState<any>(null);
  const [inspectors, setInspectors] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', location: '', time: '', type: 'Inspección' });

  useEffect(() => {
    if (loading) return;
    
    // Proteger ruta
    if (profile?.role !== 'SUPERADMIN' && profile?.role !== 'ADMIN' && profile?.role !== 'BACKOFFICE') {
      router.push('/dashboard');
      return;
    }

    const fetchInspectors = async () => {
      try {
        let q;
        if (profile.role === 'SUPERADMIN') {
          // SuperAdmin ve todos los inspectores (o los de un tenant específico en el futuro)
          q = query(
            collection(db, 'users'),
            where('role', '==', 'INSPECTOR')
          );
        } else {
          // Admin normal necesita tener companyId
          if (!profile.companyId) {
            setLoadingData(false);
            return;
          }
          q = query(
            collection(db, 'users'), 
            where('companyId', '==', profile.companyId),
            where('role', '==', 'INSPECTOR')
          );
        }
        
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInspectors(data);
      } catch (error) {
        console.error("Error fetching inspectors:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchInspectors();
  }, [profile, loading, router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInspector) return;
    
    setSavingTask(true);
    try {
      // Usamos el companyId del inspector para que la tarea quede en su empresa
      const taskCompanyId = profile?.companyId || activeInspector.companyId || 'global';
      
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        status: 'PENDIENTE',
        inspectorId: activeInspector.id,
        companyId: taskCompanyId,
        createdAt: serverTimestamp()
      });
      setShowTaskModal(false);
      setNewTask({ title: '', location: '', time: '', type: 'Inspección' });
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setSavingTask(false);
    }
  };

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
            {loadingData ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : inspectors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-6">
                <i className="fa-solid fa-hard-hat text-4xl mb-4 opacity-50"></i>
                <p>No hay inspectores activos en ruta.</p>
                <p className="text-xs mt-2">Agrega personal desde "Mi Equipo".</p>
              </div>
            ) : (
              inspectors.map((inspector) => (
                <div 
                  key={inspector.id}
                  onClick={() => setActiveInspector(inspector)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activeInspector?.id === inspector.id 
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-navy-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex flex-shrink-0 items-center justify-center font-bold text-white relative">
                      {inspector.email.charAt(0).toUpperCase()}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{inspector.name || inspector.email}</h4>
                      <p className="text-xs text-blue-400">En Ruta - Esperando asignación</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Agenda View */}
        <div className="w-2/3 glass-card rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden bg-slate-800/30 backdrop-blur-md h-full items-center justify-center relative">
          
          {!activeInspector ? (
            <div className="text-center text-slate-500 p-8">
              <i className="fa-solid fa-map-location-dot text-6xl mb-6 opacity-30"></i>
              <h3 className="text-xl font-bold text-white mb-2">Panel de Despacho (Dispatch)</h3>
              <p className="max-w-md mx-auto">Selecciona un inspector de la lista para ver su ruta, progreso actual y ubicación GPS en tiempo real.</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col">
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80 backdrop-blur-md z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white">{activeInspector.name || activeInspector.email}</h2>
                  <p className="text-blue-400"><i className="fa-solid fa-location-dot mr-2"></i>Ubicación GPS Activa</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    <i className="fa-regular fa-message mr-2"></i>Mensaje
                  </button>
                  <button 
                    onClick={() => setShowTaskModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>Asignar Tarea
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-900 relative flex items-center justify-center">
                {/* Simulador de Mapa */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="text-center text-slate-500 relative z-10">
                  <i className="fa-solid fa-map text-6xl mb-4 opacity-50"></i>
                  <p>Mapa de ruta de {activeInspector.name || activeInspector.email}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal Asignar Tarea */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Asignar Tarea</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Título de la Tarea</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Inspección Condominio Los Ríos"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Dirección</label>
                <div className="relative">
                  <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input 
                    type="text" 
                    required
                    placeholder="Av. Providencia 1234"
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Horario Sugerido</label>
                  <div className="relative">
                    <i className="fa-regular fa-clock absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. 10:00 - 11:30"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="Inspección">Inspección</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Urgencia">Urgencia</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={savingTask}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {savingTask ? 'Guardando...' : 'Asignar a Inspector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
