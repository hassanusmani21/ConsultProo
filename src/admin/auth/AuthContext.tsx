import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  verifyMfa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ensureAdmin = async (userId: string) => {
  if (!supabase) throw new Error('Supabase is not configured for this deployment.');

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error('Admin access could not be verified.');
  if (!data) throw new Error('This account is not approved for admin access.');
};

const getVerifiedTotpFactor = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw new Error('Multi-factor authentication status could not be checked.');
  return data?.totp?.find((factor) => factor.status === 'verified') ?? null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!session?.user) {
        setIsAuthenticated(false);
        setMfaRequired(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        await ensureAdmin(session.user.id);
        const factor = await getVerifiedTotpFactor();
        if (mounted) {
          setUser(session.user);
          setMfaFactorId(factor?.id ?? null);
          setMfaRequired(Boolean(factor));
          setIsAuthenticated(!factor);
        }
      } catch {
        await supabase.auth.signOut();
        if (mounted) {
          setUser(null);
          setMfaRequired(false);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setMfaRequired(false);
        setMfaFactorId(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured for this deployment.');
    if (!email.trim() || !password) throw new Error('Email and password are required.');

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) throw new Error(error?.message || 'Login failed.');

    try {
      await ensureAdmin(data.user.id);
      const factor = await getVerifiedTotpFactor();
      setUser(data.user);
      setMfaFactorId(factor?.id ?? null);
      setMfaRequired(Boolean(factor));
      setIsAuthenticated(!factor);
      return Boolean(factor);
    } catch (verificationError) {
      await supabase.auth.signOut();
      throw verificationError;
    }
  };

  const verifyMfa = async (code: string) => {
    if (!supabase || !mfaFactorId) throw new Error('No authenticator challenge is active.');
    const challenge = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
    if (challenge.error || !challenge.data) throw new Error(challenge.error?.message || 'OTP challenge failed.');

    const { error } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    if (error) throw new Error(error.message || 'Invalid authenticator code.');

    setMfaRequired(false);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
    setMfaRequired(false);
    setMfaFactorId(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, mfaRequired, user, login, verifyMfa, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
