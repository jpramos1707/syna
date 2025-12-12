import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { mockUsers, mockDb } from '@/mocks/mockData';

type AppRole = 'gestor' | 'criador' | 'designer';

// Mock User type (simplified version of Supabase User)
interface MockUser {
  id: string;
  email: string;
  role?: AppRole;
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys for persistence
const STORAGE_KEY_USER = 'mock_user';
const STORAGE_KEY_SESSION = 'mock_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);

    if (storedUser && storedSession) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedSession = JSON.parse(storedSession);
        setUser(parsedUser);
        setSession(parsedSession);
        fetchUserRole(parsedUser.id);
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const userRole = await mockDb.userRoles.getByUserId(userId);
      if (userRole) {
        setRole(userRole.role as AppRole);
      }
    } catch (error) {
      console.error('Error fetching role:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const foundUser = mockUsers.find(
        (u) => u.email === email.trim() && u.password === password
      );

      if (!foundUser) {
        return { error: new Error('Email ou senha incorretos') };
      }

      const mockUser: MockUser = {
        id: foundUser.id,
        email: foundUser.email,
      };

      const mockSession: MockSession = {
        user: mockUser,
        access_token: `mock_token_${Date.now()}`,
      };

      setUser(mockUser);
      setSession(mockSession);
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(mockSession));

      await fetchUserRole(foundUser.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email.trim());
      if (existingUser) {
        return { error: new Error('Este email já está cadastrado') };
      }

      // In a real app, this would create a new user
      // For now, we'll just return an error suggesting to use existing accounts
      return { error: new Error('Cadastro desabilitado no modo mock. Use: gestor@example.com, criador@example.com ou designer@example.com (senha: 123456)') };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setRole(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut }}>
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
