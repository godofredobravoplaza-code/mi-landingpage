'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Company {
  id: string;
  name: string;
  monthlyFee: number;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
}

export default function FinanceDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuraciones fijas o estimadas del servidor (Para el prototipo)
  const SERVER_COST = 25000; // Ej: $25.000 CLP en Vercel/Firebase al mes
  const DATABASE_COST = 10000; // Ej: $10.000 CLP base de datos

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const q = query(collection(db, 'companies'));
        const querySnapshot = await getDocs(q);
        const companiesData: Company[] = [];
        querySnapshot.forEach((doc) => {
          companiesData.push({ id: doc.id, ...doc.data() } as Company);
        });
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error cargando datos financieros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinances();
  }, []);

  // Cálculos Financieros
  const totalRevenue = companies.reduce((acc, curr) => acc + (curr.monthlyFee || 0), 0);
  const totalCollected = companies.filter(c => c.paymentStatus === 'PAID').reduce((acc, curr) => acc + (curr.monthlyFee || 0), 0);
  const totalPending = companies.filter(c => c.paymentStatus !== 'PAID').reduce((acc, curr) => acc + (curr.monthlyFee || 0), 0);
  
  const totalCosts = SERVER_COST + DATABASE_COST;
  const netProfit = totalCollected - totalCosts;
  
  const arr = totalRevenue * 12; // Ingreso Anual Recurrente

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Análisis Financiero</h2>
          <p className="text-slate-400 mt-1">Rentabilidad, cobros y proyección del SaaS.</p>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-medium text-slate-300">Monitoreo en Tiempo Real</span>
        </div>
      </div>

      {/* KPI Financieros Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MRR */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 font-medium mb-1">MRR (Ingreso Mensual)</p>
          <h3 className="text-4xl font-black text-white mb-2">${totalRevenue.toLocaleString('es-CL')}</h3>
          <p className="text-sm text-emerald-400 flex items-center gap-1">
            <i className="fa-solid fa-arrow-trend-up"></i> Proyección ARR: ${arr.toLocaleString('es-CL')}
          </p>
        </div>

        {/* Recaudado vs Pendiente */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 font-medium mb-1">Caja Actual (Pagado)</p>
          <h3 className="text-4xl font-black text-white mb-2">${totalCollected.toLocaleString('es-CL')}</h3>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 mb-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: totalRevenue > 0 ? `${(totalCollected/totalRevenue)*100}%` : '0%' }}></div>
          </div>
          <p className="text-sm text-yellow-400 flex items-center gap-1">
            <i className="fa-solid fa-triangle-exclamation"></i> Pendiente cobro: ${totalPending.toLocaleString('es-CL')}
          </p>
        </div>

        {/* Rentabilidad */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 font-medium mb-1">Utilidad Neta Estimada</p>
          <h3 className={`text-4xl font-black mb-2 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${netProfit.toLocaleString('es-CL')}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <i className="fa-solid fa-server"></i> Costos Servidor deducidos: ${totalCosts.toLocaleString('es-CL')}
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Desglose de Morosidad */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Estado de Pagos por Cliente</h3>
          
          <div className="space-y-3">
            {loading ? (
              <p className="text-slate-500 text-center py-4">Cargando...</p>
            ) : companies.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay empresas registradas.</p>
            ) : (
              companies.map(company => (
                <div key={company.id} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div>
                    <h4 className="text-white font-medium">{company.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tarifa: ${company.monthlyFee?.toLocaleString('es-CL')}</p>
                  </div>
                  <div>
                    {company.paymentStatus === 'PAID' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">AL DÍA</span>
                    ) : company.paymentStatus === 'OVERDUE' ? (
                      <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">MOROSO</span>
                    ) : (
                      <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">PENDIENTE</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gastos de Infraestructura */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold text-white mb-6">Estructura de Costos</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Vercel (Hosting UI)</span>
                <span className="text-white font-medium">${SERVER_COST.toLocaleString('es-CL')}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5">
                <div className="bg-slate-500 h-1.5 rounded-full w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Firebase (Base de Datos)</span>
                <span className="text-white font-medium">${DATABASE_COST.toLocaleString('es-CL')}</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full w-full"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-6">
              <p className="text-xs text-slate-500 mb-2">Nota Estratégica:</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Actualmente estás en los planes gratuitos de infraestructura. Los costos mostrados son una proyección para cuando el sistema escale. Mientras te mantengas en la capa gratuita, tu <span className="text-emerald-400 font-bold">Utilidad Neta es del 100%</span>.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
