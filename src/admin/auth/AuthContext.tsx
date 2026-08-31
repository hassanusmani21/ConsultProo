import React, { createContext, useContext, useState, useEffect } from 'react';

// Abstracted Authentication Layer
// Ready to be connected to Firebase Auth, Supabase Auth, or a custom JWT backend.

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Simulate checking for an existing session (e.g., verifying JWT token from local storage)
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          // TODO: Validate token with backend
          setIsAuthenticated(true);
          setUser({ email: 'admin@example.com' }); // Mock user
        }
      } catch (error) {
        console.error('Session validation failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Connect to real backend API (e.g. POST /api/auth/login or signInWithEmailAndPassword)
    // For now, this is a simulated UI placeholder so the user can access the dashboard.
    // In a real application, NEVER do this on the frontend.
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          // Simulated success for UI testing
          localStorage.setItem('admin_token', 'simulated_jwt_token_for_ui_testing');
          setIsAuthenticated(true);
          setUser({ email });
          resolve();
        } else {
          reject(new Error('Email and password are required.'));
        }
      }, 1000);
    });
  };

  const logout = async () => {
    // TODO: Connect to backend API to invalidate session
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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
