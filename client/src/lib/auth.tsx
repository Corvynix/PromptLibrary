import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from './queryClient';

interface User {
  id: number;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  roles: string[];
  karmaScore: number;
  metrics: any;
  createdAt: string;
  updatedAt: string;
  isBanned: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount if token exists
  useEffect(() => {
    async function fetchCurrentUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
        } else {
          // Invalid token, clear it
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest('POST', '/api/auth/login', { email, password });
    const data = await res.json();
    
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setCurrentUser(data.user);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const res = await apiRequest('POST', '/api/auth/register', {
      email,
      password,
      displayName,
    });
    const data = await res.json();
    
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setCurrentUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
