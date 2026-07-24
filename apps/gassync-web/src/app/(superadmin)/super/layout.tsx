import SuperAdminRoute from '@/components/SuperAdminRoute';
import Link from 'next/link';
import '@/app/globals.css';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminRoute>
      <div className="bg-slate-950 text-slate-300 font-sans min-h-screen">
        {/* Navbar minimalista para Super Admin */}
        <nav className="bg-slate-900 border-b border-purple-900/30 px-6 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-8 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <i className="fa-solid fa-bolt text-white"></i>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">GasSync OMNI</h1>
                <span className="text-xs text-purple-400 font-mono tracking-widest uppercase">Superuser Protocol</span>
              </div>
            </div>
            
            {/* Tabs de navegación */}
            <div className="hidden md:flex items-center gap-1 ml-8 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
              <Link href="/super" className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-slate-800 text-slate-400">
                <i className="fa-solid fa-building mr-2"></i> Tenants
              </Link>
              <Link href="/super/users" className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-slate-800 text-slate-400">
                <i className="fa-solid fa-users mr-2"></i> Usuarios
              </Link>
              <Link href="/super/finance" className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-slate-800 text-slate-400">
                <i className="fa-solid fa-chart-line mr-2"></i> Finanzas
              </Link>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors" title="Volver al inicio">
              <i className="fa-solid fa-right-from-bracket"></i>
            </Link>
          </div>
        </nav>

        {/* Contenido Principal */}
        <main className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SuperAdminRoute>
  );
}
