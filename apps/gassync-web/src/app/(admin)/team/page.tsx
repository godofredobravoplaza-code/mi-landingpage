'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { auth, db, app as primaryApp } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    // Proteger la ruta, solo ADMIN puede entrar
    if (profile?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (!profile?.companyId) return;

    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('companyId', '==', profile.companyId));
        const snap = await getDocs(q);
        const usersData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUsers();
  }, [profile, loading, router]);

  const handleCreateUser = async () => {
    if (!profile?.companyId) return;
    
    const email = prompt('Email del nuevo integrante:');
    if (!email) return;
    const password = prompt('Contraseña temporal (mín. 6 caracteres):');
    if (!password) return;
    const roleInput = prompt('Rol del usuario (ADMIN, INSPECTOR, BACKOFFICE):', 'INSPECTOR');
    if (!roleInput) return;
    
    const role = roleInput.toUpperCase();
    if (!['ADMIN', 'INSPECTOR', 'BACKOFFICE'].includes(role)) {
      alert('Rol inválido. Debe ser ADMIN, INSPECTOR o BACKOFFICE.');
      return;
    }

    try {
      // Usamos una app secundaria para no cerrar la sesión del admin actual
      const secondaryApp = initializeApp(primaryApp.options, 'SecondaryApp');
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;
      
      const newUser = {
        email,
        name: `Nuevo ${role}`,
        role: role,
        companyId: profile.companyId,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUser);
      
      setUsers([...users, { id: user.uid, ...newUser }]);
      alert(`Usuario creado exitosamente con la clave: ${password}`);
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      alert(`Error al crear usuario: ${error.message}`);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    if (userId === profile?.uid) {
      alert("No puedes cambiar tu propio rol.");
      return;
    }
    
    const newRole = prompt(`Cambiar rol (Actual: ${currentRole}). Opciones: ADMIN, INSPECTOR, BACKOFFICE`, currentRole);
    if (newRole && ['ADMIN', 'INSPECTOR', 'BACKOFFICE'].includes(newRole.toUpperCase())) {
      if (newRole.toUpperCase() === currentRole) return;
      if (confirm(`¿Estás seguro de cambiar el rol a ${newRole.toUpperCase()}?`)) {
        await updateDoc(doc(db, 'users', userId), { role: newRole.toUpperCase() });
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole.toUpperCase() } : u));
      }
    }
  };

  const handleResetPassword = async (email: string) => {
    if (confirm(`¿Enviar enlace de recuperación a ${email}?`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Correo de recuperación enviado.');
      } catch (error: any) {
        alert('Error al enviar el correo: ' + error.message);
      }
    }
  };

  const handleRevokeAccess = async (userId: string, email: string) => {
    if (userId === profile?.uid) {
      alert("No puedes revocar tu propio acceso.");
      return;
    }
    
    if (confirm(`¿Estás seguro de revocar el acceso a ${email}? Esto cambiará su rol a SUSPENDED y no podrá ingresar.`)) {
      await updateDoc(doc(db, 'users', userId), { role: 'SUSPENDED' });
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'SUSPENDED' } : u));
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mi Equipo</h1>
        <p className="text-slate-400">Gestiona los accesos y roles del personal de tu empresa.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <h3 className="text-lg font-bold text-white"><i className="fa-solid fa-users text-blue-500 mr-2"></i> Integrantes</h3>
          <button 
            onClick={handleCreateUser} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg"
          >
            <i className="fa-solid fa-user-plus mr-2"></i> Nuevo Integrante
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase font-semibold text-slate-400">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">Acciones de Soporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{u.email}</div>
                        <div className="text-xs text-slate-500">{u.id === profile?.uid ? '(Tú)' : u.name || 'Sin nombre'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                      u.role === 'INSPECTOR' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      u.role === 'SUSPENDED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleResetPassword(u.email)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" 
                        title="Resetear Clave"
                      >
                        <i className="fa-solid fa-key"></i>
                      </button>
                      <button 
                        onClick={() => handleRoleChange(u.id, u.role)}
                        disabled={u.id === profile?.uid}
                        className={`p-2 rounded-lg transition-colors ${u.id === profile?.uid ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-orange-400 hover:bg-orange-500/10'}`}
                        title="Cambiar Rol"
                      >
                        <i className="fa-solid fa-user-shield"></i>
                      </button>
                      <button 
                        onClick={() => handleRevokeAccess(u.id, u.email)}
                        disabled={u.id === profile?.uid}
                        className={`p-2 rounded-lg transition-colors ${u.id === profile?.uid ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'}`}
                        title="Revocar Acceso"
                      >
                        <i className="fa-solid fa-ban"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No hay otros usuarios en esta empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
