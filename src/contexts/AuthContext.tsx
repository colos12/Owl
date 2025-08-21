import React, { createContext, useContext, useEffect, useState } from 'react';
import { authHelpers, AuthUser } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; businessName: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; business_name?: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    authHelpers.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authHelpers.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { name: string; businessName: string }) => {
    setLoading(true);
    const { error } = await authHelpers.signUp(email, password, userData);
    setLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await authHelpers.signIn(email, password);
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await authHelpers.signOut();
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (updates: { name?: string; business_name?: string }) => {
    const { error } = await authHelpers.updateProfile(updates);
    if (!error) {
      // Refresh user data
      const updatedUser = await authHelpers.getCurrentUser();
      setUser(updatedUser);
    }
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};