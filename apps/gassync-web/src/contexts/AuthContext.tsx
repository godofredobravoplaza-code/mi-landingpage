'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'INSPECTOR' | 'CLIENT';
  companyId?: string;
  name?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Intentar obtener el perfil del usuario desde Firestore
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Si el documento no existe (ej: recién registrado, o modo dev)
            // Le asignamos un perfil por defecto temporalmente, pero sin privilegios altos
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email || '',
              role: 'CLIENT' // Nivel más bajo por seguridad
            });
            console.warn("Usuario sin documento en Firestore. Se asignó rol por defecto.");
          }
        } catch (error) {
          console.error("Error obteniendo perfil de Firestore:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
