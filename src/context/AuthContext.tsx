import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; bio?: string; avatarUrl?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  toggleBookmark: (appId: string) => Promise<boolean>;
  isBookmarked: (appId: string) => boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (initialTab?: 'login' | 'register' | 'forgot' | 'admin') => void;
  closeAuthModal: () => void;
  authModalTab: 'login' | 'register' | 'forgot' | 'admin';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('zx9_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot' | 'admin'>('login');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('zx9_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          localStorage.removeItem('zx9_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    const res = await api.login({ emailOrUsername, password });
    localStorage.setItem('zx9_token', res.token);
    setToken(res.token);
    setUser(res.user as User);
    setIsAuthModalOpen(false);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await api.register({ username, email, password });
    localStorage.setItem('zx9_token', res.token);
    setToken(res.token);
    setUser(res.user as User);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('zx9_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { username?: string; bio?: string; avatarUrl?: string; currentPassword?: string; newPassword?: string }) => {
    const res = await api.updateProfile(data);
    setUser(res.user);
  };

  const toggleBookmark = async (appId: string): Promise<boolean> => {
    if (!user) {
      openAuthModal('login');
      return false;
    }
    try {
      const res = await api.toggleBookmark(appId);
      setUser((prev) => (prev ? { ...prev, bookmarks: res.bookmarks } : null));
      return res.isBookmarked;
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      return false;
    }
  };

  const isBookmarked = (appId: string): boolean => {
    return !!user?.bookmarks?.includes(appId);
  };

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' | 'admin' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        toggleBookmark,
        isBookmarked,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalTab,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
