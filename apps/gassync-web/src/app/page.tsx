import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black p-4">
      <div className="max-w-3xl w-full text-center space-y-12 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Encabezado */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <i className="fa-solid fa-fire-flame-simple text-4xl text-white"></i>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">GasSync</h1>
          <p className="text-xl text-slate-400 font-medium">Plataforma de Gestión Integral de Instalaciones</p>
        </div>

        {/* Botones de Acceso */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
          
          <Link href="/dashboard" className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-chart-pie"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Administración</h2>
            <p className="text-slate-400 text-sm">Ingresar al CRM, controlar métricas, inspectores y gestionar operaciones.</p>
            
            <div className="mt-8 flex items-center text-blue-400 font-medium text-sm group-hover:translate-x-2 transition-transform">
              Entrar al Dashboard <i className="fa-solid fa-arrow-right ml-2"></i>
            </div>
          </Link>

          <Link href="/portal" className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="w-14 h-14 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-building-user"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Portal de Clientes</h2>
            <p className="text-slate-400 text-sm">Vista para que los residentes y administradores consulten sus inspecciones.</p>
            
            <div className="mt-8 flex items-center text-emerald-400 font-medium text-sm group-hover:translate-x-2 transition-transform">
              Entrar al Portal <i className="fa-solid fa-arrow-right ml-2"></i>
            </div>
          </Link>

        </div>
        
        <p className="text-xs text-slate-500 font-medium mt-12">v2.0 • Prototipo Funcional</p>

      </div>
    </main>
  );
}
