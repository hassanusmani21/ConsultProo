import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1015] flex items-center justify-center p-4 selection:bg-[#bfa37c] selection:text-[#0e1015]">
      <div className="w-full max-w-md bg-[#14161f] border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#bfa37c]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-xl border border-[#bfa37c]/30 bg-[#181a24] flex items-center justify-center text-[#bfa37c]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-sans font-bold text-white mt-4">System Access</h1>
            <p className="text-sm text-[#9a9da8] font-sans">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-[10px] font-sans font-bold text-[#bfa37c] uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9a9da8] focus:outline-none focus:border-[#bfa37c] transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-sans font-bold text-[#bfa37c] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#9a9da8] focus:outline-none focus:border-[#bfa37c] transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9da8] pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs font-sans p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                {error}
              </div>
            )}
            
            <div className="text-xs text-[#9a9da8] italic p-3 bg-[#181a24] border border-white/5 rounded-lg">
              Note: This is a UI placeholder. Real authentication will be handled by a secure backend API. You can enter any values to preview the UI.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#bfa37c] text-[#0e1015] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#d6be9c] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{isLoading ? 'Authenticating...' : 'Secure Login'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
