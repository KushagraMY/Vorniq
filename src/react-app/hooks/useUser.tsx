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
    // Check if there's a stored user first (including demo users)
    const storedUser = localStorage.getItem('vorniq_user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        console.log('useUser: Found stored user:', userObj);
        
        // If it's a demo user, use it directly
        if (userObj.id === 'demo-user-123') {
          console.log('useUser: Using stored demo user');
          setUser(userObj);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('useUser: Error parsing stored user:', error);
      }
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('useUser: Firebase auth state changed:', firebaseUser);
      
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
        // Only clear user if it's not a demo user
        const storedUser = localStorage.getItem('vorniq_user');
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            if (userObj.id !== 'demo-user-123') {
              setUser(null);
              localStorage.removeItem('vorniq_user');
            }
          } catch (error) {
            setUser(null);
            localStorage.removeItem('vorniq_user');
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = (user: User) => {
    console.log('useUser: Login called with user:', user);
    setUser(user);
    localStorage.setItem('vorniq_user', JSON.stringify(user));
    
    // If this is a demo user, don't let Firebase auth override it
    if (user.id === 'demo-user-123') {
      console.log('useUser: Demo user login, skipping Firebase auth override');
    }
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