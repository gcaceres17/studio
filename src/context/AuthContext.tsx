'use client';

import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
}

// --- Mock User for Demo Purposes ---
// In a real application, you would remove this mock user logic and
// rely solely on Firebase Authentication.
const MOCK_USER_EMAIL = 'user@example.com';
const MOCK_USER_PASS = 'password';
const MOCK_SESSION_KEY = 'mockUserSession';

// A mock user object that satisfies the User type.
// Many properties are empty or have dummy implementations.
const mockUser: User = {
    uid: 'mock-uid-12345',
    email: MOCK_USER_EMAIL,
    displayName: 'Demo User',
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    providerId: 'password',
    tenantId: null,
    refreshToken: 'mock-token',
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
} as User;
// --- End Mock User ---


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On component mount, check if there's a mock session active.
    if (sessionStorage.getItem(MOCK_SESSION_KEY)) {
        setUser(mockUser);
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = (email: string, pass: string) => {
    setLoading(true);

    // Check for mock user credentials
    if (email === MOCK_USER_EMAIL && pass === MOCK_USER_PASS) {
        sessionStorage.setItem(MOCK_SESSION_KEY, 'true');
        setUser(mockUser);
        setLoading(false);
        return Promise.resolve();
    }

    // If not mock user, proceed with Firebase auth
    return signInWithEmailAndPassword(auth, email, pass)
      .finally(() => setLoading(false));
  };

  const signOut = async () => {
    // Clear both mock session and Firebase session
    sessionStorage.removeItem(MOCK_SESSION_KEY);
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signOut,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
