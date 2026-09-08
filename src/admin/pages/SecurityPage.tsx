import React, { useEffect, useState } from 'react';
import { KeyRound, Lock, ShieldCheck, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SecurityPage() {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [factors, setFactors] = useState<any[]>([]);
  const [factorId, setFactorId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const loadFactors = async () => {
    if (!supabase) return;
    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) setError(listError.message);
    else setFactors(data?.totp ?? []);
  };

  useEffect(() => { void loadFactors(); }, []);

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice('');
    setError('');
    if (password.length < 8 || password !== confirmation) {
      setError(password.length < 8 ? 'Use a password with at least 8 characters.' : 'The passwords do not match.');
      return;
    }
    if (!supabase) return;
    setIsBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsBusy(false);
    if (updateError) setError(updateError.message);
    else {
      setPassword('');
      setConfirmation('');
      setNotice('Password changed successfully.');
    }
  };

  const startOtpSetup = async () => {
    if (!supabase) return;
    setError('');
    setNotice('');
    setIsBusy(true);
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Admin authenticator',
    });
    setIsBusy(false);
    if (enrollError || !data) {
      setError(enrollError?.message || 'Authenticator setup could not start.');
      return;
    }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
  };

  const verifyOtpSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !factorId) return;
    setError('');
    setNotice('');
    setIsBusy(true);
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error || !challenge.data) {
      setIsBusy(false);
      setError(challenge.error?.message || 'OTP challenge could not be created.');
      return;
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.data.id, code: otp.trim() });
    setIsBusy(false);
    if (verifyError) {
      setError(verifyError.message || 'Invalid OTP.');
      return;
    }
    setQrCode('');
    setSecret('');
    setOtp('');
    setFactorId('');
    setNotice('Authenticator OTP is enabled. Future admin logins will require a code.');
    await loadFactors();
  };

  const removeFactor = async (id: string) => {
    if (!supabase || !window.confirm('Disable authenticator OTP for this admin account?')) return;
    setIsBusy(true);
    const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId: id });
    setIsBusy(false);
    if (removeError) setError(removeError.message);
    else {
      setNotice('Authenticator OTP has been disabled.');
      await loadFactors();
    }
  };

  const verifiedFactor = factors.find((factor) => factor.status === 'verified');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Security</h1><p className="mt-1 text-sm text-[#9a9da8]">Manage your admin password and authenticator OTP.</p></div>
      {error && <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{notice}</div>}

      <section className="rounded-2xl border border-white/10 bg-[#14161f] p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4"><Lock className="h-5 w-5 text-[#bfa37c]" /><div><h2 className="font-bold text-white">Change password</h2><p className="text-xs text-[#9a9da8]">Update the password for your Supabase admin account.</p></div></div>
        <form onSubmit={updatePassword} className="grid gap-4 md:grid-cols-2">
          <input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="rounded-lg border border-white/10 bg-[#0e1015] px-4 py-3 text-sm text-white outline-none focus:border-[#bfa37c]" />
          <input type="password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirm new password" className="rounded-lg border border-white/10 bg-[#0e1015] px-4 py-3 text-sm text-white outline-none focus:border-[#bfa37c]" />
          <button type="submit" disabled={isBusy} className="w-fit rounded-lg bg-[#bfa37c] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#0e1015] disabled:opacity-60">Save password</button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#14161f] p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4"><ShieldCheck className="h-5 w-5 text-[#bfa37c]" /><div><h2 className="font-bold text-white">Authenticator OTP</h2><p className="text-xs text-[#9a9da8]">Use Google Authenticator or Microsoft Authenticator for admin login verification.</p></div></div>
        {verifiedFactor ? (
          <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-2 text-sm text-emerald-300"><KeyRound className="h-4 w-4" /> OTP protection is enabled</div><button type="button" onClick={() => void removeFactor(verifiedFactor.id)} disabled={isBusy} className="flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-300 disabled:opacity-60"><Trash2 className="h-4 w-4" /> Disable OTP</button></div>
        ) : !qrCode ? (
          <button type="button" onClick={() => void startOtpSetup()} disabled={isBusy} className="rounded-lg bg-[#bfa37c] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#0e1015] disabled:opacity-60">Set up authenticator OTP</button>
        ) : (
          <div className="grid gap-6 md:grid-cols-[180px_1fr]">
            <img src={qrCode} alt="Scan this QR code with your authenticator app" className="h-44 w-44 rounded-lg bg-white p-2" />
            <form onSubmit={verifyOtpSetup} className="space-y-4"><p className="text-sm text-[#d7d8dd]">Scan the QR code, then enter the six-digit code shown by your authenticator app.</p><p className="break-all rounded-lg bg-[#0e1015] p-3 text-xs text-[#9a9da8]">Manual key: {secret}</p><input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-3 text-center text-xl tracking-[0.4em] text-white outline-none focus:border-[#bfa37c]" /><button type="submit" disabled={isBusy} className="rounded-lg bg-[#bfa37c] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#0e1015] disabled:opacity-60">Verify and enable OTP</button></form>
          </div>
        )}
      </section>
    </div>
  );
}
