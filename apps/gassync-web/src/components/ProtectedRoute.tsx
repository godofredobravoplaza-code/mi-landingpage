'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Redirigir según el rol del usuario si no tiene acceso
        if (profile.role === 'INSPECTOR') {
          router.push('/app');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [user, profile, loading, router, allowedRoles]);

  // Mostrar una pantalla de carga sutil mientras verifica la sesión
  if (loading || (!profile && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">Verificando accesos...</p>
        </div>
      </div>
    );
  }

  // Si no está cargando y no hay usuario, retornamos null porque el useEffect nos redirigirá
  if (!user || (allowedRoles && profile && !allowedRoles.includes(profile.role))) {
    return null;
  }

  // Si hay usuario, renderizamos la pantalla protegida
  return <>{children}</>;
}
