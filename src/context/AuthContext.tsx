import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: string; name: string } | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lt_lims_auth') === 'true';
  });
  const [user, setUser] = useState<{ username: string; role: string; name: string } | null>(() => {
    const saved = localStorage.getItem('lt_lims_user');
    return saved ? JSON.parse(saved) : { username: 'admin', role: 'Directeur Laboratoire', name: 'Dr. M. Tahabort' };
  });

  const login = (username: string, pass: string): boolean => {
    // Hardcoded credentials for testing as requested
    if ((username === 'admin' || username === 'tahabort') && pass === 'labo2026') {
      setIsAuthenticated(true);
      const userData = { username, role: 'Directeur Laboratoire', name: 'Dr. M. Tahabort' };
      setUser(userData);
      localStorage.setItem('lt_lims_auth', 'true');
      localStorage.setItem('lt_lims_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('lt_lims_auth');
    localStorage.removeItem('lt_lims_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
