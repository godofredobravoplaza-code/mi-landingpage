// ----------------------------------------------------------------------
// COMPONENTE: Topbar (Cabecera Superior del Admin)
// ----------------------------------------------------------------------
// Este componente representa la barra superior de acciones globales.
// Recibe props para dinamizar el título y la descripción según la página.
// ----------------------------------------------------------------------

interface TopbarProps {
  title: string;
  subtitle: string;
  actionButtonLabel?: string;
  actionButtonIcon?: string;
}

export default function Topbar({ title, subtitle, actionButtonLabel, actionButtonIcon }: TopbarProps) {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800/50 z-10 bg-navy-900/80 backdrop-blur-md shrink-0 w-full">
      {/* Título de la Sección */}
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>

      {/* Acciones Globales */}
      <div className="flex items-center gap-4">
        {actionButtonLabel && (
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-2">
            {actionButtonIcon && <i className={actionButtonIcon}></i>}
            {actionButtonLabel}
          </button>
        )}
      </div>
    </header>
  );
}
