'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No está logueado
        router.push('/login');
      } else if (profile?.role !== 'SUPERADMIN') {
        // Está logueado pero no es un Dios del Sistema
        console.warn("Acceso denegado: Se requiere rol SUPERADMIN.");
        router.push('/dashboard');
      } else {
        // Es Super Admin!
        setIsAuthorized(true);
      }
    }
  }, [user, profile, loading, router]);

  // Pantalla de carga mientras lee la base de datos
  if (loading || (!isAuthorized && profile?.role === 'SUPERADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-400 font-medium animate-pulse tracking-widest text-sm uppercase">Verificando Protocolo de Dios...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, retorna null para evitar destellos antes del redireccionamiento
  if (!isAuthorized) {
    return null;
  }

  // Renderiza el panel de SuperAdmin
  return <>{children}</>;
}
