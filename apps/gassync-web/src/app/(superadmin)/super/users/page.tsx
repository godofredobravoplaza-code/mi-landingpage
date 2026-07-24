'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';

interface UserProfile {
  id: string; // doc id is uid
  email: string;
  name?: string;
  role: string;
  companyId?: string;
}

export default function SuperUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [companiesMap, setCompaniesMap] = useState<Record<string, string>>({});

  const fetchUsersAndCompanies = async () => {
    setLoading(true);
    try {
      // 1. Fetch Companies for mapping
      const companiesSnap = await getDocs(collection(db, 'companies'));
      const cMap: Record<string, string> = {};
      companiesSnap.forEach(doc => {
        cMap[doc.id] = doc.data().name;
      });
      setCompaniesMap(cMap);

      // 2. Fetch Users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData: UserProfile[] = [];
      usersSnap.forEach(doc => {
        usersData.push({ id: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndCompanies();
  }, []);

  const handleResetPassword = async (email: string) => {
    if (confirm(`¿Enviar correo de recuperación de contraseña a ${email}?`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert(`Correo enviado con éxito a ${email}`);
      } catch (error) {
        console.error("Error enviando correo:", error);
        alert("Error al enviar el correo. Verifique si el usuario se registró con Google.");
      }
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = prompt(`Cambiar rol (Actual: ${currentRole}). Opciones: ADMIN, INSPECTOR, BACKOFFICE, CLIENT`, currentRole);
    
    if (newRole && ['ADMIN', 'INSPECTOR', 'BACKOFFICE', 'CLIENT', 'SUPERADMIN'].includes(newRole.toUpperCase())) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          role: newRole.toUpperCase()
        });
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole.toUpperCase() } : u));
        alert("Rol actualizado correctamente.");
      } catch (error) {
        console.error("Error actualizando rol:", error);
        alert("Error al actualizar el rol.");
      }
    } else if (newRole) {
      alert("Rol inválido.");
    }
  };

  const handleRevokeAccess = async (userId: string, email: string) => {
    if (confirm(`⚠️ PELIGRO: ¿Estás seguro de revocar el acceso a ${email}?\n\nEsto borrará su perfil y lo expulsará de su empresa. Tendrá que ser invitado nuevamente.`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(u => u.id !== userId));
        alert("Acceso revocado. El usuario ya no pertenece a ninguna empresa.");
      } catch (error) {
        console.error("Error revocando acceso:", error);
        alert("Error al revocar acceso.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Soporte y Usuarios</h2>
          <p className="text-slate-400 mt-1">Gestión global de cuentas, roles y recuperación de claves.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <h3 className="text-lg font-bold text-white">Directorio Global de Usuarios</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Empresa (Tenant)</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones de Soporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{u.name || 'Sin Nombre'}</p>
                      <p className="text-xs text-slate-500 mt-1">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs border border-slate-700">
                        {u.companyId ? (companiesMap[u.companyId] || 'ID Desconocido') : 'Sin Empresa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        u.role === 'SUPERADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
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
                        <i className="fa-solid fa-key mr-1.5"></i> Reset Clave
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
                        disabled={u.role === 'SUPERADMIN'}
                        className="text-slate-400 hover:text-red-400 px-3 py-1.5 transition-colors rounded-lg hover:bg-red-950/30 text-xs font-medium border border-transparent hover:border-red-900/30 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent disabled:hover:border-transparent"
                        title="Revocar Acceso / Eliminar"
                      >
                        <i className="fa-solid fa-user-xmark mr-1.5"></i> Eliminar
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
