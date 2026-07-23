import React from 'react';
import Navbar from '@/components/client/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full p-8 space-y-8">
        {children}
      </main>
    </div>
  );
}
