'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { auth, db, app as primaryApp } from '@/lib/firebase/config';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Company {
  id: string;
  name: string;
  rut: string;
  contactEmail: string;
  monthlyFee: number;
  billingDay: number;
  expirationDate?: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  modules: {
    crm: boolean;
    portal: boolean;
  };
  status: 'ACTIVE' | 'SUSPENDED';
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export default function CompanyDetail() {
  const params = useParams();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'companies', companyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompany({ id: docSnap.id, ...docSnap.data() } as Company);
      }

      const q = query(collection(db, 'users'), where('companyId', '==', companyId));
      const querySnapshot = await getDocs(q);
      const usersData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const toggleSuspension = async () => {
    if (!company) return;
    const newStatus = company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (confirm(`¿Estás seguro de ${newStatus === 'SUSPENDED' ? 'SUSPENDER' : 'ACTIVAR'} el servicio para ${company.name}?`)) {
      try {
        await updateDoc(doc(db, 'companies', company.id), { status: newStatus });
        setCompany({ ...company, status: newStatus });
        alert(`Servicio ${newStatus === 'SUSPENDED' ? 'suspendido' : 'activado'} correctamente.`);
      } catch (error) {
        console.error("Error cambiando estado:", error);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setIsSubmitting(true);
    try {
      const dataToSave = {
        name: formData.name,
        rut: formData.rut,
        contactEmail: formData.contactEmail,
        monthlyFee: Number(formData.monthlyFee),
        billingDay: Number(formData.billingDay),
        expirationDate: formData.expirationDate,
        modules: {
          crm: formData.crm,
          portal: formData.portal
        }
      };
      await updateDoc(doc(db, 'companies', company.id), dataToSave);
      setCompany({ ...company, ...dataToSave });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error guardando empresa:", error);
      alert("Error al actualizar los datos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = () => {
    if (!company) return;
    setFormData({
      name: company.name,
      rut: company.rut,
      contactEmail: company.contactEmail,
      monthlyFee: company.monthlyFee || 0,
      billingDay: company.billingDay || 1,
      expirationDate: company.expirationDate || '',
      crm: company.modules?.crm || false,
      portal: company.modules?.portal || false,
    });
    setIsEditModalOpen(true);
  };

  const handleResetPassword = async (email: string) => {
    if (confirm(`¿Enviar correo de recuperación de contraseña a ${email}?`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert(`Correo enviado con éxito a ${email}`);
      } catch (error) {
        console.error("Error enviando correo:", error);
        alert("Error al enviar el correo.");
      }
    }
  };

  const handleCreateAdmin = async (email: string, password: string) => {
    if (!company) return;
    try {
      // Usamos una app secundaria para no cerrar la sesión del superadmin actual
      const secondaryApp = initializeApp(primaryApp.options, 'SecondaryApp');
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;
      
      const newUser = {
        email,
        name: 'Administrador Cliente',
        role: 'ADMIN',
        companyId: company.id,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUser);
      
      setUsers([...users, { id: user.uid, ...newUser }]);
      alert(`Admin creado exitosamente con la clave: ${password}`);
    } catch (error: any) {
      console.error("Error creando admin:", error);
      alert(`Error al crear usuario: ${error.message}`);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = prompt(`Cambiar rol (Actual: ${currentRole}). Opciones: ADMIN, INSPECTOR, BACKOFFICE, CLIENT`, currentRole);
    if (newRole && ['ADMIN', 'INSPECTOR', 'BACKOFFICE', 'CLIENT'].includes(newRole.toUpperCase())) {
      try {
        await updateDoc(doc(db, 'users', userId), { role: newRole.toUpperCase() });
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole.toUpperCase() } : u));
      } catch (error) {
        console.error("Error actualizando rol:", error);
      }
    }
  };

  const handleRevokeAccess = async (userId: string, email: string) => {
    if (confirm(`⚠️ PELIGRO: ¿Estás seguro de expulsar a ${email} de la empresa?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Error revocando acceso:", error);
      }
    }
  };

  if (loading) return <div className="text-white p-8">Cargando datos del cliente...</div>;
  if (!company) return <div className="text-white p-8">Empresa no encontrada.</div>;

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* breadcrumb */}
      <div>
        <Link href="/super" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 mb-4 transition-colors w-max">
          <i className="fa-solid fa-arrow-left"></i> Volver a Tenants
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">{company.name}</h2>
            <p className="text-slate-400 mt-1 font-mono">RUT: {company.rut} | Contacto: {company.contactEmail}</p>
          </div>
          <button 
            onClick={openEditModal}
            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-slate-700 shadow-lg"
          >
            <i className="fa-solid fa-pen mr-2"></i> Editar Datos Generales
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Financiera */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl col-span-2">
          <h3 className="text-lg font-bold text-white mb-4"><i className="fa-solid fa-file-invoice-dollar text-emerald-500 mr-2"></i> Estado de Facturación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Tarifa Mensual</p>
              <p className="text-2xl font-black text-white">${company.monthlyFee?.toLocaleString('es-CL') || '0'}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Día de Cobro</p>
              <p className="text-2xl font-black text-white">Día {company.billingDay || 1}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Caducidad</p>
              <p className="text-lg font-black text-white truncate">{company.expirationDate ? new Date(company.expirationDate).toLocaleDateString('es-CL', { timeZone: 'UTC' }) : 'Sin Límite'}</p>
            </div>
          </div>
        </div>

        {/* Kill Switch */}
        <div className={`border rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center text-center transition-colors ${company.status === 'ACTIVE' ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-red-950/40 border-red-900/50'}`}>
          <h3 className={`text-xl font-black mb-2 ${company.status === 'ACTIVE' ? 'text-emerald-400' : 'text-red-400'}`}>
            {company.status === 'ACTIVE' ? 'Servicio Activo' : 'Servicio Suspendido'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {company.status === 'ACTIVE' ? 'El cliente tiene acceso total a la plataforma y sus funciones.' : 'El acceso a todo el sistema ha sido bloqueado temporalmente.'}
          </p>
          <button 
            onClick={toggleSuspension}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all w-full shadow-lg ${company.status === 'ACTIVE' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30'}`}
          >
            <i className={`fa-solid ${company.status === 'ACTIVE' ? 'fa-ban' : 'fa-check'} mr-2`}></i>
            {company.status === 'ACTIVE' ? 'Suspender Cliente' : 'Reactivar Cliente'}
          </button>
        </div>
      </div>

      {/* Usuarios de la Empresa */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <h3 className="text-lg font-bold text-white"><i className="fa-solid fa-users text-blue-500 mr-2"></i> Equipo de Trabajo</h3>
          <button 
            onClick={() => {
              const email = prompt('Email del nuevo administrador:');
              if (!email) return;
              const password = prompt('Contraseña temporal (mín. 6 caracteres):');
              if (!password) return;
              handleCreateAdmin(email, password);
            }} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg"
          >
            <i className="fa-solid fa-user-plus mr-2"></i> Crear Admin
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol en Empresa</th>
                <th className="px-6 py-4 text-right">Acciones de Soporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-4">
                      <i className="fa-solid fa-user-slash text-slate-400 text-xl"></i>
                    </div>
                    <p>No hay usuarios registrados en esta empresa.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{u.name || 'Sin Nombre'}</p>
                      <p className="text-xs text-slate-500 mt-1">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        u.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {u.role || 'CLIENT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleResetPassword(u.email)}
                        className="text-slate-400 hover:text-blue-400 px-3 py-1.5 transition-colors rounded-lg hover:bg-slate-800 text-xs font-medium border border-transparent hover:border-slate-700"
                        title="Enviar Reset de Contraseña"
                      >
                        <i className="fa-solid fa-key mr-1.5"></i> Clave
                      </button>
                      <button 
                        onClick={() => handleRoleChange(u.id, u.role)}
                        className="text-slate-400 hover:text-emerald-400 px-3 py-1.5 transition-colors rounded-lg hover:bg-slate-800 text-xs font-medium border border-transparent hover:border-slate-700"
                        title="Cambiar Rol"
                      >
                        <i className="fa-solid fa-user-shield mr-1.5"></i> Rol
                      </button>
                      <button 
                        onClick={() => handleRevokeAccess(u.id, u.email)}
                        className="text-slate-400 hover:text-red-400 px-3 py-1.5 transition-colors rounded-lg hover:bg-red-950/30 text-xs font-medium border border-transparent hover:border-red-900/30"
                        title="Expulsar Usuario"
                      >
                        <i className="fa-solid fa-user-xmark mr-1.5"></i> Expulsar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-pen-to-square text-purple-500"></i> Editar Datos
              </h3>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre Legal (Razón Social)</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">RUT</label>
                    <input type="text" required value={formData.rut} onChange={(e) => setFormData({...formData, rut: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Tarifa ($)</label>
                    <input type="number" required value={formData.monthlyFee} onChange={(e) => setFormData({...formData, monthlyFee: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Día Cobro</label>
                    <input type="number" min="1" max="31" required value={formData.billingDay} onChange={(e) => setFormData({...formData, billingDay: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Caducidad</label>
                    <input type="date" value={formData.expirationDate} onChange={(e) => setFormData({...formData, expirationDate: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
