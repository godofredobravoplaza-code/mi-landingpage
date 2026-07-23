import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import '@/app/globals.css';

// ----------------------------------------------------------------------
// ARCHIVO: layout.tsx (Layout del Grupo de Rutas Admin)
// ----------------------------------------------------------------------
// Este Layout envuelve a todas las rutas dentro de (admin).
// Su responsabilidad es inyectar el Sidebar a la izquierda y mantener
// un contenedor central para que Topbar y los hijos se rendericen.
// ----------------------------------------------------------------------

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-navy-900 text-slate-300 font-sans h-screen overflow-hidden flex">
      {/* Navegación Lateral Constante */}
      <Sidebar />

      {/* Área Principal Dinámica */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Efecto visual de fondo (Blur) */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full mix-blend-screen blur-[120px] pointer-events-none z-0"></div>

        {/* El contenido específico de cada página (dashboard, directorio, etc.) se inyectará aquí */}
        {children}
      </main>
    </div>
  );
}
