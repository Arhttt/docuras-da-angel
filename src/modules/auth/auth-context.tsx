'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface UserAddress {
  postalCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: UserAddress;
  createdAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isMock: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isMock: true,
  signIn: async () => ({ error: 'Provider not mounted' }),
  signUp: async () => ({ error: 'Provider not mounted' }),
  signOut: async () => {},
  updateProfile: async () => ({ error: 'Provider not mounted' }),
  resetPassword: async () => ({ error: 'Provider not mounted' }),
  updatePassword: async () => ({ error: 'Provider not mounted' }),
});

const SESSION_KEY = 'doces_angel_session';
const USERS_STORAGE_KEY = 'doces_angel_users';

function isMockSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return !url || url.includes('mock-doces') || !key || key.includes('mock-anon');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isMock = isMockSupabase();

  // Inicialização e sincronização da sessão
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isMock) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Cliente',
              phone: session.user.user_metadata?.phone || '',
              address: session.user.user_metadata?.address,
              createdAt: session.user.created_at,
            });
          }

          // Listener de mudanças de estado de autenticação no Supabase
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted) return;
            if (currentSession?.user) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'Cliente',
                phone: currentSession.user.user_metadata?.phone || '',
                address: currentSession.user.user_metadata?.address,
                createdAt: currentSession.user.created_at,
              });
            } else {
              setUser(null);
            }
          });

          if (mounted) setLoading(false);
          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (err) {
          console.warn('Falha ao conectar com Supabase Auth real, operando via sessão local:', err);
        }
      }

      // Fallback para mock / localStorage
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw && mounted) {
          setUser(JSON.parse(raw));
        }
      } catch (e) {
        console.error('Erro ao ler sessão do usuário:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [isMock]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    if (!email || !password) return { error: 'Preencha todos os campos.' };
    if (!email.includes('@')) return { error: 'E-mail inválido.' };
    if (password.length < 6) return { error: 'Senha deve ter pelo menos 6 caracteres.' };

    // 1. SUPABASE AUTH REAL
    if (!isMock) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            return { error: 'E-mail ou senha incorretos.' };
          }
          if (error.message.includes('Email not confirmed')) {
            return { error: 'Por favor, confirme seu e-mail antes de entrar.' };
          }
          return { error: error.message || 'Falha ao autenticar.' };
        }

        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            phone: data.user.user_metadata?.phone || '',
            address: data.user.user_metadata?.address,
            createdAt: data.user.created_at,
          };
          setUser(authUser);
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Erro de conexão com o Supabase.' };
      }
    }

    // 2. MOCK LOCALSTORAGE
    try {
      const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Record<string, AuthUser & { password?: string }> = usersRaw ? JSON.parse(usersRaw) : {};
      
      const normalizedEmail = email.toLowerCase().trim();
      let foundUser = users[normalizedEmail];

      if (!foundUser) {
        const baseName = normalizedEmail.split('@')[0];
        const formattedName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        foundUser = {
          id: 'user-' + Date.now(),
          email: normalizedEmail,
          name: formattedName,
          phone: '(43) 99999-0000',
          createdAt: new Date().toISOString(),
        };
        users[normalizedEmail] = foundUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      const sessionUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        phone: foundUser.phone,
        address: foundUser.address,
        createdAt: foundUser.createdAt,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return {};
    } catch {
      return { error: 'Falha ao autenticar. Tente novamente.' };
    }
  }, [isMock]);

  const signUp = useCallback(async (data: { name: string; email: string; password: string; phone?: string }): Promise<{ error?: string }> => {
    if (!data.name?.trim()) return { error: 'Informe seu nome completo.' };
    if (!data.email?.trim() || !data.email.includes('@')) return { error: 'Informe um e-mail válido.' };
    if (!data.password || data.password.length < 6) return { error: 'A senha deve conter no mínimo 6 caracteres.' };

    const normalizedEmail = data.email.toLowerCase().trim();

    // 1. SUPABASE AUTH REAL
    if (!isMock) {
      try {
        const supabase = createClient();
        const { data: authData, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
          options: {
            data: {
              name: data.name.trim(),
              phone: data.phone?.trim() || '',
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            return { error: 'Este e-mail já está cadastrado. Tente fazer login.' };
          }
          return { error: error.message || 'Erro ao registrar conta.' };
        }

        if (authData.user) {
          const newUser: AuthUser = {
            id: authData.user.id,
            email: authData.user.email || normalizedEmail,
            name: data.name.trim(),
            phone: data.phone?.trim() || '',
            createdAt: authData.user.created_at,
          };
          setUser(newUser);
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Erro de conexão com o Supabase.' };
      }
    }

    // 2. MOCK LOCALSTORAGE
    try {
      const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Record<string, AuthUser & { password?: string }> = usersRaw ? JSON.parse(usersRaw) : {};
      
      const newUser: AuthUser & { password?: string } = {
        id: 'user-' + Date.now(),
        email: normalizedEmail,
        name: data.name.trim(),
        phone: data.phone?.trim() || '',
        createdAt: new Date().toISOString(),
      };

      users[normalizedEmail] = newUser;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      const sessionUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address,
        createdAt: newUser.createdAt,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return {};
    } catch {
      return { error: 'Falha ao criar conta. Tente novamente.' };
    }
  }, [isMock]);

  const resetPassword = useCallback(async (email: string): Promise<{ error?: string }> => {
    if (!email || !email.includes('@')) {
      return { error: 'Por favor, informe um e-mail válido.' };
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isMock) {
      try {
        const supabase = createClient();
        const redirectTo = typeof window !== 'undefined'
          ? `${window.location.origin}/redefinir-senha`
          : undefined;

        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo,
        });

        if (error) {
          return { error: error.message || 'Erro ao solicitar recuperação de senha.' };
        }
        return {};
      } catch (err: any) {
        return { error: err.message || 'Erro de conexão com o Supabase.' };
      }
    }

    // Fallback mock
    await new Promise((r) => setTimeout(r, 800));
    return {};
  }, [isMock]);

  const updatePassword = useCallback(async (newPassword: string): Promise<{ error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { error: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }

    if (!isMock) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          return { error: error.message || 'Erro ao atualizar senha.' };
        }
        return {};
      } catch (err: any) {
        return { error: err.message || 'Erro de conexão com o Supabase.' };
      }
    }

    return {};
  }, [isMock]);

  const updateProfile = useCallback(async (data: Partial<AuthUser>): Promise<{ error?: string }> => {
    if (!user) return { error: 'Nenhum usuário conectado.' };

    if (!isMock) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          data: {
            name: data.name !== undefined ? data.name : user.name,
            phone: data.phone !== undefined ? data.phone : user.phone,
            address: data.address !== undefined ? data.address : user.address,
          },
        });
        if (error) return { error: error.message };
      } catch (err: any) {
        return { error: err.message };
      }
    }

    try {
      const updatedUser: AuthUser = {
        ...user,
        ...data,
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

      const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        if (users[user.email]) {
          users[user.email] = { ...users[user.email], ...data };
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }

      setUser(updatedUser);
      return {};
    } catch {
      return { error: 'Erro ao atualizar dados do perfil.' };
    }
  }, [user, isMock]);

  const signOut = useCallback(async () => {
    if (!isMock) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}
    }

    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    setUser(null);
  }, [isMock]);

  return (
    <AuthContext.Provider value={{ user, loading, isMock, signIn, signUp, signOut, updateProfile, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}