'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function InspectorSettings() {
  const { profile, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Header */}
      <div className="bg-navy-950 pt-12 pb-10 px-6 shadow-md z-10 shrink-0 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-10 -left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
        
        <h2 className="text-white font-bold text-xl tracking-tight mb-6 relative z-10">Mi Perfil</h2>
        
        <div className="flex flex-col items-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 shadow-xl flex items-center justify-center text-white font-bold text-4xl mb-4 relative">
            {profile?.email?.charAt(0).toUpperCase() || 'U'}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-navy-950 flex items-center justify-center text-xs hover:bg-blue-500 transition-colors">
              <i className="fa-solid fa-camera"></i>
            </button>
          </div>
          <h3 className="text-white font-bold text-xl">{profile?.name || profile?.email?.split('@')[0]}</h3>
          <p className="text-blue-400 text-sm font-medium">{profile?.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative -mt-4 z-20">
        
        {/* Settings Group 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <i className="fa-solid fa-user-pen"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-700">Datos Personales</h4>
              <p className="text-xs text-slate-500">Actualizar nombre y teléfono</p>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-300"></i>
          </button>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-700">Seguridad</h4>
              <p className="text-xs text-slate-500">Cambiar contraseña</p>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-300"></i>
          </button>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <i className="fa-solid fa-bell"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-700">Notificaciones</h4>
              <p className="text-xs text-slate-500">Alertas de urgencias y rutas</p>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-300"></i>
          </button>
        </div>

        {/* Settings Group 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-700">Sincronización en 2do plano</h4>
                <p className="text-xs text-slate-500">Subir formularios sin conexión</p>
              </div>
            </div>
            {/* Falso toggle switch */}
            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer opacity-80">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>

          <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-700">Acerca de GasSync</h4>
              <p className="text-xs text-slate-500">Versión 1.0.2 (Build 45)</p>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-300"></i>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center gap-3 hover:bg-red-50 transition-colors text-red-600 active:scale-95"
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span className="font-bold">Cerrar Sesión</span>
        </button>

        <div className="h-24"></div> {/* Spacer for bottom bar */}
      </div>
      
    </div>
  );
}
