'use client';

import { useAuth } from '@/contexts/AuthContext';
import '@/app/globals.css';

export default function SuspendedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-red-900/50 rounded-3xl p-8 text-center shadow-2xl shadow-red-900/10">
        
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-ban text-4xl text-red-500"></i>
        </div>
        
        <h1 className="text-3xl font-black text-white mb-3">Servicio Suspendido</h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          El acceso a GasSync para esta cuenta empresarial ha sido suspendido temporalmente por el Administrador del Sistema. 
          <br /><br />
          Por favor, contacta a tu departamento de pagos o al proveedor del software para restaurar el servicio.
        </p>

        <button 
          onClick={() => logout()}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
      
      <p className="text-slate-600 text-sm mt-8">
        Sistema Propiedad de GasSync OMNI
      </p>
    </div>
  );
}
