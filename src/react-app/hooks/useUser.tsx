import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/react-app/firebaseConfig';

interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userObj = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || ''
        };
        setUser(userObj);
        localStorage.setItem('vorniq_user', JSON.stringify(userObj));
      } else {
        setUser(null);
        localStorage.removeItem('vorniq_user');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('vorniq_user', JSON.stringify(user));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setUser(null);
    localStorage.removeItem('vorniq_user');
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
} 