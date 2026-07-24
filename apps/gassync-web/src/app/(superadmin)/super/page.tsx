'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Tipos de datos para el sistema multi-tenant
interface Company {
  id: string;
  name: string;
  rut: string;
  contactEmail: string;
  modules: {
    crm: boolean;
    portal: boolean;
  };
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: any;
}

export default function SuperDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats simuladas por ahora
  const stats = {
    totalTenants: companies.length,
    activeUsers: 142,
    mrr: '$1,250',
    serverLoad: '12%'
  };

  useEffect(() => {
    // Función para cargar las empresas reales desde Firestore
    const fetchCompanies = async () => {
      try {
        const q = query(collection(db, 'companies'));
        const querySnapshot = await getDocs(q);
        const companiesData: Company[] = [];
        querySnapshot.forEach((doc) => {
          companiesData.push({ id: doc.id, ...doc.data() } as Company);
        });
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error cargando empresas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Tenants (Empresas)</h2>
          <p className="text-slate-400 mt-1">Gestión global del ecosistema SaaS</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Nueva Empresa
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Empresas</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.totalTenants}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-building text-blue-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Usuarios Globales</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-users text-emerald-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Ingresos Estimados (MRR)</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.mrr}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-sack-dollar text-purple-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Carga de Base de Datos</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.serverLoad}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-server text-orange-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Tenants */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Empresas Activas</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <i className="fa-solid fa-search"></i>
            </div>
            <input 
              type="text" 
              className="bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-64 transition-colors"
              placeholder="Buscar por RUT o Nombre..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">RUT</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Módulos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Cargando inquilinos...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-4">
                      <i className="fa-solid fa-building-circle-xmark text-slate-400 text-xl"></i>
                    </div>
                    <h3 className="text-white font-medium mb-1">Sin Empresas Registradas</h3>
                    <p className="text-slate-400">El sistema está vacío. Registra tu primer cliente.</p>
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{company.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{company.rut}</td>
                    <td className="px-6 py-4">{company.contactEmail}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {company.modules.crm && <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">CRM</span>}
                        {company.modules.portal && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs">Portal</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {company.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span> Suspendido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-white px-2 transition-colors">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
