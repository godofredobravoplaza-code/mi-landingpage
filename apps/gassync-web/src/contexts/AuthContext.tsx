'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useRouter, usePathname } from 'next/navigation';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'BACKOFFICE' | 'INSPECTOR' | 'CLIENT' | 'SUSPENDED';
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data() as UserProfile;
            setProfile(userData);

            // Verificación de Apagón / Suspensión de Empresa
            if (userData.role !== 'SUPERADMIN' && userData.companyId) {
              const companyRef = doc(db, 'companies', userData.companyId);
              const companySnap = await getDoc(companyRef);
              
              if (companySnap.exists()) {
                const companyData = companySnap.data();
                if (companyData.status === 'SUSPENDED') {
                  if (pathname !== '/suspended') {
                    router.replace('/suspended');
                  }
                }
              }
            }

          } else {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email || '',
              role: 'CLIENT'
            });
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
  }, [router, pathname]);

  const logout = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setProfile(null);
      setUser(null);
      router.push('/login');
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
