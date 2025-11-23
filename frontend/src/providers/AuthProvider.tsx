'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isUsingMockAuth, MockUser } from '@/lib/firebase';

interface AuthContextType {
  user: User | MockUser | null;
  loading: boolean;
  error?: string;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isUsingMockAuth) {
      // Use mock auth
      const mockUserStr = localStorage.getItem('mockUser');
      if (mockUserStr) {
        try {
          const mockUser = JSON.parse(mockUserStr) as MockUser;
          setUser(mockUser);
        } catch (err) {
          localStorage.removeItem('mockUser');
        }
      }
      setLoading(false);
    } else {
      // Use Firebase auth
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          const token = await currentUser.getIdToken();
          localStorage.setItem('authToken', token);
        } else {
          localStorage.removeItem('authToken');
        }
      });

      return () => unsubscribe();
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
