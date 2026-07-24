'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function InspectorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.push('/login');
    } else if (profile.role !== 'INSPECTOR' && profile.role !== 'ADMIN' && profile.role !== 'SUPERADMIN') {
      router.push('/dashboard');
    }
  }, [profile, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 md:bg-slate-950 flex items-center justify-center font-sans">
      
      {/* 
        Contenedor Principal: 
        En móviles (w-full h-full), es la app directa.
        En PC (md:w-[400px] md:h-[800px]), simula la pantalla del celular.
      */}
      <div className="w-full h-[100dvh] md:w-[390px] md:h-[844px] md:relative md:rounded-[3rem] md:border-[14px] md:border-slate-900 md:shadow-2xl md:overflow-hidden bg-navy-950 flex flex-col transition-all duration-300">
        
        {/* Notch falso para PC (solo estético) */}
        <div className="hidden md:block absolute top-0 inset-x-0 h-7 z-50 pointer-events-none">
          <div className="w-40 h-7 bg-slate-900 mx-auto rounded-b-3xl"></div>
        </div>

        {/* Contenido de la App del Inspector */}
        <main className="flex-1 overflow-hidden flex flex-col relative z-0">
          {children}
        </main>
        
      </div>

    </div>
  );
}
