import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { signIn as signInSupabase, signOut as signOutSupabase, signUp as signUpSupabase, getUser } from '../supabase/auth';
import { User, Session } from '@supabase/supabase-js'; // Import Supabase types

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await getUser();
      if (user) {
        setIsAuthenticated(true);
        setUserProfile(user);
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInSupabase(email, password);
    await checkAuth(); // Re-fetch user data after signing in
  };

  const signOut = async () => {
    await signOutSupabase();
    await checkAuth(); // Re-fetch user data after signing out
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    // const { error } = await signUpSupabase(email, password, displayName);
    // if (error) throw error; // Handle signup error
    await signIn(email, password); // Automatically sign in after signup
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, signIn, signOut, signUp }}>
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
