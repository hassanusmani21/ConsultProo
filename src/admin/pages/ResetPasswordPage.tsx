import React, { useState } from 'react';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }
    if (!supabase) {
      setError('Supabase is not configured for this deployment.');
      return;
    }

    setIsSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSaving(false);
    if (updateError) {
      setError(updateError.message || 'Password could not be updated.');
      return;
    }
    setNotice('Your password was updated. Redirecting to admin login...');
    await supabase.auth.signOut();
    window.setTimeout(() => navigate('/admin/login', { replace: true }), 1200);
  };

  return (
    <div className="min-h-screen bg-[#0e1015] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14161f] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#bfa37c]/30 bg-[#181a24] text-[#bfa37c]"><ShieldCheck className="h-6 w-6" /></div>
          <h1 className="mt-4 text-2xl font-bold text-white">Create a new password</h1>
          <p className="mt-2 text-sm text-[#9a9da8]">Set a new password for your admin account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-3 pr-11 text-sm text-white outline-none focus:border-[#bfa37c]" />
            <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9da8]" />
          </div>
          <input type="password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirm new password" className="w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-3 text-sm text-white outline-none focus:border-[#bfa37c]" />
          {error && <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-400">{error}</div>}
          {notice && <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300">{notice}</div>}
          <button type="submit" disabled={isSaving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bfa37c] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0e1015] disabled:opacity-60">
            <span>{isSaving ? 'Updating...' : 'Update Password'}</span><ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
