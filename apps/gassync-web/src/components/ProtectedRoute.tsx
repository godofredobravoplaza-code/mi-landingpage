'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mostrar una pantalla de carga sutil mientras verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si no está cargando y no hay usuario, retornamos null porque el useEffect nos redirigirá
  if (!user) {
    return null;
  }

  // Si hay usuario, renderizamos la pantalla protegida
  return <>{children}</>;
}
