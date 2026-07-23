import React from 'react';

// ----------------------------------------------------------------------
// COMPONENTE: KpiCard
// ----------------------------------------------------------------------
// Tarjeta individual para mostrar un Indicador Clave de Rendimiento (KPI).
// Cumple con SRP (Solo renderiza la info de 1 KPI con su diseño base).
// ----------------------------------------------------------------------

interface KpiCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: string;
  bgGlowClass: string;
  iconBgClass: string;
  trendColorClass: string;
  trendIcon: string;
  trendText: string;
  trendSubtext: string;
}

export default function KpiCard({
  title,
  value,
  icon,
  bgGlowClass,
  iconBgClass,
  trendColorClass,
  trendIcon,
  trendText,
  trendSubtext,
}: KpiCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-slate-700/50 bg-slate-800/30 backdrop-blur-md transition-all hover:bg-slate-800/50">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl transition-colors ${bgGlowClass}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClass}`}>
          <i className={icon}></i>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-slate-400 relative z-10">
        <span className={`${trendColorClass} font-bold mr-1`}>
          <i className={trendIcon}></i> {trendText}
        </span>
        {trendSubtext}
      </div>
    </div>
  );
}
