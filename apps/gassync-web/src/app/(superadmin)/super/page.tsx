'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Company {
  id: string;
  name: string;
  rut: string;
  contactEmail: string;
  monthlyFee: number;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
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

  // Modal State
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    contactEmail: '',
    monthlyFee: 150000,
    crm: true,
    portal: false
  });

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
        monthlyFee: Number(formData.monthlyFee),
        paymentStatus: 'PAID', // Al iniciar, asumimos que pagó la inscripción
        modules: {
          crm: formData.crm,
          portal: formData.portal
        },
        status: 'ACTIVE',
        createdAt: serverTimestamp()
      });
      
      setIsModalOpen(false);
      setFormData({ name: '', rut: '', contactEmail: '', monthlyFee: 150000, crm: true, portal: false });
      await fetchCompanies();
    } catch (error) {
      console.error("Error al crear empresa:", error);
      alert("Hubo un error al crear la empresa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePaymentStatus = async (companyId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : currentStatus === 'PENDING' ? 'OVERDUE' : 'PAID';
    try {
      await updateDoc(doc(db, 'companies', companyId), {
        paymentStatus: nextStatus
      });
      // Actualización optimista
      setCompanies(companies.map(c => c.id === companyId ? { ...c, paymentStatus: nextStatus as any } : c));
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Tenants (Empresas)</h2>
          <p className="text-slate-400 mt-1">Gestión global de inquilinos y control de acceso.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98] flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Nueva Empresa
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <h3 className="text-lg font-bold text-white">Directorio de Clientes SaaS</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Empresa / RUT</th>
                <th className="px-6 py-4">Módulos</th>
                <th className="px-6 py-4">Tarifa Mensual</th>
                <th className="px-6 py-4">Estado de Pago</th>
                <th className="px-6 py-4">Acceso</th>
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
                  <tr key={company.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{company.name}</p>
                      <p className="font-mono text-xs text-slate-500 mt-1">{company.rut}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {company.modules?.crm && <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">CRM</span>}
                        {company.modules?.portal && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">Portal</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      ${company.monthlyFee?.toLocaleString('es-CL') || '0'}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => togglePaymentStatus(company.id, company.paymentStatus || 'PENDING')}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          company.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 
                          company.paymentStatus === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                        }`}
                        title="Clic para cambiar estado"
                      >
                        {company.paymentStatus === 'PAID' ? 'AL DÍA' : company.paymentStatus === 'OVERDUE' ? 'MOROSO' : 'PENDIENTE'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {company.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span> Suspendido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-white px-2 transition-colors opacity-0 group-hover:opacity-100">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-building text-purple-500"></i> Registrar Empresa
              </h3>
            </div>
            
            <form onSubmit={handleCreateCompany} className="p-6 space-y-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre Legal (Razón Social)</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" placeholder="Ej. Gas Santiago SpA" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">RUT</label>
                    <input type="text" required value={formData.rut} onChange={(e) => setFormData({...formData, rut: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" placeholder="76.123.456-7" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Tarifa Mensual ($)</label>
                    <input type="number" required value={formData.monthlyFee} onChange={(e) => setFormData({...formData, monthlyFee: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" placeholder="150000" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-slate-300 mb-3">Módulos a Activar</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-slate-700 rounded-xl bg-slate-950/50 hover:border-purple-500/50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={formData.crm} onChange={(e) => setFormData({...formData, crm: e.target.checked})} className="mt-1 w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-600" />
                    <div>
                      <p className="text-white font-medium text-sm">CRM y Gestión Interna</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 border border-slate-700 rounded-xl bg-slate-950/50 hover:border-purple-500/50 cursor-pointer transition-colors">
                    <input type="checkbox" checked={formData.portal} onChange={(e) => setFormData({...formData, portal: e.target.checked})} className="mt-1 w-4 h-4 text-purple-600 bg-slate-800 border-slate-600 rounded focus:ring-purple-600" />
                    <div>
                      <p className="text-white font-medium text-sm">Portal Público de Clientes</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                  {isSubmitting ? 'Creando...' : 'Crear y Asignar Espacio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
