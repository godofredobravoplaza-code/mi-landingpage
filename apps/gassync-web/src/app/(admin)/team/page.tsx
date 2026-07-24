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

  // Modal de Crear Usuario
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createPasswordConfirm, setCreatePasswordConfirm] = useState('');
  const [createRole, setCreateRole] = useState('INSPECTOR');
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal de Cambiar Rol
  const [roleModalUser, setRoleModalUser] = useState<any>(null);
  const [newRole, setNewRole] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

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

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.companyId) return;
    
    if (createPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    if (createPassword !== createPasswordConfirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setIsCreating(true);

    try {
      // Usamos una app secundaria para no cerrar la sesión del admin actual
      const secondaryApp = initializeApp(primaryApp.options, 'SecondaryApp');
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, createEmail, createPassword);
      const user = userCredential.user;
      
      const newUser = {
        email: createEmail,
        name: `Nuevo ${createRole}`,
        role: createRole,
        companyId: profile.companyId,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUser);
      
      setUsers([...users, { id: user.uid, ...newUser }]);
      setIsCreateModalOpen(false);
      setCreateEmail('');
      setCreatePassword('');
      setCreatePasswordConfirm('');
      setCreateRole('INSPECTOR');
      alert(`Usuario creado exitosamente.`);
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      alert(`Error al crear usuario: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenRoleModal = (user: any) => {
    if (user.id === profile?.uid) {
      alert("No puedes cambiar tu propio rol.");
      return;
    }
    setRoleModalUser(user);
    setNewRole(user.role);
  };

  const handleRoleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    if (newRole === roleModalUser.role) {
      setRoleModalUser(null);
      return;
    }

    setIsUpdatingRole(true);
    try {
      await updateDoc(doc(db, 'users', roleModalUser.id), { role: newRole });
      setUsers(users.map(u => u.id === roleModalUser.id ? { ...u, role: newRole } : u));
      setRoleModalUser(null);
    } catch (error: any) {
      console.error("Error al actualizar rol:", error);
      alert("Error al actualizar rol: " + error.message);
    } finally {
      setIsUpdatingRole(false);
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
            onClick={() => setIsCreateModalOpen(true)} 
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
                        onClick={() => handleOpenRoleModal(u)}
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

      {/* MODAL CREAR USUARIO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-navy-950 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-xl font-bold text-white mb-4">Nuevo Integrante</h2>
            <form onSubmit={handleCreateUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="ejemplo@gaschile.cl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contraseña Temporal</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      minLength={6}
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 focus:outline-none pr-10"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Repetir Contraseña</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    minLength={6}
                    value={createPasswordConfirm}
                    onChange={(e) => setCreatePasswordConfirm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="Repite la contraseña"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Rol en la Plataforma</label>
                  <select 
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="INSPECTOR">Inspector (Terreno)</option>
                    <option value="BACKOFFICE">BackOffice (Oficina)</option>
                    <option value="ADMIN">Administrador (Total)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creando...' : 'Crear Integrante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CAMBIAR ROL */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-navy-950 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <h2 className="text-xl font-bold text-white mb-4">Modificar Acceso</h2>
            <p className="text-sm text-slate-400 mb-4">
              Estás modificando el rol de <span className="text-white font-bold">{roleModalUser.email}</span>
            </p>
            <form onSubmit={handleRoleChangeSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Nuevo Rol</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                >
                  <option value="INSPECTOR">Inspector (Terreno)</option>
                  <option value="BACKOFFICE">BackOffice (Oficina)</option>
                  <option value="ADMIN">Administrador (Total)</option>
                  <option value="SUSPENDED">Suspendido (Sin Acceso)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setRoleModalUser(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdatingRole}
                  className="flex-1 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {isUpdatingRole ? 'Guardando...' : 'Actualizar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
