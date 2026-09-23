import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Sparkles, Mail, X } from 'lucide-react';
import { useData } from '../data/DataContext';
import { soundManager } from '../utils/sound';

export const MasterclassSection: React.FC = () => {
  const { data } = useData();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    soundManager.playClick();
    setSubmitted(true);
  };

  const handleClose = () => {
    soundManager.playClick();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto no-scrollbar bg-[#0e1015]/80 px-4 py-6 backdrop-blur-sm sm:items-center sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="masterclass-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-[#14161f] border border-white/15 p-6 sm:p-12 lg:p-16 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close masterclass alert"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0e1015]/80 text-[#c4c6cf] transition-colors hover:border-[#bfa37c]/50 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Subtle Ambient Background Gradient */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#bfa37c]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#bfa37c]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl">
              {/* Tag */}
              <div className="inline-flex max-w-full items-center gap-2 px-3.5 py-1 rounded-full bg-[#181a24] border border-[#bfa37c]/30 text-[10px] sm:text-[11px] font-sans font-bold text-[#bfa37c] uppercase tracking-[0.16em] sm:tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="truncate">UPCOMING RELEASE · Q3 2025</span>
              </div>

              {/* Headline */}
              <h2 id="masterclass-title" className="text-3xl sm:text-5xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
                {data.masterclass.title} <br />
                <span className="font-serif italic font-normal text-[#d6be9c] tracking-normal inline-block">
                  {data.masterclass.status}.
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#c4c6cf] font-normal leading-relaxed">
                {data.masterclass.description}
              </p>

              {/* Waitlist Form */}
              <div className="pt-2">
                {submitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-sm text-emerald-300 font-sans">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>You are on the priority waitlist! We will notify you with early-bird registration.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-[#9a9da8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0e1015] border border-white/15 text-sm text-white placeholder-[#9a9da8] focus:outline-none focus:border-[#bfa37c] transition-colors font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-xl bg-[#bfa37c] text-[#0e1015] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#d6be9c] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#bfa37c]/20 shrink-0"
                    >
                      <span>JOIN WAITLIST</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2 text-[11px] font-sans text-[#9a9da8]">
                <span>Limited to 100 Studio Cohort Members</span>
                <span className="hidden sm:inline">·</span>
                <span>Direct Mentorship with Ar. Ahmed</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
