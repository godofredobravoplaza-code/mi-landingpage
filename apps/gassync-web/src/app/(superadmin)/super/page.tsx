'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    contactEmail: '',
    crm: true,
    portal: false
  });

  const stats = {
    totalTenants: companies.length,
    activeUsers: companies.length * 5, // Ficticio
    mrr: `$${companies.length * 150}`, // Ficticio
    serverLoad: '12%'
  };

  const fetchCompanies = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'companies'), {
        name: formData.name,
        rut: formData.rut,
        contactEmail: formData.contactEmail,
        modules: {
          crm: formData.crm,
          portal: formData.portal
        },
        status: 'ACTIVE',
        createdAt: serverTimestamp()
      });
      
      // Limpiar y recargar
      setIsModalOpen(false);
      setFormData({ name: '', rut: '', contactEmail: '', crm: true, portal: false });
      await fetchCompanies();
    } catch (error) {
      console.error("Error al crear empresa:", error);
      alert("Hubo un error al crear la empresa. Revisa la consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Tenants (Empresas)</h2>
          <p className="text-slate-400 mt-1">Gestión global del ecosistema SaaS</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center gap-2"
        >
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
              <p className="text-slate-400 text-sm font-medium">Usuarios Estimados</p>
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
                        {company.modules.crm && <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">CRM</span>}
                        {company.modules.portal && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">Portal</span>}
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

      {/* Modal de Nueva Empresa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-building text-purple-500"></i> Registrar Empresa
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateCompany} className="p-6 space-y-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre Legal (Razón Social)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="Ej. Gas Santiago SpA"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">RUT / Identificador</label>
                    <input 
                      type="text" 
                      required
                      value={formData.rut}
                      onChange={(e) => setFormData({...formData, rut: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                      placeholder="76.123.456-7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Correo de Contacto</label>
                    <input 
                      type="email" 
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                      placeholder="admin@empresa.cl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-300 mb-3">Módulos a Activar</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-slate-700 rounded-xl bg-slate-950/50 hover:border-purple-500/50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.crm}
                      onChange={(e) => setFormData({...formData, crm: e.target.checked})}
                      className="mt-1 w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-600 focus:ring-2"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">CRM y Gestión Interna</p>
                      <p className="text-slate-400 text-xs mt-0.5">Permite a la empresa usar el panel azul para gestionar proyectos, inspectores y clientes.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 border border-slate-700 rounded-xl bg-slate-950/50 hover:border-purple-500/50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.portal}
                      onChange={(e) => setFormData({...formData, portal: e.target.checked})}
                      className="mt-1 w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-600 focus:ring-2"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">Portal Público de Clientes</p>
                      <p className="text-slate-400 text-xs mt-0.5">Habilita la búsqueda pública de certificados para los clientes de esta empresa.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin"></i> Creando...</> : 'Crear y Asignar Espacio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
