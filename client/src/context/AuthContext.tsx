'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  token: string;
  // Profile fields
  profilePicture?: string;
  bio?: string;
  currentCompany?: string;
  designation?: string;
  skills?: string[];
  linkedinProfile?: string;
  githubProfile?: string;
  batch?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, rememberMe?: boolean) => void;
  updateUser: (userData: User) => void;
  register: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUser) {
      // eslint-disable-next-line
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, rememberMe: boolean = true) => {
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.removeItem('user'); // Ensure no duplicate
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.removeItem('user'); // Ensure no duplicate
    }
    router.push('/dashboard'); // API response should trigger this
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    if (localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const register = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Default to local for register? Or maybe session? Let's default to remember me for now as it's standard registration flow.
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, updateUser, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
