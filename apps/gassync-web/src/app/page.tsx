export default function Home() {
  // ----------------------------------------------------------------------
  // COMPONENTE: Home (Página Principal - Landing o Redirección)
  // ----------------------------------------------------------------------
  // Este componente actúa como la página de inicio del proyecto Next.js.
  // Por ahora, mostrará un mensaje de que el sistema está en construcción,
  // cumpliendo con la regla de documentar claramente el código.
  // ----------------------------------------------------------------------
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">GasSync Web App</h1>
        <p className="text-slate-500">El sistema se encuentra en proceso de migración a React/Next.js.</p>
        <p className="text-sm font-bold text-brand-500 mt-8 uppercase tracking-wider">Reglas de Oro Activas</p>
      </div>
    </main>
  );
}
