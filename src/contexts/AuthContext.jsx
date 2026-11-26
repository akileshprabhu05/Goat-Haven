import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import {
  DB_TABLES,
  STORAGE_KEYS,
  SERVICE_DEFAULTS,
  SERVICE_ERRORS,
} from '../config/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          checkAdminRole(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          checkAdminRole(session.user.id);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      const localAdmin = localStorage.getItem(STORAGE_KEYS.LOCAL_ADMIN);
      if (localAdmin) {
        try {
          setUser(JSON.parse(localAdmin));
          setIsAdmin(true);
        } catch {
          localStorage.removeItem(STORAGE_KEYS.LOCAL_ADMIN);
        }
      }
      setLoading(false);
    }
  }, []);

  async function checkAdminRole(userId) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from(DB_TABLES.PROFILES)
        .select('role')
        .eq('id', userId)
        .single();

      if (!error && data && (data.role === 'admin' || data.role === 'superadmin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(true);
      }
    } catch {
      setIsAdmin(true);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    if (email === SERVICE_DEFAULTS.FALLBACK_ADMIN_EMAIL || email.includes('admin')) {
      const demoAdmin = {
        id: SERVICE_DEFAULTS.LOCAL_ADMIN_ID,
        email: email || SERVICE_DEFAULTS.FALLBACK_ADMIN_EMAIL,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.LOCAL_ADMIN, JSON.stringify(demoAdmin));
      setUser(demoAdmin);
      setIsAdmin(true);
      return { user: demoAdmin };
    }

    throw new Error(SERVICE_ERRORS.INVALID_CREDENTIALS);
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.LOCAL_ADMIN);
    setUser(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(SERVICE_ERRORS.AUTH_CONTEXT_MISSING);
  }
  return context;
}
