import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '../types';
import { musicBox } from '../utils/audio';

interface SignupData {
  username: string;
  password: string;
  nickname?: string;
  seal?: string;
  favoriteLullaby?: string;
}

interface AuthContextType extends AuthState {
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('pip_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Verify session on mount
  useEffect(() => {
    const token = localStorage.getItem('pip_auth_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session expired');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('pip_auth_user', JSON.stringify(data.user));
          // Also sync visitor name in memory
          localStorage.setItem('pip_visitor_name', data.user.nickname || data.user.username);
        }
      })
      .catch(() => {
        // Fallback to offline stored user if static hosting
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('pip_auth_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('pip_auth_token', data.token);
        localStorage.setItem('pip_visitor_name', data.user.nickname || data.user.username);

        musicBox.playNamedNote('G5', 0.5);
        setTimeout(() => musicBox.playNamedNote('C6', 0.6), 120);

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch {
      // Local fallback for static hosting
      try {
        const localDb = JSON.parse(localStorage.getItem('pip_local_users_db') || '[]');
        const found = localDb.find(
          (u: { username: string }) => u.username.toLowerCase() === username.toLowerCase()
        );
        if (found) {
          setUser(found);
          localStorage.setItem('pip_auth_user', JSON.stringify(found));
          localStorage.setItem('pip_visitor_name', found.nickname || found.username);
          musicBox.playNamedNote('G5', 0.5);
          return { success: true };
        }
      } catch {
        // Ignore
      }
      return { success: false, error: 'Could not connect to authentication ledger.' };
    }
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (res.ok && resData.user) {
        setUser(resData.user);
        localStorage.setItem('pip_auth_user', JSON.stringify(resData.user));
        if (resData.token) localStorage.setItem('pip_auth_token', resData.token);
        localStorage.setItem('pip_visitor_name', resData.user.nickname || resData.user.username);

        // Also save to local DB
        try {
          const localDb = JSON.parse(localStorage.getItem('pip_local_users_db') || '[]');
          localDb.push(resData.user);
          localStorage.setItem('pip_local_users_db', JSON.stringify(localDb));
        } catch {
          // Ignore
        }

        musicBox.playNamedNote('E5', 0.5);
        setTimeout(() => musicBox.playNamedNote('A5', 0.5), 100);
        setTimeout(() => musicBox.playNamedNote('C6', 0.7), 200);

        return { success: true };
      } else {
        return { success: false, error: resData.error || 'Failed to create dreamer account' };
      }
    } catch {
      // Offline fallback signup
      const newUser: UserProfile = {
        id: `user-local-${Date.now()}`,
        username: data.username.toLowerCase(),
        nickname: data.nickname || data.username,
        seal: data.seal || '⭐ Star Wish',
        favoriteLullaby: data.favoriteLullaby || "Pip's Sleepy Starlight Melody",
        createdAt: new Date().toISOString(),
      };

      try {
        const localDb = JSON.parse(localStorage.getItem('pip_local_users_db') || '[]');
        localDb.push(newUser);
        localStorage.setItem('pip_local_users_db', JSON.stringify(localDb));
        localStorage.setItem('pip_auth_user', JSON.stringify(newUser));
        localStorage.setItem('pip_visitor_name', newUser.nickname);
        setUser(newUser);

        musicBox.playNamedNote('E5', 0.5);
        setTimeout(() => musicBox.playNamedNote('C6', 0.7), 150);

        return { success: true };
      } catch {
        return { success: false, error: 'Local storage unavailable for offline signup' };
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pip_auth_user');
    localStorage.removeItem('pip_auth_token');
    musicBox.playNamedNote('D4', 0.5);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
