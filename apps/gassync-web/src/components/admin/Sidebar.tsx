import Link from 'next/link';

// ----------------------------------------------------------------------
// COMPONENTE: Sidebar (Navegación Lateral del Admin)
// ----------------------------------------------------------------------
// Este componente representa el menú de navegación izquierdo del CRM.
// Centraliza los enlaces para evitar duplicidad de código.
// ----------------------------------------------------------------------

export default function Sidebar() {
  return (
    <aside className="w-64 bg-navy-950 border-r border-slate-800 flex flex-col transition-all duration-300 z-20 h-full">
      {/* Logo y Branding */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20 flex items-center justify-center">
            <i className="fa-solid fa-fire-flame-curved text-white text-lg"></i>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CertiGas <span className="text-orange-500">AI</span></span>
        </Link>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 text-orange-500 font-semibold border border-orange-500/20 shadow-sm transition-colors">
          <i className="fa-solid fa-chart-pie w-5"></i>
          <span>Resumen Analítico</span>
        </Link>
        <Link href="/directorio" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
          <i className="fa-solid fa-building-user w-5"></i>
          <span className="font-medium">Directorio de Clientes</span>
        </Link>
        <Link href="/inspectors" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
          <i className="fa-solid fa-hard-hat w-5"></i>
          <span className="font-medium">Inspectores (Dispatch)</span>
        </Link>
        <Link href="/cotizador" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
          <i className="fa-solid fa-file-invoice-dollar w-5"></i>
          <span className="font-medium">Cotizaciones</span>
        </Link>
      </nav>

      {/* Perfil del Usuario Logueado */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center border border-blue-700 text-blue-300 font-bold">
            GA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Gast Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@gast.cl</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
