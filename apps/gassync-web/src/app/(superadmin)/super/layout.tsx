import SuperAdminRoute from '@/components/SuperAdminRoute';
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
        <nav className="bg-slate-900 border-b border-purple-900/30 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <i className="fa-solid fa-bolt text-white"></i>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">GasSync OMNI</h1>
              <span className="text-xs text-purple-400 font-mono tracking-widest uppercase">Superuser Protocol</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
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
