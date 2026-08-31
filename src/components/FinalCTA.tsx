import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Mail, MessageSquare, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface FinalCTAProps {
  onNavigate: (sectionId: string) => void;
  onSetCursorText: (text?: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigate, onSetCursorText }) => {
  return (
    <section className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#0c0d12] border-t border-white/10 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a880]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13151c] border border-[#c5a880]/30 text-xs font-mono text-[#c5a880] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>START A PROJECT OR WORKFLOW AUDIT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.0]">
            LET&apos;S DESIGN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a880] via-[#e8e9ed] to-white">
              WHAT&apos;S NEXT.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-[#d4d4ce] max-w-2xl mx-auto font-light leading-relaxed">
            Architecture, BIM, AI, visualization or digital learning — let&apos;s build something meaningful and technically extraordinary together.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('consultation');
              }}
              onMouseEnter={() => {
                soundManager.playTick(950);
                onSetCursorText('START');
              }}
              onMouseLeave={() => onSetCursorText(undefined)}
              className="px-8 py-4 rounded-xl bg-[#c5a880] text-[#0c0d12] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#d8be96] active:scale-95 transition-all flex items-center gap-2 shadow-2xl shadow-[#c5a880]/25"
            >
              <span>Start A Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('work');
              }}
              onMouseEnter={() => {
                soundManager.playTick(850);
                onSetCursorText('WORK');
              }}
              onMouseLeave={() => onSetCursorText(undefined)}
              className="px-8 py-4 rounded-xl bg-[#13151c] border border-white/20 text-white font-mono text-xs font-medium uppercase tracking-wider hover:bg-[#181b24] hover:border-[#c5a880]/50 transition-all flex items-center gap-2"
            >
              <span>Explore The Work</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
