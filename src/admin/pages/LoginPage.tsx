import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

type LoginMode = 'login' | 'forgot';

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, verifyMfa, mfaRequired } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsLoading(true);
    try {
      const needsOtp = await login(email, password);
      if (!needsOtp) navigate('/admin');
    } catch (loginError: any) {
      setError(loginError.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured for this deployment.');
      return;
    }

    setError('');
    setNotice('');
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (resetError) throw resetError;
      setNotice('Password reset instructions have been sent to your email.');
    } catch (resetError: any) {
      setError(resetError.message || 'Password reset could not be requested.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfa = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyMfa(otp);
      navigate('/admin');
    } catch (mfaError: any) {
      setError(mfaError.message || 'The authenticator code is invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = mfaRequired ? handleMfa : mode === 'forgot' ? handleForgotPassword : handleLogin;

  return (
    <div className="min-h-screen bg-[#0e1015] flex items-center justify-center p-4 selection:bg-[#bfa37c] selection:text-[#0e1015]">
      <div className="w-full max-w-md bg-[#14161f] border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#bfa37c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl border border-[#bfa37c]/30 bg-[#181a24] flex items-center justify-center text-[#bfa37c]">
              {mfaRequired ? <KeyRound className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-sans font-bold text-white mt-4">
              {mfaRequired ? 'Authenticator verification' : mode === 'forgot' ? 'Reset admin password' : 'System Access'}
            </h1>
            <p className="text-sm text-[#9a9da8] font-sans">
              {mfaRequired ? 'Enter the six-digit code from your authenticator app.' : mode === 'forgot' ? 'We will send a secure reset link to your admin email.' : 'Use the approved Supabase admin account.'}
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {!mfaRequired && (
              <div className="space-y-1">
                <label className="block text-[10px] font-sans font-bold text-[#bfa37c] uppercase tracking-wider">Admin Email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9a9da8] focus:outline-none focus:border-[#bfa37c] transition-colors" placeholder="admin@example.com" />
              </div>
            )}

            {mfaRequired ? (
              <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoFocus value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} required className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-[#bfa37c]" placeholder="000000" />
            ) : mode === 'login' ? (
              <div className="space-y-1">
                <label className="block text-[10px] font-sans font-bold text-[#bfa37c] uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9a9da8] focus:outline-none focus:border-[#bfa37c] transition-colors" placeholder="••••••••" />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9da8] pointer-events-none" />
                </div>
              </div>
            ) : null}

            {error && <div className="text-red-400 text-xs font-sans p-3 rounded-lg bg-red-400/10 border border-red-400/20">{error}</div>}
            {notice && <div className="text-emerald-300 text-xs font-sans p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20">{notice}</div>}

            <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl bg-[#bfa37c] text-[#0e1015] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#d6be9c] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              <span>{isLoading ? 'Please wait...' : mfaRequired ? 'Verify OTP' : mode === 'forgot' ? 'Send Reset Link' : 'Secure Login'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {!mfaRequired && (
            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => { setMode(mode === 'forgot' ? 'login' : 'forgot'); setError(''); setNotice(''); }} className="text-[#bfa37c] hover:text-white">
                {mode === 'forgot' ? 'Back to login' : 'Forgot password?'}
              </button>
              {mode === 'forgot' && <ArrowLeft className="h-4 w-4 text-[#9a9da8]" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
